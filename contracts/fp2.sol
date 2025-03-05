/*
 * Copyright © 2025 Kaleido, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity ^0.8.28;

import {CommonLib} from "./common.sol";
import {FpLib} from "./fp.sol";

library Fp2Lib {
    using FpLib for CommonLib.Fp;

    function zero() internal pure returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: FpLib.zero(), b: FpLib.zero()});
    }
    function add(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a.add(other.a), b: self.b.add(other.b)});
    }

    function sub(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a.sub(other.a), b: self.b.sub(other.b)});
    }
    function neg(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a.neg(), b: self.b.neg()});
    }

    function mul(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) internal view returns (CommonLib.Fp2 memory) {
        // (a+bi)(c+di) = (ac−bd) + (ad+bc)i

        CommonLib.Fp memory t1 = a.a.mul(b.a);
        CommonLib.Fp memory t2 = a.b.mul(b.b);

        // (T1 - T2) + ((c0 + c1) * (r0 + r1) - (T1 + T2))*i
        CommonLib.Fp memory c0 = t1.sub(t2);
        CommonLib.Fp memory c1 = a.a.add(a.b).mul(b.a.add(b.b)).sub(t1.add(t2));
        return CommonLib.Fp2({a: c0, b: c1});
    }

    function invert(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        // (self.c0 * self.c0 + self.c1 * self.c1).invert()
        CommonLib.Fp memory c0_square = self.a.mul(self.a);
        CommonLib.Fp memory c1_square = self.b.mul(self.b);
        CommonLib.Fp memory temp = c0_square.add(c1_square);

        CommonLib.Fp memory inv = temp.invert();

        // Computing c0, c1 constrained.
        // TODO how can this be improved?
        // c0 = self.c0 * inv
        // c1 = self.c1 * (-inv)
        CommonLib.Fp memory res_c0 = self.a.mul(inv);
        CommonLib.Fp memory res_c1 = self.b.mul(inv).neg();

        return CommonLib.Fp2({a: res_c0, b: res_c1});
    }

    function square(
        CommonLib.Fp2 memory a
    ) internal view returns (CommonLib.Fp2 memory) {
        // aa = a + b
        // bb = a - b
        // cc = a + a
        CommonLib.Fp memory aa = a.a.add(a.b);
        CommonLib.Fp memory bb = a.a.sub(a.b);
        CommonLib.Fp memory cc = a.a.add(a.a);

        // res_a = (a + b) * (a - b)
        CommonLib.Fp memory res_a = aa.mul(bb);
        // res_b = (a + a) * b
        CommonLib.Fp memory res_b = cc.mul(a.b);

        return CommonLib.Fp2({a: res_a, b: res_b});
    }

    function mul_by_nonresidue(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        // Multiply c0 + c1*u by u + 1:
        // (c0 + c1*u)(u + 1)
        // = c0 * u + c0 + c1 * u^2 + c1 * u
        // and because u^2 = -1, we get
        // = c0 * u + c0 - c1 + c1 * u
        // (c0 - c1) + (c0 + c1)u
        return CommonLib.Fp2({a: self.a.sub(self.b), b: self.a.add(self.b)});
    }

    function conjugate(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a, b: self.b.neg()});
    }

    function frobenius_map(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        // (c0 + c1*u)^p = c0^p + (c1*u)^p
        // and c0^p=c0, c1^p=c1, and u^p = -u, so the result is:
        // c0 - c1
        return conjugate(self);
    }
}

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
        return CommonLib.Fp2({c0: FpLib.zero(), c1: FpLib.zero()});
    }

    function one() internal pure returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({c0: FpLib.one(), c1: FpLib.zero()});
    }

    function add(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal view returns (CommonLib.Fp2 memory) {
        return
            CommonLib.Fp2({
                c0: self.c0.add(other.c0).mod(),
                c1: self.c1.add(other.c1).mod()
            });
    }

    function sub(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal view returns (CommonLib.Fp2 memory) {
        return
            CommonLib.Fp2({
                c0: self.c0.sub(other.c0),
                c1: self.c1.sub(other.c1)
            });
    }
    function neg(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({c0: self.c0.neg(), c1: self.c1.neg()});
    }

    function mul(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal view returns (CommonLib.Fp2 memory) {
        // (a+bi)(c+di) = (ac−bd) + (ad+bc)i

        CommonLib.Fp memory t1 = self.c0.mul(other.c0);
        CommonLib.Fp memory t2 = self.c1.mul(other.c1);

        // (T1 - T2) + ((c0 + c1) * (r0 + r1) - (T1 + T2))*i
        CommonLib.Fp memory c0 = t1.sub(t2);
        CommonLib.Fp memory c1 = self
            .c0
            .add(self.c1)
            .mod()
            .mul(other.c0.add(other.c1).mod())
            .sub(t1.add(t2).mod());
        return CommonLib.Fp2({c0: c0, c1: c1});
    }

    function invert(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        // (self.c0 * self.c0 + self.c1 * self.c1).invert()
        CommonLib.Fp memory c0_square = self.c0.mul(self.c0);
        CommonLib.Fp memory c1_square = self.c1.mul(self.c1);
        CommonLib.Fp memory temp = c0_square.add(c1_square).mod();

        CommonLib.Fp memory inv = temp.invert();

        // Computing c0, c1 constrained.
        // TODO how can this be improved?
        // c0 = self.c0 * inv
        // c1 = self.c1 * (-inv)
        CommonLib.Fp memory res_c0 = self.c0.mul(inv);
        CommonLib.Fp memory res_c1 = self.c1.mul(inv).neg();

        return CommonLib.Fp2({c0: res_c0, c1: res_c1});
    }

    function square(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        // aa = a + b
        // bb = a - b
        // cc = a + a
        CommonLib.Fp memory aa = self.c0.add(self.c1).mod();
        CommonLib.Fp memory bb = self.c0.sub(self.c1);
        CommonLib.Fp memory cc = self.c0.add(self.c0).mod();

        // res_a = (a + b) * (a - b)
        CommonLib.Fp memory res_a = aa.mul(bb);
        // res_b = (a + a) * b
        CommonLib.Fp memory res_b = cc.mul(self.c1);

        return CommonLib.Fp2({c0: res_a, c1: res_b});
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
        return
            CommonLib.Fp2({
                c0: self.c0.sub(self.c1),
                c1: self.c0.add(self.c1).mod()
            });
    }

    function conjugate(
        CommonLib.Fp2 memory self
    ) internal view returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({c0: self.c0, c1: self.c1.neg()});
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

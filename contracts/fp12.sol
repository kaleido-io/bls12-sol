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
import {Fp2Lib} from "./fp2.sol";
import {Fp6Lib} from "./fp6.sol";

library Fp12Lib {
    using Fp12Lib for CommonLib.Fp12;
    using Fp6Lib for CommonLib.Fp6;
    using Fp2Lib for CommonLib.Fp2;
    using FpLib for CommonLib.Fp;

    function one() internal pure returns (CommonLib.Fp12 memory) {
        return CommonLib.Fp12({c0: Fp6Lib.one(), c1: Fp6Lib.zero()});
    }

    function mul(
        CommonLib.Fp12 memory self,
        CommonLib.Fp12 memory other
    ) internal view returns (CommonLib.Fp12 memory) {
        // aa = self.c0 * other.c0
        CommonLib.Fp6 memory aa = self.c0.mul(other.c0);

        // bb = self.c1 * other.c1
        CommonLib.Fp6 memory bb = self.c1.mul(other.c1);

        // o = other.c0 + other.c1
        CommonLib.Fp6 memory o = other.c0.add(other.c1);

        // c1 = (self.c1 + self.c0) * (other.c0 + other.c1) - aa - bb
        CommonLib.Fp6 memory c1 = self.c1.add(self.c0).mul(o).sub(aa).sub(bb);

        // c0 = bb * nonresidue + aa
        CommonLib.Fp6 memory c0 = bb.mul_by_nonresidue().add(aa);

        // Return the final Fp12 structure
        return CommonLib.Fp12({c0: c0, c1: c1});
    }

    function square(
        CommonLib.Fp12 memory self
    ) internal view returns (CommonLib.Fp12 memory) {
        // ab = self.c0 * self.c1
        CommonLib.Fp6 memory ab = self.c0.mul(self.c1);
        // c0_plus_c1 = self.c0 + self.c1
        CommonLib.Fp6 memory c0_plus_c1 = self.c0.add(self.c1);
        // temp = self.c1 * nonresidue
        CommonLib.Fp6 memory temp = self.c1.mul_by_nonresidue();
        // temp_with_c0 = temp + self.c0
        // temp_with_c0 = (self.c1 * nonresidue) + self.c0
        CommonLib.Fp6 memory temp_with_c0 = temp.add(self.c0);
        // step 1: c0 = temp_with_c0 * c0_plus_c1 - ab
        // c0 = (self.c1 * nonresidue + self.c0) * (self.c0 + self.c1) - ab
        CommonLib.Fp6 memory c0 = temp_with_c0.mul(c0_plus_c1).sub(ab);
        // step 2: c0 = ((self.c1 * nonresidue + self.c0) * (self.c0 + self.c1) - ab) - (ab * nonresidue)
        c0 = c0.sub(ab.mul_by_nonresidue());
        // c1 = 2 * ab
        CommonLib.Fp6 memory c1 = ab.add(ab);
        // Return the final Fp12 structure
        return CommonLib.Fp12({c0: c0, c1: c1});
    }

    function mul_by_014(
        CommonLib.Fp12 memory self,
        CommonLib.Fp2 memory c0,
        CommonLib.Fp2 memory c1,
        CommonLib.Fp2 memory c4
    ) internal view returns (CommonLib.Fp12 memory) {
        unchecked {
            CommonLib.Fp6 memory aa = self.c0.mul_by_01(c0, c1);
            CommonLib.Fp6 memory bb = self.c1.mul_by_1(c4);
            CommonLib.Fp2 memory o = c1.add(c4);
            CommonLib.Fp6 memory cc1 = self.c1.add(self.c0);
            cc1 = cc1.mul_by_01(c0, o);
            cc1 = cc1.sub(aa).sub(bb);
            CommonLib.Fp6 memory cc0 = bb;
            cc0 = cc0.mul_by_nonresidue();
            cc0 = cc0.add(aa);
            return CommonLib.Fp12({c0: cc0, c1: cc1});
        }
    }

    function conjugate(
        CommonLib.Fp12 memory self
    ) internal view returns (CommonLib.Fp12 memory) {
        return CommonLib.Fp12({c0: self.c0, c1: self.c1.neg()});
    }

    function invert(
        CommonLib.Fp12 memory self
    ) internal view returns (CommonLib.Fp12 memory) {
        CommonLib.Fp6 memory t = self.c0.square().sub(
            self.c1.square().mul_by_nonresidue()
        );
        // This will error if there's no inverse
        t = t.invert();
        return CommonLib.Fp12({c0: self.c0.mul(t), c1: self.c1.mul(t.neg())});
    }

    function frobenius_map(
        CommonLib.Fp12 memory self
    ) internal view returns (CommonLib.Fp12 memory) {
        CommonLib.Fp6 memory c0 = Fp6Lib.frobenius_map(self.c0);
        CommonLib.Fp6 memory c1 = Fp6Lib.frobenius_map(self.c1);

        // c1 = c1 * (u + 1)^((p - 1) / 6)
        // (u + 1)^((p - 1) / 6)
        CommonLib.Fp6 memory constant1 = CommonLib.Fp6({
            c0: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x1904d3bf02bb0667c231beb4202c0d1f,
                    b: 0x0fd603fd3cbd5f4f7b2443d784bab9c4f67ea53d63e7813d8d0775ed92235fb8
                }),
                c1: CommonLib.Fp({
                    a: 0x00fc3e2b36c4e03288e9e902231f9fb8,
                    b: 0x54a14787b6c7b36fec0c8ec971f63c5f282d5ac14d6c7ec22cf78a126ddc4af3
                })
            }),
            c1: Fp2Lib.zero(),
            c2: Fp2Lib.zero()
        });

        c1 = Fp6Lib.mul(c1, constant1);

        return CommonLib.Fp12({c0: c0, c1: c1});
    }
}

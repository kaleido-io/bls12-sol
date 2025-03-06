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

library Fp6Lib {
    using FpLib for CommonLib.Fp;
    using Fp2Lib for CommonLib.Fp2;

    function zero() internal pure returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: Fp2Lib.zero(),
                c1: Fp2Lib.zero(),
                c2: Fp2Lib.zero()
            });
    }
    function one() internal pure returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: Fp2Lib.one(),
                c1: Fp2Lib.zero(),
                c2: Fp2Lib.zero()
            });
    }
    function add(
        CommonLib.Fp6 memory self,
        CommonLib.Fp6 memory other
    ) internal view returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: self.c0.add(other.c0),
                c1: self.c1.add(other.c1),
                c2: self.c2.add(other.c2)
            });
    }

    function sub(
        CommonLib.Fp6 memory self,
        CommonLib.Fp6 memory other
    ) internal view returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: self.c0.sub(other.c0),
                c1: self.c1.sub(other.c1),
                c2: self.c2.sub(other.c2)
            });
    }

    function mul(
        CommonLib.Fp6 memory self,
        CommonLib.Fp6 memory other
    ) internal view returns (CommonLib.Fp6 memory) {
        return mul_interleaved(self, other);
    }

    function neg(
        CommonLib.Fp6 memory self
    ) internal view returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: self.c0.neg(),
                c1: self.c1.neg(),
                c2: self.c2.neg()
            });
    }

    function square(
        CommonLib.Fp6 memory self
    ) internal view returns (CommonLib.Fp6 memory) {
        // s0 = self.c0^2
        CommonLib.Fp2 memory s0 = self.c0.square();

        // ab = self.c0 * self.c1
        // s1 = 2 * ab
        CommonLib.Fp2 memory ab = self.c0.mul(self.c1);
        CommonLib.Fp2 memory s1 = ab.add(ab);

        // s2 = (self.c0 - self.c1 + self.c2)^2
        CommonLib.Fp2 memory s2 = (self.c0.sub(self.c1).add(self.c2)).square();

        // bc = self.c1 * self.c2
        // s3 = 2 * bc
        CommonLib.Fp2 memory bc = self.c1.mul(self.c2);
        CommonLib.Fp2 memory s3 = bc.add(bc);

        // s4 = self.c2^2
        CommonLib.Fp2 memory s4 = self.c2.square();

        return
            CommonLib.Fp6({
                c0: s3.mul_by_nonresidue().add(s0),
                c1: s4.mul_by_nonresidue().add(s1),
                c2: s1.add(s2).add(s3).sub(s0).sub(s4)
            });
    }

    function invert(
        CommonLib.Fp6 memory self
    ) internal view returns (CommonLib.Fp6 memory) {
        CommonLib.Fp2 memory c0 = self.c1.mul(self.c2).mul_by_nonresidue();
        c0 = self.c0.square().sub(c0);

        CommonLib.Fp2 memory c1 = self.c2.square().mul_by_nonresidue();
        c1 = c1.sub(self.c0.mul(self.c1));

        CommonLib.Fp2 memory c2 = self.c1.square();
        c2 = c2.sub(self.c0.mul(self.c2));

        CommonLib.Fp2 memory tmp = (self.c1.mul(c2).add(self.c2.mul(c1)))
            .mul_by_nonresidue()
            .add(self.c0.mul(c0));

        // This will error if there is no inverse
        CommonLib.Fp2 memory inv_tmp = tmp.invert();

        CommonLib.Fp2 memory res_c0 = c0.mul(inv_tmp);
        CommonLib.Fp2 memory res_c1 = c1.mul(inv_tmp);
        CommonLib.Fp2 memory res_c2 = c2.mul(inv_tmp);

        return CommonLib.Fp6({c0: res_c0, c1: res_c1, c2: res_c2});
    }

    function mul_by_01(
        CommonLib.Fp6 memory self,
        CommonLib.Fp2 memory c0,
        CommonLib.Fp2 memory c1
    ) internal view returns (CommonLib.Fp6 memory) {
        unchecked {
            CommonLib.Fp2 memory a_a = self.c0.mul(c0);
            CommonLib.Fp2 memory b_b = self.c1.mul(c1);
            CommonLib.Fp2 memory t1 = self.c2.mul(c1).mul_by_nonresidue().add(
                a_a
            );
            CommonLib.Fp2 memory t2 = c0
                .add(c1)
                .mul(self.c0.add(self.c1))
                .sub(a_a)
                .sub(b_b);
            CommonLib.Fp2 memory t3 = self.c2.mul(c0).add(b_b);

            return CommonLib.Fp6({c0: t1, c1: t2, c2: t3});
        }
    }
    function mul_by_1(
        CommonLib.Fp6 memory self,
        CommonLib.Fp2 memory c1
    ) internal view returns (CommonLib.Fp6 memory) {
        return
            CommonLib.Fp6({
                c0: self.c2.mul(c1).mul_by_nonresidue(),
                c1: self.c0.mul(c1),
                c2: self.c1.mul(c1)
            });
    }
    function mul_by_nonresidue(
        CommonLib.Fp6 memory self
    ) internal view returns (CommonLib.Fp6 memory) {
        // Multiply c0 + c1 * v + c2 * v^2 by v
        // (c0 + c1 * v + c2 * v^2) * v
        // = c0 * v + c1 * v^2 + c2 * v^3
        // And v^3 equals (u + 1):
        // = c0 * v + c1 * v^2 + c2 * (u + 1)
        // = c0 * v + c1 * v^2 + c2 * u + c2
        // rewrite according to the coefficients
        // = (c2 * u + c2) + (c0 * v) + (c1 * v^2)
        // = (c2 * (u + 1)) + (c0 * v) + (c1 * v^2)
        return
            CommonLib.Fp6({
                c0: self.c2.mul_by_nonresidue(), // c2 * (u + 1)
                c1: self.c0, // c0
                c2: self.c1 // c1
            });
    }

    // https://github.com/zkcrypto/bls12_381/blob/main/src/fp6.rs#L200
    // https://eprint.iacr.org/2022/367
    // for inputs `a = (a0, a1, a2)` and `b = (b0, b1, b2)`,
    // return multiplication a*b
    function mul_interleaved(
        CommonLib.Fp6 memory a,
        CommonLib.Fp6 memory b
    ) internal view returns (CommonLib.Fp6 memory) {
        // Unconstrained calculations first
        //   result_c0_0 = a00 * b00 - a01 * b01 + a10 * b20 - a11 * b21 + a20 * b10 - a21 * b11
        //                                        - a10 * b21 - a11 * b20 - a20 * b11 - a21 * b10.
        //               = a00 * b00 - a01 * b01 + a10 * (b20 - b21) - a11 * (b20 + b21)
        //                                        + a20 * (b10 - b11) - a21 * (b10 + b11).
        CommonLib.Fp memory b20_m_b21 = b.c2.c0.sub(b.c2.c1);
        CommonLib.Fp memory b20_p_b21 = b.c2.c0.add(b.c2.c1).mod();
        CommonLib.Fp memory b10_m_b11 = b.c1.c0.sub(b.c1.c1);
        CommonLib.Fp memory b10_p_b11 = b.c1.c0.add(b.c1.c1).mod();
        CommonLib.Fp memory result_c0_0 = a
            .c0
            .c0
            .mul(b.c0.c0)
            .sub(a.c0.c1.mul(b.c0.c1))
            .add(a.c1.c0.mul(b20_m_b21))
            .mod()
            .sub(a.c1.c1.mul(b20_p_b21))
            .add(a.c2.c0.mul(b10_m_b11))
            .mod()
            .sub(a.c2.c1.mul(b10_p_b11));

        //   result_c0_1 = a00 * b01 + a01 * b00 + a10 * b21 + a11 * b20 + a20 * b11 + a21 * b10
        //                                        + a10 * b20 - a11 * b21 + a20 * b10 - a21 * b11.
        //               = a00 * b01 + a01 * b00 + a10 * (b20 + b21) + a11 * (b20 - b21)
        //                                        + a20 * (b10 + b11) + a21 * (b10 - b11).
        CommonLib.Fp memory result_c0_1 = a
            .c0
            .c0
            .mul(b.c0.c1)
            .add(a.c0.c1.mul(b.c0.c0))
            .mod()
            .add(a.c1.c0.mul(b20_p_b21))
            .mod()
            .add(a.c1.c1.mul(b20_m_b21))
            .mod()
            .add(a.c2.c0.mul(b10_p_b11))
            .mod()
            .add(a.c2.c1.mul(b10_m_b11))
            .mod();

        //   result_c1_0 = a00 * b10 - a01 * b11 + a10 * b00 - a11 * b01 + a20 * b20 - a21 * b21
        //                                                          - a20 * b21 - a21 * b20.
        //               = a00 * b10 - a01 * b11 + a10 * b00 - a11 * b01 + a20 * (b20 - b21)
        //                                                          - a21 * (b20 + b21).
        CommonLib.Fp memory result_c1_0 = a
            .c0
            .c0
            .mul(b.c1.c0)
            .sub(a.c0.c1.mul(b.c1.c1))
            .add(a.c1.c0.mul(b.c0.c0))
            .mod()
            .sub(a.c1.c1.mul(b.c0.c1))
            .add(a.c2.c0.mul(b20_m_b21))
            .mod()
            .sub(a.c2.c1.mul(b20_p_b21));

        //   result_c1_1 = a00 * b11 + a01 * b10 + a10 * b01 + a11 * b00 + a20 * b21 + a21 * b20
        //                                                          + a20 * b20 - a21 * b21.
        //               = a00 * b11 + a01 * b10 + a10 * b01 + a11 * b00 + a20 * (b20 + b21)
        //                                                          + a21 * (b20 - b21).
        CommonLib.Fp memory result_c1_1 = a
            .c0
            .c0
            .mul(b.c1.c1)
            .add(a.c0.c1.mul(b.c1.c0))
            .mod()
            .add(a.c1.c0.mul(b.c0.c1))
            .mod()
            .add(a.c1.c1.mul(b.c0.c0))
            .mod()
            .add(a.c2.c0.mul(b20_p_b21))
            .mod()
            .add(a.c2.c1.mul(b20_m_b21))
            .mod();

        //   result_c2_0 = a00 * b20 - a01 * b21 + a10 * b10 - a11 * b11 + a20 * b00 - a21 * b01.
        CommonLib.Fp memory result_c2_0 = a
            .c0
            .c0
            .mul(b.c2.c0)
            .sub(a.c0.c1.mul(b.c2.c1))
            .add(a.c1.c0.mul(b.c1.c0))
            .mod()
            .sub(a.c1.c1.mul(b.c1.c1))
            .add(a.c2.c0.mul(b.c0.c0))
            .mod()
            .sub(a.c2.c1.mul(b.c0.c1));

        //   result_c2_1 = a00 * b21 + a01 * b20 + a10 * b11 + a11 * b10 + a20 * b01 + a21 * b00.
        CommonLib.Fp memory result_c2_1 = a
            .c0
            .c0
            .mul(b.c2.c1)
            .add(a.c0.c1.mul(b.c2.c0))
            .mod()
            .add(a.c1.c0.mul(b.c1.c1))
            .mod()
            .add(a.c1.c1.mul(b.c1.c0))
            .mod()
            .add(a.c2.c0.mul(b.c0.c1))
            .mod()
            .add(a.c2.c1.mul(b.c0.c0))
            .mod();

        return
            CommonLib.Fp6({
                c0: CommonLib.Fp2({c0: result_c0_0, c1: result_c0_1}),
                c1: CommonLib.Fp2({c0: result_c1_0, c1: result_c1_1}),
                c2: CommonLib.Fp2({c0: result_c2_0, c1: result_c2_1})
            });
    }
    function frobenius_map(
        CommonLib.Fp6 memory self
    ) internal view returns (CommonLib.Fp6 memory) {
        CommonLib.Fp2 memory c0 = self.c0.frobenius_map();
        CommonLib.Fp2 memory c1 = self.c1.frobenius_map();
        CommonLib.Fp2 memory c2 = self.c2.frobenius_map();
        // Twist
        // c1 = c1 * (u + 1)^((p - 1) / 3)
        // (u + 1)^((p - 1) / 3)
        CommonLib.Fp2 memory constant1 = CommonLib.Fp2({
            c0: FpLib.zero(),
            c1: CommonLib.Fp({
                a: 0x1a0111ea397fe699ec02408663d4de85,
                b: 0xaa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaac
            })
        });
        // c2 = c2 * (u + 1)^((2p - 2) / 3)
        //(u + 1)^((2p - 2) / 3)
        CommonLib.Fp2 memory constant2 = CommonLib.Fp2({
            c0: CommonLib.Fp({
                a: 0x1a0111ea397fe699ec02408663d4de85,
                b: 0xaa0d857d89759ad4897d29650fb85f9b409427eb4f49fffd8bfd00000000aaad
            }),
            c1: FpLib.zero()
        });

        c1 = c1.mul(constant1);
        c2 = c2.mul(constant2);

        return CommonLib.Fp6({c0: c0, c1: c1, c2: c2});
    }
}

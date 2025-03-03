//SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.28;

import {CommonLib} from "./common.sol";
import {FpLib} from "./fp.sol";
import {Fp2Lib} from "./fp2.sol";
import {Fp6Lib} from "./fp6.sol";
import {console} from "hardhat/console.sol";

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
        CommonLib.Fp6 memory c1 = self.c1.add(self.c0);
        c1 = c1.mul(o);
        c1 = c1.sub(aa);
        c1 = c1.sub(bb);

        // c0 = bb * nonresidue + aa
        CommonLib.Fp6 memory c0 = bb.mul_by_nonresidue();
        c0 = c0.add(aa);

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
            console.log("Fp12Lib.mul_by_014 - 1");
            CommonLib.Fp6 memory aa = self.c0.mul_by_01(c0, c1);
            CommonLib.Fp6 memory bb = self.c1.mul_by_1(c4);
            console.log("Fp12Lib.mul_by_014 - 2");
            CommonLib.Fp2 memory o = c1.add(c4);
            CommonLib.Fp6 memory cc1 = self.c1.add(self.c0);
            console.log("Fp12Lib.mul_by_014 - 3");
            cc1 = cc1.mul_by_01(c0, o);
            cc1 = cc1.sub(aa).sub(bb);
            console.log("Fp12Lib.mul_by_014 - 4");
            CommonLib.Fp6 memory cc0 = bb;
            cc0 = cc0.mul_by_nonresidue();
            cc0 = cc0.add(aa);
            console.log("Fp12Lib.mul_by_014 - 5");
            return CommonLib.Fp12({c0: cc0, c1: cc1});
        }
    }

    function conjugate(
        CommonLib.Fp12 memory self
    ) internal pure returns (CommonLib.Fp12 memory) {
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
                a: CommonLib.Fp({
                    a: 0x7ea53d63e7813d8d0775ed92235fb83,
                    b: 0xfd3cbd5f4f7b2443d784bab9c4f6bf02bb0667c231beb4202c0d1f0fd61904d3
                }),
                b: CommonLib.Fp({
                    a: 0x2d5ac14d6c7ec22cf78a126ddc4af3,
                    b: 0x4787b6c7b36fec0c8ec971f63c5f282b36c4e03288e9e902231f9fb854a1fc3e
                })
            }),
            c1: Fp2Lib.zero(),
            c2: Fp2Lib.zero()
        });

        c1 = Fp6Lib.mul(c1, constant1);

        return CommonLib.Fp12({c0: c0, c1: c1});
    }

    function cyclotomic_square(
        CommonLib.Fp12 memory f
    ) internal view returns (CommonLib.Fp12 memory) {
        CommonLib.Fp2 memory z0 = f.c0.c0;
        CommonLib.Fp2 memory z4 = f.c0.c1;
        CommonLib.Fp2 memory z3 = f.c0.c2;
        CommonLib.Fp2 memory z2 = f.c1.c0;
        CommonLib.Fp2 memory z1 = f.c1.c1;
        CommonLib.Fp2 memory z5 = f.c1.c2;

        (CommonLib.Fp2 memory t0, CommonLib.Fp2 memory t1) = fp4_square(z0, z1);

        z0 = t0.sub(z0);
        z0 = z0.add(z0).add(t0);
        z1 = t1.add(z1);
        z1 = z1.add(z1).add(t1);

        (t0, t1) = fp4_square(z2, z3);
        (CommonLib.Fp2 memory t2, CommonLib.Fp2 memory t3) = fp4_square(z4, z5);

        z4 = t0.sub(z4);
        z4 = z4.add(z4).add(t0);

        z5 = t1.add(z5);
        z5 = z5.add(z5).add(t1);

        t0 = t3.mul_by_nonresidue();
        z2 = t0.add(z2);
        z2 = z2.add(z2).add(t0);

        z3 = t2.sub(z3);
        z3 = z3.add(z3).add(t2);

        return
            CommonLib.Fp12({
                c0: CommonLib.Fp6({c0: z0, c1: z4, c2: z3}),
                c1: CommonLib.Fp6({c0: z2, c1: z1, c2: z5})
            });
    }

    function cycolotomic_exp(
        CommonLib.Fp12 memory f
    ) internal view returns (CommonLib.Fp12 memory) {
        // https://github.com/zkcrypto/bls12_381/blob/main/src/pairings.rs#L119
        // Got array from zkcrypto impl
        bool[64] memory booleans = [
            true,
            true,
            false,
            true,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ];

        CommonLib.Fp12 memory tmp = Fp12Lib.one();
        bool found_one = false;
        for (uint256 i = 0; i < 64; i++) {
            if (found_one) {
                tmp = cyclotomic_square(tmp);
            } else {
                found_one = booleans[i];
            }

            if (booleans[i]) {
                tmp = tmp.mul(f);
            }
        }

        return tmp.conjugate();
    }

    function fp4_square(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) internal view returns (CommonLib.Fp2 memory, CommonLib.Fp2 memory) {
        CommonLib.Fp2 memory t0 = a.square();
        CommonLib.Fp2 memory t1 = b.square();
        CommonLib.Fp2 memory t2 = t1.mul_by_nonresidue();
        CommonLib.Fp2 memory c0 = t2.add(t0);
        t2 = a.add(b);
        t2 = t2.square();
        t2 = t2.sub(t0);
        CommonLib.Fp2 memory c1 = t2.sub(t1);

        return (c0, c1);
    }

    function final_exponentiation(
        CommonLib.Fp12 memory self
    ) internal view returns (CommonLib.Fp12 memory) {
        CommonLib.Fp12 memory f = self;
        CommonLib.Fp12 memory t0 = f
            .frobenius_map()
            .frobenius_map()
            .frobenius_map()
            .frobenius_map()
            .frobenius_map()
            .frobenius_map();
        // This will error if inverse doesn't exist
        CommonLib.Fp12 memory t1 = f.invert();
        CommonLib.Fp12 memory t2 = t0.mul(t1);
        t1 = t2;
        t2 = t2.frobenius_map().frobenius_map();
        t2 = t2.mul(t1);
        t1 = cyclotomic_square(t2).conjugate();
        CommonLib.Fp12 memory t3 = cycolotomic_exp(t2);
        CommonLib.Fp12 memory t4 = cyclotomic_square(t3);
        CommonLib.Fp12 memory t5 = t1.mul(t3);
        t1 = cycolotomic_exp(t5);
        t0 = cycolotomic_exp(t1);
        CommonLib.Fp12 memory t6 = cycolotomic_exp(t0);
        t6 = t6.mul(t4);
        t4 = cycolotomic_exp(t6);
        t5 = t5.conjugate();
        t4 = t4.mul(t5).mul(t2);
        t5 = t2.conjugate();
        t1 = t1.mul(t2);
        t1 = t1.frobenius_map().frobenius_map().frobenius_map();
        t6 = t6.mul(t5);
        t6 = t6.frobenius_map();
        t3 = t3.mul(t0);
        t3 = t3.frobenius_map().frobenius_map();
        t3 = t3.mul(t1);
        t3 = t3.mul(t6);
        f = t3.mul(t4);
        return f;
    }
}

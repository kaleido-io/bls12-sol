//SPDX-License-Identifier: MIT OR Apache-2.0
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
    ) internal pure returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a.add(other.a), b: self.b.add(other.b)});
    }

    function sub(
        CommonLib.Fp2 memory self,
        CommonLib.Fp2 memory other
    ) internal pure returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a.sub(other.a), b: self.b.sub(other.b)});
    }
    function neg(
        CommonLib.Fp2 memory self
    ) internal pure returns (CommonLib.Fp2 memory) {
        return
            CommonLib.Fp2({
                a: FpLib.zero().sub(self.a),
                b: FpLib.zero().sub(self.b)
            });
    }

    function mul(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) internal view returns (CommonLib.Fp2 memory) {
        CommonLib.Fp memory non_residue = CommonLib.Fp({
            a: 0x01ae3a4617c510eac63b05c06ca1493b,
            b: 0x1a22d9f300f5138f1ef3622fba094800170b5d44300000008508bffffffffffc
        });

        CommonLib.Fp memory v0 = a.a.mul(b.a);
        CommonLib.Fp memory v1 = a.b.mul(b.b);

        CommonLib.Fp memory res1 = a.b.add(a.a);
        res1 = res1.mul(b.a.add(b.b));
        res1 = res1.sub(v0);
        res1 = res1.sub(v1);
        CommonLib.Fp memory res0 = v0.add(v1.mul(non_residue));
        return CommonLib.Fp2({a: res0, b: res1});
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
    ) internal pure returns (CommonLib.Fp2 memory) {
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
    ) internal pure returns (CommonLib.Fp2 memory) {
        return CommonLib.Fp2({a: self.a, b: self.b.neg()});
    }

    function frobenius_map(
        CommonLib.Fp2 memory self
    ) internal pure returns (CommonLib.Fp2 memory) {
        // (c0 + c1*u)^p = c0^p + (c1*u)^p
        // and c0^p=c0, c1^p=c1, and u^p = -u, so the result is:
        // c0 - c1
        return conjugate(self);
    }
}

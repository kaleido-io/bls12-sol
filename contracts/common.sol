//SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.28;

library CommonLib {
    // Fp is a field element with the high-order part stored in `a`.
    struct Fp {
        uint256 a;
        uint256 b;
    }
    // Fp2 is an extension field element with the coefficient of the
    // quadratic non-residue stored in `b`, i.e. p = a + i * b
    struct Fp2 {
        Fp a;
        Fp b;
    }

    struct Fp6 {
        Fp2 c0;
        Fp2 c1;
        Fp2 c2;
    }

    struct Fp12 {
        Fp6 c0;
        Fp6 c1;
    }

    struct G1Affine {
        Fp x;
        Fp y;
        bool is_point_at_infinity;
    }

    struct G2Affine {
        Fp2 x;
        Fp2 y;
        bool is_point_at_infinity;
    }

    struct G2Projective {
        Fp2 x;
        Fp2 y;
        Fp2 z;
    }
}

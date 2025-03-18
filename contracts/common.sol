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

// Provides an implementation of the BLS12-381 base field,
// where `p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab`
uint256 constant P_A = 0x1a0111ea397fe69a4b1ba7b6434bacd7;
uint256 constant P_B = 0x64774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab;

library CommonLib {
    // Fp is a field element with the high-order part stored in `a`.
    struct Fp {
        uint256 a; // higher order bits
        uint256 b; // lower order bits
    }
    // Fp2 is an extension field element with the coefficient of the
    // quadratic non-residue stored in `c1`, i.e. p = c0 + i * c1
    struct Fp2 {
        Fp c0;
        Fp c1;
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

    struct G1Projective {
        Fp x;
        Fp y;
        Fp z;
    }

    struct G2Projective {
        Fp2 x;
        Fp2 y;
        Fp2 z;
    }

    // switch between BigEndian and LittleEndian
    // https://ethereum.stackexchange.com/questions/83626/how-to-reverse-byte-order-in-uint256-or-bytes32
    function reverseBitOrder(uint256 input) internal pure returns (uint256 v) {
        v = input;

        // swap bytes
        v =
            ((v &
                0xFF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00) >>
                8) |
            ((v &
                0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF) <<
                8);

        // swap 2-byte long pairs
        v =
            ((v &
                0xFFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000) >>
                16) |
            ((v &
                0x0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF0000FFFF) <<
                16);

        // swap 4-byte long pairs
        v =
            ((v &
                0xFFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000) >>
                32) |
            ((v &
                0x00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF) <<
                32);

        // swap 8-byte long pairs
        v =
            ((v &
                0xFFFFFFFFFFFFFFFF0000000000000000FFFFFFFFFFFFFFFF0000000000000000) >>
                64) |
            ((v &
                0x0000000000000000FFFFFFFFFFFFFFFF0000000000000000FFFFFFFFFFFFFFFF) <<
                64);

        // swap 16-byte long pairs
        v = (v >> 128) | (v << 128);
    }
}

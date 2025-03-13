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
import {G1AffineLib} from "./g1.sol";
import {G2AffineLib} from "./g2.sol";

contract Verifier_G16 {
    using G1AffineLib for CommonLib.G1Affine;

    struct Proof {
        CommonLib.G1Affine pA;
        CommonLib.G2Affine pB;
        CommonLib.G1Affine pC;
    }

    CommonLib.G1Affine public alpha_g1 =
        CommonLib
            .G1Affine({
                x: CommonLib.Fp({
                    a: 0x18a070c1cb23135b1d48c0eca24c160a,
                    b: 0xfcf2e86320c4aa802e8a670a879f5565b3f63dfd35fe19107d094c2128a2abf3
                }),
                y: CommonLib.Fp({
                    a: 0x15fe0cfde2111ebd3602b700b80d0200,
                    b: 0x82b119b12480ff577f8638d5465b9b7e3928534717eb4e753fbf1194b30a763e
                }),
                is_point_at_infinity: false
            })
            .neg();
    CommonLib.G2Affine public beta_g2 =
        CommonLib.G2Affine({
            x: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x134d550833d3d435b84ee251a875e4de,
                    b: 0xca0e3e0de966e0bdd42cbe8da921030b986a729ca44739fe1d3d1d46302259bc
                }),
                c1: CommonLib.Fp({
                    a: 0x04ce63269723d3337aebb17ecde5fd74,
                    b: 0x069c770eccc988d35c30d014cb70c7a7ad9d86f8026e0169eb8f1c018ad9f568
                })
            }),
            y: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x126f7e121bbb8bb3952b6e0df27140ac,
                    b: 0xe9d65ab1145f47aa9ea1e60eb3511e5f79989b03fbdcf8afddf3673166a8c0cc
                }),
                c1: CommonLib.Fp({
                    a: 0x1124e3b24b4d010cd7281b00f8e63c33,
                    b: 0x111486b9ab4378deec96170f885147d9950ebec1c50ffb9165affa8ebe27f279
                })
            }),
            is_point_at_infinity: false
        });
    CommonLib.G2Affine public neg_gamma_g2 =
        CommonLib.G2Affine({
            x: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x084e449a11e6f46ad4d4b60ad9c88797,
                    b: 0xb34d9390ece00923409f7959181efb4f0703f03db6f06bb851712ed70682ed3d
                }),
                c1: CommonLib.Fp({
                    a: 0x0a4e2b41d4525c97dc6ef9c7268df41d,
                    b: 0xb686514275354e5caf774b4b1d0ac6bb91d13cedd6390980cbb9535d74ae6a85
                })
            }),
            y: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x11493e5c08b3bb8b6b2d870acd9487af,
                    b: 0xead776e47ddfba05e5673a63835b59914301270b0699d444b0f9996f9561163e
                }),
                c1: CommonLib.Fp({
                    a: 0x0e376fa21e87873ce4872a8c75753cea,
                    b: 0xa74a276098f9f99f1972354025cef93c699d75e08e7ca3e3dd9627c75cef6d75
                })
            }),
            is_point_at_infinity: false
        });
    CommonLib.G2Affine public neg_delta_g2 =
        CommonLib.G2Affine({
            x: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x0a83c4f5e4782fa29be90f88d6b7ec06,
                    b: 0xd755d2e7373613e01b0ef164702853da7dd58a7ef37b2ebfbf520583ddd24ecc
                }),
                c1: CommonLib.Fp({
                    a: 0x008606941551012270154f600af072d1,
                    b: 0xed3c032e0da28f2d8dcd3efaeacc47d1ba332741e698b6774a9087d313f785b6
                })
            }),
            y: CommonLib.Fp2({
                c0: CommonLib.Fp({
                    a: 0x13c12980849f42b5e0c0a5895bc404ac,
                    b: 0xa1e53471bdbcc455adec145706eebcdbfd1fcca063ad64a7d9be7a1a471054a9
                }),
                c1: CommonLib.Fp({
                    a: 0x028c29118a5a032c026adc957125811e,
                    b: 0x3a0bd4454a4b14efd302d248e7ec5ef5f1f6a1f6de81dab22abab8865af083f2
                })
            }),
            is_point_at_infinity: false
        });

    constructor() {}

    function verifyProof(
        Proof memory proof,
        uint256[] memory publicInputs
    ) public view returns (bool) {
        CommonLib.G1Affine memory acc = CommonLib.G1Affine({
            x: CommonLib.Fp({
                a: 0x04778c88e98aa676054401e08945a4e1,
                b: 0x5288a430a6e6a5380f838a4f01f62f6eee07373d2a04cd0d75cce25b2bc0c847
            }),
            y: CommonLib.Fp({
                a: 0x040f97f4f6b132a0930bea0d78b0c147,
                b: 0x573b52fad985013cef4973f51d69aa11653228eac30e02bf5339b7b5f1570013
            }),
            is_point_at_infinity: false
        });
        uint256[] memory arg = new uint256[]((4 + 8) * 4); // 4 pairs of (G1Affine: 4 words, , G2Affine: 8 words)
        bytes memory ret = new bytes(32); // return is a simple 0 or 1

        // first pair: (alpha_g1, beta_g2)
        arg[0] = alpha_g1.x.a;
        arg[1] = alpha_g1.x.b;
        arg[2] = alpha_g1.y.a;
        arg[3] = alpha_g1.y.b;
        arg[4] = beta_g2.x.c0.a;
        arg[5] = beta_g2.x.c0.b;
        arg[6] = beta_g2.x.c1.a;
        arg[7] = beta_g2.x.c1.b;
        arg[8] = beta_g2.y.c0.a;
        arg[9] = beta_g2.y.c0.b;
        arg[10] = beta_g2.y.c1.a;
        arg[11] = beta_g2.y.c1.b;
        // second pair: (proof.a, proof.b)
        arg[12] = proof.pA.x.a;
        arg[13] = proof.pA.x.b;
        arg[14] = proof.pA.y.a;
        arg[15] = proof.pA.y.b;
        arg[16] = proof.pB.x.c0.a;
        arg[17] = proof.pB.x.c0.b;
        arg[18] = proof.pB.x.c1.a;
        arg[19] = proof.pB.x.c1.b;
        arg[20] = proof.pB.y.c0.a;
        arg[21] = proof.pB.y.c0.b;
        arg[22] = proof.pB.y.c1.a;
        arg[23] = proof.pB.y.c1.b;
        // third pair: (acc, neg_gamma_g2)
        arg[24] = acc.x.a;
        arg[25] = acc.x.b;
        arg[26] = acc.y.a;
        arg[27] = acc.y.b;
        arg[28] = neg_gamma_g2.x.c0.a;
        arg[29] = neg_gamma_g2.x.c0.b;
        arg[30] = neg_gamma_g2.x.c1.a;
        arg[31] = neg_gamma_g2.x.c1.b;
        arg[32] = neg_gamma_g2.y.c0.a;
        arg[33] = neg_gamma_g2.y.c0.b;
        arg[34] = neg_gamma_g2.y.c1.a;
        arg[35] = neg_gamma_g2.y.c1.b;
        // fourth pair: (proof.c, neg_delta_g2)
        arg[36] = proof.pC.x.a;
        arg[37] = proof.pC.x.b;
        arg[38] = proof.pC.y.a;
        arg[39] = proof.pC.y.b;
        arg[40] = neg_delta_g2.x.c0.a;
        arg[41] = neg_delta_g2.x.c0.b;
        arg[42] = neg_delta_g2.x.c1.a;
        arg[43] = neg_delta_g2.x.c1.b;
        arg[44] = neg_delta_g2.y.c0.a;
        arg[45] = neg_delta_g2.y.c0.b;
        arg[46] = neg_delta_g2.y.c1.a;
        arg[47] = neg_delta_g2.y.c1.b;

        bool result;
        assembly {
            // call the precompiled contract BLS12_PAIRING_CHECK (0x0f)
            let success := staticcall(
                gas(),
                0x0f,
                add(arg, 0x20),
                mul(384, 4),
                add(ret, 0x20),
                0x40
            )
            switch success
            case 0 {
                revert(0x0, 0x0)
            }
            default {
                result := mload(add(0x20, ret))
            }
        }

        return result;
    }

    function testPrecompile() public view returns (bool) {
        CommonLib.G1Affine memory g1 = G1AffineLib.generator();
        CommonLib.G2Affine memory g2 = G2AffineLib.generator();
        CommonLib.G1Affine memory neg_g1 = g1.neg();

        uint256[] memory arg = new uint256[](12 * 2); // 12 words for each G1Affine and G2Affine pair
        bytes memory ret = new bytes(32); // return is a simple 0 or 1

        arg[0] = g1.x.a;
        arg[1] = g1.x.b;
        arg[2] = g1.y.a;
        arg[3] = g1.y.b;
        arg[4] = g2.x.c0.a;
        arg[5] = g2.x.c0.b;
        arg[6] = g2.x.c1.a;
        arg[7] = g2.x.c1.b;
        arg[8] = g2.y.c0.a;
        arg[9] = g2.y.c0.b;
        arg[10] = g2.y.c1.a;
        arg[11] = g2.y.c1.b;

        arg[12] = neg_g1.x.a;
        arg[13] = neg_g1.x.b;
        arg[14] = neg_g1.y.a;
        arg[15] = neg_g1.y.b;
        arg[16] = g2.x.c0.a;
        arg[17] = g2.x.c0.b;
        arg[18] = g2.x.c1.a;
        arg[19] = g2.x.c1.b;
        arg[20] = g2.y.c0.a;
        arg[21] = g2.y.c0.b;
        arg[22] = g2.y.c1.a;
        arg[23] = g2.y.c1.b;

        bool result;
        assembly {
            // call the precompiled contract BLS12_PAIRING_CHECK (0x0f)
            let success := staticcall(
                gas(),
                0x0f,
                add(arg, 0x20),
                mul(384, 2),
                add(ret, 0x20),
                0x40
            )
            switch success
            case 0 {
                revert(0x0, 0x0)
            }
            default {
                result := mload(add(0x20, ret))
            }
        }

        return result;
    }
}

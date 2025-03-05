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

import {console} from "hardhat/console.sol";
import {CommonLib} from "../common.sol";
import {FpLib} from "../fp.sol";
import {B12} from "../b12.sol";

contract TestVerifier {
    // Verification Key data
    CommonLib.G1Affine alpha_g1;
    CommonLib.G2Affine beta_g2;

    function init() public {
        CommonLib.Fp memory x = FpLib.parseFp(
            bytes(
                "0x18a070c1cb23135b1d48c0eca24c160afcf2e86320c4aa802e8a670a879f5565b3f63dfd35fe19107d094c2128a2abf3"
            )
        );
        CommonLib.Fp memory y = FpLib.parseFp(
            bytes(
                "0x15fe0cfde2111ebd3602b700b80d020082b119b12480ff577f8638d5465b9b7e3928534717eb4e753fbf1194b30a763e"
            )
        );
        alpha_g1 = CommonLib.G1Affine(x, y, false);

        CommonLib.Fp2 memory x1 = CommonLib.Fp2(
            FpLib.parseFp(
                bytes(
                    "0x134d550833d3d435b84ee251a875e4deca0e3e0de966e0bdd42cbe8da921030b986a729ca44739fe1d3d1d46302259bc"
                )
            ),
            FpLib.parseFp(
                bytes(
                    "0x04ce63269723d3337aebb17ecde5fd74069c770eccc988d35c30d014cb70c7a7ad9d86f8026e0169eb8f1c018ad9f568"
                )
            )
        );
        CommonLib.Fp2 memory y1 = CommonLib.Fp2(
            FpLib.parseFp(
                bytes(
                    "0x126f7e121bbb8bb3952b6e0df27140ace9d65ab1145f47aa9ea1e60eb3511e5f79989b03fbdcf8afddf3673166a8c0cc"
                )
            ),
            FpLib.parseFp(
                bytes(
                    "0x1124e3b24b4d010cd7281b00f8e63c33111486b9ab4378deec96170f885147d9950ebec1c50ffb9165affa8ebe27f279"
                )
            )
        );
        beta_g2 = CommonLib.G2Affine(x1, y1, false);
    }

    error Test1();
    function pairing() public view returns (CommonLib.Fp12 memory) {
        return B12.pairing(alpha_g1, beta_g2);
    }
}

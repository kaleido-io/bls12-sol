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

library G1AffineLib {
    function generator() public pure returns (CommonLib.G1Affine memory) {
        return
            CommonLib.G1Affine({
                x: CommonLib.Fp({
                    a: 0x17f1d3a73197d7942695638c4fa9ac0f,
                    b: 0xc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb
                }),
                y: CommonLib.Fp({
                    a: 0x08b3f481e3aaa0f1a09e30ed741d8ae4,
                    b: 0xfcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1
                }),
                is_point_at_infinity: false
            });
    }
    function negativeP1() internal pure returns (CommonLib.G1Affine memory) {
        return
            CommonLib.G1Affine({
                x: CommonLib.Fp({
                    a: 31827880280837800241567138048534752271,
                    b: 88385725958748408079899006800036250932223001591707578097800747617502997169851
                }),
                y: CommonLib.Fp({
                    a: 22997279242622214937712647648895181298,
                    b: 46816884707101390882112958134453447585552332943769894357249934112654335001290
                }),
                is_point_at_infinity: false
            });
    }
}

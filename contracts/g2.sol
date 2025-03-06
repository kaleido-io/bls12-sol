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
import {Fp2Lib} from "./fp2.sol";

library G2AffineLib {
    function generator() public pure returns (CommonLib.G2Affine memory) {
        return
            CommonLib.G2Affine({
                x: CommonLib.Fp2({
                    c0: CommonLib.Fp({
                        a: 0x024aa2b2f08f0a91260805272dc51051,
                        b: 0xc6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8
                    }),
                    c1: CommonLib.Fp({
                        a: 0x13e02b6052719f607dacd3a088274f65,
                        b: 0x596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e
                    })
                }),
                y: CommonLib.Fp2({
                    c0: CommonLib.Fp({
                        a: 0x0ce5d527727d6e118cc9cdc6da2e351a,
                        b: 0xadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801
                    }),
                    c1: CommonLib.Fp({
                        a: 0x0606c4a02ea734cc32acd2b02bc28b99,
                        b: 0xcb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be
                    })
                }),
                is_point_at_infinity: false
            });
    }
}

library G2ProjectiveLib {
    function fromAffine(
        CommonLib.G2Affine memory p
    ) internal pure returns (CommonLib.G2Projective memory) {
        return CommonLib.G2Projective({x: p.x, y: p.y, z: Fp2Lib.one()});
    }
}

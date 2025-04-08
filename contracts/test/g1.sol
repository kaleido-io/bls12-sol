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

import {CommonLib} from "../common.sol";
import {G1AffineLib, G1ProjectiveLib} from "../g1.sol";
import {console} from "hardhat/console.sol";

contract TestG1Lib {
    bool public lastSuccess = false;

    function fromAffine(
        CommonLib.G1Affine memory p
    ) public pure returns (CommonLib.G1Projective memory) {
        return G1ProjectiveLib.fromAffine(p);
    }

    function toAffine(
        CommonLib.G1Projective memory p
    ) public view returns (CommonLib.G1Affine memory) {
        return G1ProjectiveLib.toAffine(p);
    }

    function equal(
        CommonLib.G1Projective memory p,
        CommonLib.G1Projective memory q
    ) public view returns (bool) {
        return G1ProjectiveLib.equal(p, q);
    }

    function add(
        CommonLib.G1Projective memory p,
        CommonLib.G1Projective memory q
    ) public view returns (CommonLib.G1Projective memory) {
        return G1ProjectiveLib.add(p, q);
    }

    function mulByScalar(
        CommonLib.G1Projective memory p,
        uint256 scalar
    ) public view returns (CommonLib.G1Projective memory) {
        return G1ProjectiveLib.mulByScalar(p, scalar);
    }

    function mulByScalarTx(
        CommonLib.G1Projective memory p,
        uint256 scalar
    ) public returns (CommonLib.G1Projective memory result) {
        result = G1ProjectiveLib.mulByScalar(p, scalar);
        lastSuccess = true;
    }

    function g1ProjectiveDouble(
        CommonLib.G1Projective memory p
    ) public view returns (CommonLib.G1Projective memory) {
        return G1ProjectiveLib.double(p);
    }
}

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

import {TypedMemView} from "@summa-tx/memview.sol/contracts/TypedMemView.sol";
import {CommonLib} from "../common.sol";
import {FpLib} from "../fp.sol";

contract TestFpLib {
    using TypedMemView for bytes;
    using TypedMemView for bytes29;
    using FpLib for CommonLib.Fp;

    function zero() public pure returns (CommonLib.Fp memory) {
        return FpLib.zero();
    }
    function add(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) public view returns (CommonLib.Fp memory) {
        return FpLib.add(a, b).mod();
    }
    function add4(
        uint256 a,
        uint256 b,
        uint256 c,
        uint256 d
    ) public pure returns (CommonLib.Fp memory) {
        return FpLib.add4(a, b, c, d);
    }
    function sub(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) public pure returns (CommonLib.Fp memory) {
        return FpLib.sub(a, b);
    }

    function mul(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) public view returns (CommonLib.Fp memory) {
        return FpLib.mul(a, b);
    }

    function neg(
        CommonLib.Fp memory a
    ) public pure returns (CommonLib.Fp memory) {
        return FpLib.neg(a);
    }

    function invert(
        CommonLib.Fp memory a
    ) public view returns (CommonLib.Fp memory) {
        return FpLib.invert(a);
    }
    function parseFp(
        bytes memory input
    ) internal pure returns (CommonLib.Fp memory ret) {
        bytes29 ref = input.ref(0).postfix(input.length, 0);

        ret.a = ref.indexUint(0, 32);
        ret.b = ref.indexUint(32, 32);
    }

    function reverseBitOrder(uint256 input) public pure returns (uint256 v) {
        return CommonLib.reverseBitOrder(input);
    }
}

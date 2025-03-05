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
import {Fp2Lib} from "../fp2.sol";

contract TestFp2Lib {
    using FpLib for CommonLib.Fp;
    using Fp2Lib for CommonLib.Fp2;

    function zero() public pure returns (CommonLib.Fp2 memory) {
        return Fp2Lib.zero();
    }
    function add(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.add(a, b);
    }
    function sub(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.sub(a, b);
    }

    function mul(
        CommonLib.Fp2 memory a,
        CommonLib.Fp2 memory b
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.mul(a, b);
    }

    function square(
        CommonLib.Fp2 memory a
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.square(a);
    }

    function neg(
        CommonLib.Fp2 memory a
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.neg(a);
    }

    function invert(
        CommonLib.Fp2 memory a
    ) public view returns (CommonLib.Fp2 memory) {
        return Fp2Lib.invert(a);
    }
}

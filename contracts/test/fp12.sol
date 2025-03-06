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
import {Fp12Lib} from "../fp12.sol";

contract TestFp12Lib {
    using Fp12Lib for CommonLib.Fp12;

    function one() public pure returns (CommonLib.Fp12 memory) {
        return Fp12Lib.one();
    }

    function mul(
        CommonLib.Fp12 memory a,
        CommonLib.Fp12 memory b
    ) public view returns (CommonLib.Fp12 memory) {
        return Fp12Lib.mul(a, b);
    }

    function square(
        CommonLib.Fp12 memory a
    ) public view returns (CommonLib.Fp12 memory) {
        return Fp12Lib.square(a);
    }

    function invert(
        CommonLib.Fp12 memory a
    ) public view returns (CommonLib.Fp12 memory) {
        return Fp12Lib.invert(a);
    }

    function frobenius_map(
        CommonLib.Fp12 memory a
    ) public view returns (CommonLib.Fp12 memory) {
        return Fp12Lib.frobenius_map(a);
    }

    function mul_by_014(
        CommonLib.Fp12 memory self,
        CommonLib.Fp2 memory c0,
        CommonLib.Fp2 memory c1,
        CommonLib.Fp2 memory c4
    ) public view returns (CommonLib.Fp12 memory) {
        return Fp12Lib.mul_by_014(self, c0, c1, c4);
    }
}

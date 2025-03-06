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
import {Fp6Lib} from "../fp6.sol";

contract TestFp6Lib {
    using Fp6Lib for CommonLib.Fp6;

    function zero() public pure returns (CommonLib.Fp6 memory) {
        return Fp6Lib.zero();
    }
    function add(
        CommonLib.Fp6 memory a,
        CommonLib.Fp6 memory b
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.add(a, b);
    }
    function sub(
        CommonLib.Fp6 memory a,
        CommonLib.Fp6 memory b
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.sub(a, b);
    }

    function mul(
        CommonLib.Fp6 memory a,
        CommonLib.Fp6 memory b
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.mul(a, b);
    }

    function square(
        CommonLib.Fp6 memory a
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.square(a);
    }

    function neg(
        CommonLib.Fp6 memory a
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.neg(a);
    }

    function invert(
        CommonLib.Fp6 memory a
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.invert(a);
    }

    function frobenius_map(
        CommonLib.Fp6 memory a
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.frobenius_map(a);
    }

    function mul_by_01(
        CommonLib.Fp6 memory self,
        CommonLib.Fp2 memory c0,
        CommonLib.Fp2 memory c1
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.mul_by_01(self, c0, c1);
    }

    function mul_by_1(
        CommonLib.Fp6 memory self,
        CommonLib.Fp2 memory c1
    ) public view returns (CommonLib.Fp6 memory) {
        return Fp6Lib.mul_by_1(self, c1);
    }
}

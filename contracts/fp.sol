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
import {CommonLib, P_A, P_B} from "./common.sol";
import {console} from "hardhat/console.sol";

library FpLib {
    using TypedMemView for bytes;
    using TypedMemView for bytes29;
    using FpLib for CommonLib.Fp;

    function zero() internal pure returns (CommonLib.Fp memory) {
        return CommonLib.Fp(0, 0);
    }
    function one() internal pure returns (CommonLib.Fp memory) {
        return CommonLib.Fp(0, 1);
    }
    function two() internal pure returns (CommonLib.Fp memory) {
        return CommonLib.Fp(0, 2);
    }

    function mod(
        CommonLib.Fp memory self
    ) internal pure returns (CommonLib.Fp memory) {
        unchecked {
            if (self.a > P_A || (self.a == P_A && self.b > P_B)) {
                self.a -= P_A + (self.b > P_B ? 0 : 1);
                self.b -= P_B;
            }
            return self;
        }
    }

    function add(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) internal view returns (CommonLib.Fp memory r) {
        unchecked {
            uint256 bb = a.b + b.b;
            uint256 aa = a.a + b.a + (bb >= a.b && bb >= b.b ? 0 : 1);

            return CommonLib.Fp({a: aa, b: bb});
        }
    }
    function add2(
        uint256 a,
        uint256 b
    ) internal view returns (CommonLib.Fp memory) {
        return CommonLib.Fp(0, a).add(CommonLib.Fp(0, b));
    }

    function add3(
        uint256 a,
        uint256 b,
        uint256 c
    ) internal view returns (CommonLib.Fp memory) {
        return
            CommonLib.Fp(0, a).add(CommonLib.Fp(0, b)).add(CommonLib.Fp(0, c));
    }

    function add4(
        uint256 a,
        uint256 b,
        uint256 c,
        uint256 d
    ) internal view returns (CommonLib.Fp memory) {
        return
            CommonLib
                .Fp(0, a)
                .add(CommonLib.Fp(0, b))
                .add(CommonLib.Fp(0, c))
                .add(CommonLib.Fp(0, d));
    }

    function sub(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) internal view returns (CommonLib.Fp memory) {
        CommonLib.Fp memory p = CommonLib.Fp({a: P_A, b: P_B});
        unchecked {
            if (b.a > a.a || (b.a == a.a && b.b > a.b)) {
                a = a.add(p);
            }
            uint256 bb = a.b - b.b;
            uint256 aa = a.a - b.a - (bb <= a.b ? 0 : 1);
            return CommonLib.Fp({a: aa, b: bb});
        }
    }
    function neg(
        CommonLib.Fp memory self
    ) internal view returns (CommonLib.Fp memory) {
        return FpLib.zero().sub(self);
    }
    function mul(
        CommonLib.Fp memory a,
        CommonLib.Fp memory b
    ) internal view returns (CommonLib.Fp memory) {
        unchecked {
            uint256 a1 = uint128(a.b);
            uint256 a2 = uint128(a.b >> 128);
            uint256 a3 = uint128(a.a);
            uint256 a4 = uint128(a.a >> 128);
            uint256 b1 = uint128(b.b);
            uint256 b2 = uint128(b.b >> 128);
            uint256 b3 = uint128(b.a);
            uint256 b4 = uint128(b.a >> 128);
            CommonLib.Fp memory res = normal2(CommonLib.Fp(0, a1 * b1), 0);
            res = add(res, normal2(add2(a1 * b2, a2 * b1), 16));
            res = add(res, normal2(add3(a1 * b3, a2 * b2, a3 * b1), 32));
            res = add(
                res,
                normal2(add4(a1 * b4, a2 * b3, a3 * b2, a4 * b1), 48)
            );
            res = add(res, normal2(add3(a2 * b4, a3 * b3, a4 * b2), 64));
            res = add(res, normal2(add2(a3 * b4, a4 * b3), 96));
            res = add(res, normal2(CommonLib.Fp(0, a4 * b4), 128));
            return normal(res);
        }
    }
    function invert(
        CommonLib.Fp memory self
    ) internal view returns (CommonLib.Fp memory) {
        CommonLib.Fp memory p = CommonLib.Fp(P_A, P_B);
        CommonLib.Fp memory exponent = p.sub(two());
        return modExp(self, exponent, p);
    }
    function normal(
        CommonLib.Fp memory a
    ) internal view returns (CommonLib.Fp memory) {
        CommonLib.Fp memory p = CommonLib.Fp(P_A, P_B);
        CommonLib.Fp memory exponent = CommonLib.Fp(0, 1);
        return modExp(a, exponent, p);
    }
    function normal2(
        CommonLib.Fp memory a,
        uint idx
    ) internal view returns (CommonLib.Fp memory) {
        CommonLib.Fp memory p = CommonLib.Fp(P_A, P_B);
        return modExp2(a, idx, 1, p);
    }
    function modExp(
        CommonLib.Fp memory base,
        CommonLib.Fp memory exponent,
        CommonLib.Fp memory modulus
    ) internal view returns (CommonLib.Fp memory) {
        uint256 base1 = base.a;
        uint256 base2 = base.b;
        uint256 exponent1 = exponent.a;
        uint256 exponent2 = exponent.b;
        uint256 modulus1 = modulus.a;
        uint256 modulus2 = modulus.b;
        bytes memory arg = new bytes(3 * 32 + 32 + 64 + 64);
        bytes memory ret = new bytes(64);
        uint256 result1;
        uint256 result2;
        assembly {
            // length of base, exponent, modulus
            mstore(add(arg, 0x20), 0x40) // based is an Fp, so length is 0x40 (64 bytes)
            mstore(add(arg, 0x40), 0x40) // exponent is an Fp, so length is 0x40 (64 bytes)
            mstore(add(arg, 0x60), 0x40) // modulus is an Fp, so length is 0x40 (64 bytes)

            // assign base, exponent, modulus
            mstore(add(arg, 0x80), base1)
            mstore(add(arg, 0xa0), base2)
            mstore(add(arg, 0xc0), exponent1)
            mstore(add(arg, 0xe0), exponent2)
            mstore(add(arg, 0x100), modulus1)
            mstore(add(arg, 0x120), modulus2)

            // call the precompiled contract BigModExp (0x05)
            let success := staticcall(
                gas(),
                0x05,
                add(arg, 0x20),
                0x120,
                add(ret, 0x20),
                0x40
            )
            switch success
            case 0 {
                revert(0x0, 0x0)
            }
            default {
                result1 := mload(add(0x20, ret))
                result2 := mload(add(0x40, ret))
            }
        }
        return CommonLib.Fp(result1, result2);
    }
    function modExp2(
        CommonLib.Fp memory base,
        uint idx,
        uint exponent,
        CommonLib.Fp memory modulus
    ) internal view returns (CommonLib.Fp memory) {
        uint256 base1 = base.a;
        uint256 base2 = base.b;
        uint256 modulus1 = modulus.a;
        uint256 modulus2 = modulus.b;
        bytes memory arg = new bytes(3 * 32 + 62 + 64 + 32 + idx);
        bytes memory ret = new bytes(64);
        uint256 result1;
        uint256 result2;
        assembly {
            // length of base, exponent, modulus
            mstore(add(arg, 0x20), add(0x40, idx))
            mstore(add(arg, 0x40), 0x20)
            mstore(add(arg, 0x60), 0x40)

            // assign base, exponent, modulus
            mstore(add(arg, 0x80), base1)
            mstore(add(arg, 0xa0), base2)
            mstore(add(arg, add(idx, 0xc0)), exponent)
            mstore(add(arg, add(idx, 0xe0)), modulus1)
            mstore(add(arg, add(idx, 0x100)), modulus2)

            // call the precompiled contract BigModExp (0x05)
            let success := staticcall(
                gas(),
                0x05,
                add(arg, 0x20),
                add(idx, 0x100),
                add(ret, 0x20),
                0x40
            )
            switch success
            case 0 {
                revert(0x0, 0x0)
            }
            default {
                result1 := mload(add(0x20, ret))
                result2 := mload(add(0x40, ret))
            }
        }
        return CommonLib.Fp({a: result1, b: result2}).mod();
    }
    function parseFp(
        bytes memory input
    ) internal pure returns (CommonLib.Fp memory ret) {
        bytes29 ref = input.ref(0).postfix(input.length, 0);

        ret.a = ref.indexUint(0, 32);
        ret.b = ref.indexUint(32, 32);
    }
}

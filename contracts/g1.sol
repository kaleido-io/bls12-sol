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
import {FpLib} from "./fp.sol";
import {console} from "hardhat/console.sol";

library G1AffineLib {
    using FpLib for CommonLib.Fp;

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
    function neg(
        CommonLib.G1Affine memory self
    ) internal pure returns (CommonLib.G1Affine memory) {
        return
            CommonLib.G1Affine({
                x: self.x,
                y: self.y.neg(),
                is_point_at_infinity: self.is_point_at_infinity
            });
    }

    function mul(
        CommonLib.G1Affine memory self,
        uint256 scalar
    ) internal view returns (CommonLib.G1Affine memory result) {
        uint256[] memory arg = new uint256[](5); // 4 words for the point, 1 word for the scalar
        arg[0] = self.x.a;
        arg[1] = self.x.b;
        arg[2] = self.y.a;
        arg[3] = self.y.b;
        arg[4] = scalar;
        uint256 success;
        bytes memory ret = new bytes(128); // return is 128 bytes
        assembly {
            // call the precompiled contract BLS12_PAIRING_CHECK (0x0f)
            success := staticcall(
                gas(),
                0x0c,
                add(arg, 0x20),
                0xa0,
                add(ret, 0x20),
                0x80
            )
        }
        if (success == 0) {
            revert("G1Projective mul: scalar multiplication failed");
        }
        (result.x.a, result.x.b, result.y.a, result.y.b) = abi.decode(
            ret,
            (uint256, uint256, uint256, uint256)
        );
    }
}

library G1ProjectiveLib {
    using FpLib for CommonLib.Fp;

    function zero() internal pure returns (CommonLib.G1Projective memory) {
        return
            CommonLib.G1Projective({
                x: FpLib.zero(),
                y: FpLib.one(),
                z: FpLib.zero()
            });
    }

    function fromAffine(
        CommonLib.G1Affine memory p
    ) internal pure returns (CommonLib.G1Projective memory) {
        // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
        if (p.x.equal(FpLib.zero()) && p.y.equal(FpLib.zero())) {
            return zero();
        }
        return CommonLib.G1Projective({x: p.x, y: p.y, z: FpLib.one()});
    }

    function toAffine(
        CommonLib.G1Projective memory p
    ) internal view returns (CommonLib.G1Affine memory) {
        if (p.z.equal(FpLib.one())) {
            return
                CommonLib.G1Affine({
                    x: p.x,
                    y: p.y,
                    is_point_at_infinity: false
                });
        }
        CommonLib.Fp memory zInv;
        // If invZ was 0, we return zero point. However we still want to execute
        // all operations, so we replace invZ with a random number, 1.
        bool isZero = equal(p, zero());
        if (isZero) {
            zInv = FpLib.one();
        } else {
            zInv = p.z.invert();
        }
        CommonLib.Fp memory x = p.x.mul(zInv);
        CommonLib.Fp memory y = p.y.mul(zInv);
        CommonLib.Fp memory z = p.z.mul(zInv);
        if (isZero) {
            return
                CommonLib.G1Affine({
                    x: FpLib.zero(),
                    y: FpLib.zero(),
                    is_point_at_infinity: false
                });
        }
        if (!z.equal(FpLib.one())) {
            revert("G1Projective toAffine: z is not one");
        }
        return CommonLib.G1Affine({x: x, y: y, is_point_at_infinity: false});
    }

    function mul_by_3b(
        CommonLib.Fp memory a
    ) internal view returns (CommonLib.Fp memory) {
        CommonLib.Fp memory times2 = a.add(a).mod();
        CommonLib.Fp memory times4 = times2.add(times2).mod();
        CommonLib.Fp memory times12 = times4.add(times4).add(times4).mod();
        return times12;
    }

    function add(
        CommonLib.G1Projective memory self,
        CommonLib.G1Projective memory rhs
    ) internal view returns (CommonLib.G1Projective memory) {
        // Algorithm 7, https://eprint.iacr.org/2015/1060.pdf

        CommonLib.Fp memory t0 = self.x.mul(rhs.x);
        CommonLib.Fp memory t1 = self.y.mul(rhs.y);
        CommonLib.Fp memory t2 = self.z.mul(rhs.z);
        CommonLib.Fp memory t3 = self.x.add(self.y).mod();
        CommonLib.Fp memory t4 = rhs.x.add(rhs.y).mod();
        t3 = t3.mul(t4);
        t4 = t0.add(t1).mod();
        t3 = t3.sub(t4);
        t4 = self.y.add(self.z).mod();
        CommonLib.Fp memory x3 = rhs.y.add(rhs.z).mod();
        t4 = t4.mul(x3);
        x3 = t1.add(t2).mod();
        t4 = t4.sub(x3);
        x3 = self.x.add(self.z).mod();
        CommonLib.Fp memory y3 = rhs.x.add(rhs.z).mod();
        x3 = x3.mul(y3);
        y3 = t0.add(t2).mod();
        y3 = x3.sub(y3);
        x3 = t0.add(t0).mod();
        t0 = x3.add(t0).mod();
        t2 = mul_by_3b(t2);
        CommonLib.Fp memory z3 = t1.add(t2).mod();
        t1 = t1.sub(t2);
        y3 = mul_by_3b(y3);
        x3 = t4.mul(y3);
        t2 = t3.mul(t1);
        x3 = t2.sub(x3);
        y3 = y3.mul(t0);
        t1 = t1.mul(z3);
        y3 = t1.add(y3).mod();
        t0 = t0.mul(t3);
        z3 = z3.mul(t4);
        z3 = z3.add(t0).mod();

        return CommonLib.G1Projective({x: x3, y: y3, z: z3});
    }

    function double(
        CommonLib.G1Projective memory self
    ) internal view returns (CommonLib.G1Projective memory result) {
        // Algorithm 9, https://eprint.iacr.org/2015/1060.pdf

        if (self.z.equal(FpLib.zero())) {
            return zero();
        }
        CommonLib.Fp memory t0 = self.y.mul(self.y);
        CommonLib.Fp memory z3 = t0.add(t0).mod();
        z3 = z3.add(z3).mod();
        z3 = z3.add(z3).mod();
        CommonLib.Fp memory t1 = self.y.mul(self.z);
        CommonLib.Fp memory t2 = self.z.mul(self.z);
        t2 = mul_by_3b(t2);
        CommonLib.Fp memory x3 = t2.mul(z3);
        CommonLib.Fp memory y3 = t0.add(t2).mod();
        z3 = t1.mul(z3);
        t1 = t2.add(t2).mod();
        t2 = t1.add(t2).mod();
        t0 = t0.sub(t2);
        y3 = t0.mul(y3);
        y3 = x3.add(y3).mod();
        t1 = self.x.mul(self.y);
        x3 = t0.mul(t1);
        x3 = x3.add(x3).mod();

        return CommonLib.G1Projective({x: x3, y: y3, z: z3});
    }

    function mulByScalar(
        CommonLib.G1Projective memory self,
        uint256 scalar
    ) internal view returns (CommonLib.G1Projective memory) {
        CommonLib.G1Projective memory acc = zero();
        bytes32 scalarBytes = bytes32(scalar);
        bytes1 ONE = bytes1(uint8(1));
        bool first = true;
        for (uint256 i = 0; i < 32; i++) {
            for (int j = 7; j >= 0; j--) {
                if (first) {
                    first = false;
                    continue;
                }
                acc = double(acc);
                if ((scalarBytes[i] >> uint256(j)) & ONE == ONE) {
                    acc = add(acc, self);
                }
            }
        }
        return acc;
    }

    function equal(
        CommonLib.G1Projective memory self,
        CommonLib.G1Projective memory other
    ) internal view returns (bool) {
        CommonLib.Fp memory pXqZ = self.x.mul(other.z);
        CommonLib.Fp memory qXpZ = other.x.mul(self.z);
        CommonLib.Fp memory pYqZ = self.y.mul(other.z);
        CommonLib.Fp memory qYpZ = other.y.mul(self.z);
        return pXqZ.equal(qXpZ) && pYqZ.equal(qYpZ);
    }
}

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
import {Fp2Lib} from "./fp2.sol";
import {Fp6Lib} from "./fp6.sol";
import {Fp12Lib} from "./fp12.sol";
import {console} from "hardhat/console.sol";

library G1AffineLib {
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

library G1ProjectiveLib {
    function fromAffine(
        CommonLib.G2Affine memory p
    ) internal pure returns (CommonLib.G2Projective memory) {
        return
            CommonLib.G2Projective({
                x: p.x,
                y: p.y,
                z: CommonLib.Fp2({
                    a: CommonLib.Fp({a: 1, b: 0}),
                    b: CommonLib.Fp({a: 0, b: 0})
                })
            });
    }
}

library B12 {
    using FpLib for CommonLib.Fp;
    using Fp2Lib for CommonLib.Fp2;
    using Fp6Lib for CommonLib.Fp6;
    using Fp12Lib for CommonLib.Fp12;

    error Test1();

    function doubling_step(
        CommonLib.G2Projective memory r
    )
        internal
        view
        returns (
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.G2Projective memory
        )
    {
        CommonLib.Fp2 memory tmp0 = r.x.square();
        CommonLib.Fp2 memory tmp1 = r.y.square();
        CommonLib.Fp2 memory tmp2 = tmp1.square();
        CommonLib.Fp2 memory tmp3 = tmp1.add(r.x).square().sub(tmp0).sub(tmp2);
        tmp3 = tmp3.add(tmp3);
        CommonLib.Fp2 memory tmp4 = tmp0.add(tmp0).add(tmp0);
        CommonLib.Fp2 memory tmp6 = r.x.add(tmp4);
        CommonLib.Fp2 memory tmp5 = tmp4.square();
        CommonLib.Fp2 memory zsquared = r.z.square();
        CommonLib.Fp2 memory new_r_x = tmp5.sub(tmp3).sub(tmp3);
        CommonLib.Fp2 memory new_r_z = r.z.add(r.y).square().sub(tmp1).sub(
            zsquared
        );
        CommonLib.Fp2 memory new_r_y = tmp3.sub(new_r_x).mul(tmp4);
        tmp2 = tmp2.add(tmp2);
        tmp2 = tmp2.add(tmp2);
        tmp2 = tmp2.add(tmp2);
        new_r_y = new_r_y.sub(tmp2);
        tmp3 = tmp4.mul(zsquared);
        tmp3 = tmp3.add(tmp3);
        tmp3 = tmp3.neg();
        tmp6 = tmp6.square().sub(tmp0).sub(tmp5);
        tmp1 = tmp1.add(tmp1);
        tmp1 = tmp1.add(tmp1);
        tmp6 = tmp6.sub(tmp1);
        tmp0 = new_r_z.mul(zsquared);
        tmp0 = tmp0.add(tmp0);

        return (
            tmp0,
            tmp3,
            tmp6,
            CommonLib.G2Projective({x: new_r_x, y: new_r_y, z: new_r_z})
        );
    }
    function addition_step(
        CommonLib.G2Projective memory r,
        CommonLib.G2Affine memory q
    )
        internal
        view
        returns (
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.G2Projective memory
        )
    {
        CommonLib.Fp2 memory zsquared = r.z.square();
        CommonLib.Fp2 memory ysquared = q.y.square();
        CommonLib.Fp2 memory t0 = zsquared.mul(q.x);
        CommonLib.Fp2 memory t1 = q
            .y
            .add(r.z)
            .square()
            .sub(ysquared)
            .sub(zsquared)
            .mul(zsquared);
        CommonLib.Fp2 memory t2 = t0.sub(r.x);
        CommonLib.Fp2 memory t3 = t2.square();

        CommonLib.Fp2 memory t4 = t3.add(t3);
        t4 = t4.add(t4);
        CommonLib.Fp2 memory t5 = t4.mul(t2);
        CommonLib.Fp2 memory t6 = t1.sub(r.y).sub(r.y);
        CommonLib.Fp2 memory t9 = t6.mul(q.x);
        CommonLib.Fp2 memory t7 = t4.mul(r.x);

        CommonLib.Fp2 memory new_r_x = t6.square().sub(t5).sub(t7).sub(t7);

        CommonLib.Fp2 memory new_r_z = r.z.add(t2).square().sub(zsquared).sub(
            t3
        );

        CommonLib.Fp2 memory t10 = q.y.add(new_r_z);
        CommonLib.Fp2 memory t8 = t7.sub(new_r_x).mul(t6);
        t0 = r.y.mul(t5);
        t0 = t0.add(t0);
        CommonLib.Fp2 memory new_r_y = t8.sub(t0);

        t10 = t10.square().sub(ysquared);
        CommonLib.Fp2 memory ztsquared = new_r_z.square();
        t10 = t10.sub(ztsquared);
        t9 = t9.add(t9).sub(t10);

        CommonLib.Fp2 memory t10_double = new_r_z.add(new_r_z);
        CommonLib.Fp2 memory t6_neg = t6.neg();
        CommonLib.Fp2 memory t1_final = t6_neg.add(t6_neg);
        return (
            t10_double,
            t1_final,
            t9,
            CommonLib.G2Projective({x: new_r_x, y: new_r_y, z: new_r_z})
        );
    }
    function ell(
        CommonLib.Fp12 memory f,
        CommonLib.Fp2[3] memory coeffs,
        CommonLib.G1Affine memory p
    ) internal view returns (CommonLib.Fp12 memory) {
        console.log("ell - 1");
        CommonLib.Fp memory c0c0 = coeffs[0].a.mul(p.y);
        CommonLib.Fp memory c0c1 = coeffs[0].b.mul(p.y);
        console.log("ell - 2");
        CommonLib.Fp memory c1c0 = coeffs[1].a.mul(p.x);
        CommonLib.Fp memory c1c1 = coeffs[1].b.mul(p.x);
        console.log("ell - 3");
        return
            f.mul_by_014(
                coeffs[2],
                CommonLib.Fp2({a: c1c0, b: c1c1}),
                CommonLib.Fp2({a: c0c0, b: c0c1})
            );
    }

    function miller_loop(
        CommonLib.G1Affine memory p,
        CommonLib.G2Affine memory q
    ) public view returns (CommonLib.Fp12 memory) {
        bool[64] memory booleans = [
            false,
            true,
            true,
            false,
            true,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ];
        CommonLib.G2Projective memory adder_cur = G1ProjectiveLib.fromAffine(q);
        CommonLib.G2Affine memory adder_base = q;
        CommonLib.G1Affine memory adder_p = p;
        CommonLib.Fp12 memory f = Fp12Lib.one();
        bool foundOne = false;

        for (uint256 i = 0; i < 64; i++) {
            console.log("i: %d", i);
            if (!foundOne) {
                foundOne = booleans[i];
            } else {
                // Doubling step receives f. Does 2 things: doubling_step function & ell function
                console.log("Doubling step");
                (
                    CommonLib.Fp2 memory coeffs_c0,
                    CommonLib.Fp2 memory coeffs_c1,
                    CommonLib.Fp2 memory coeffs_c2,
                    CommonLib.G2Projective memory cur_updated
                ) = doubling_step(adder_cur);
                adder_cur = cur_updated;
                console.log("ell");
                f = ell(f, [coeffs_c0, coeffs_c1, coeffs_c2], adder_p);
                if (booleans[i]) {
                    console.log("Addition step");
                    (
                        coeffs_c0,
                        coeffs_c1,
                        coeffs_c2,
                        cur_updated
                    ) = addition_step(adder_cur, adder_base);
                    console.log("ell");
                    f = ell(f, [coeffs_c0, coeffs_c1, coeffs_c2], adder_p);
                }
                console.log("f.square()");
                f = f.square();
            }
        }

        // Doubling step receives f. Does 2 things: doubling_step function & ell function
        (
            CommonLib.Fp2 memory coeffs_c0,
            CommonLib.Fp2 memory coeffs_c1,
            CommonLib.Fp2 memory coeffs_c2,
            CommonLib.G2Projective memory cur_updated
        ) = doubling_step(adder_cur);
        adder_cur = cur_updated;
        // ell updates f
        f = ell(f, [coeffs_c0, coeffs_c1, coeffs_c2], adder_p);

        f = f.conjugate();
        return f;
    }

    function pairing(
        CommonLib.G1Affine memory p,
        CommonLib.G2Affine memory q
    ) public view returns (CommonLib.Fp12 memory) {
        CommonLib.Fp12 memory tmp = miller_loop(p, q);
        return tmp.final_exponentiation();
    }
}

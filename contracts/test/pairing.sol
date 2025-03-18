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
import {FpLib} from "../fp.sol";
import {G1AffineLib} from "../g1.sol";
import {G2AffineLib} from "../g2.sol";
import {PairingLib} from "../pairing.sol";

contract TestPairingLib {
    function doubling_step(
        CommonLib.G2Projective memory r
    )
        public
        view
        returns (
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.Fp2 memory,
            CommonLib.G2Projective memory
        )
    {
        return PairingLib.doubling_step(r);
    }

    function ell(
        CommonLib.Fp12 memory f,
        CommonLib.Fp2[3] memory coeffs,
        CommonLib.G1Affine memory p
    ) public view returns (CommonLib.Fp12 memory) {
        return PairingLib.ell(f, coeffs, p);
    }

    function pairing(
        CommonLib.G1Affine memory p,
        CommonLib.G2Affine memory q
    ) public view returns (CommonLib.Fp12 memory) {
        return PairingLib.pairing(p, q);
    }

    function cyclotomic_square(
        CommonLib.Fp12 memory f
    ) public view returns (CommonLib.Fp12 memory) {
        return PairingLib.cyclotomic_square(f);
    }

    function cyclotomic_exp(
        CommonLib.Fp12 memory f
    ) public view returns (CommonLib.Fp12 memory) {
        return PairingLib.cycolotomic_exp(f);
    }
}

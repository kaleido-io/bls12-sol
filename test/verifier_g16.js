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
const { assert } = require('chai');
const { parseFp } = require('./utils');

describe('Verifier_G16', function () {
  let verifier;
  this.timeout(600000);

  before(async () => {
    const Verifier = await hre.ethers.getContractFactory('Verifier_G16', {
      libraries: {
        // PairingLib: deployment.target,
      },
    });
    verifier = await Verifier.deploy();
    console.log('Verifier_G16 deployed to:', verifier.target);
  });

  it('verify_proof()', async () => {
    const pA_x = parseFp('0x07aea1603b8532fab2fb25d45a0de382b9ef7f4d79f41e088ad7b015cf7e0edb1108e69aa423026f677a3a2ffc35b7a6');
    const pA_y = parseFp('0x1525a5d39659e73b7ff2beeb84613ab2aecf8f2b5549c9f1f16e44fd905390998c026affb41dbd586ef66b1c936f2d43');
    const pA = { x: pA_x, y: pA_y, is_point_at_infinity: false };

    const pB_x_c0 = parseFp('0x11d7a63a311c11991a08ee22391b0f6ca279eb9b14a9c591c89daebb9a2493acea89ac992208dc975459b7239185c755');
    const pB_x_c1 = parseFp('0x09eb750c1e6c096e84b5d332ddda4760417e214891e318e1ff2ae1b80a3bd61b7527475bcfd6597d8f36b0a19fe79bde');
    const pB_y_c0 = parseFp('0x014c1990a6d9b78539fb1e0b85633aa85cddaf7024a5e05d9c0ac9c26505e75a1923b3a50c6a95b6d89036e0d25699ae');
    const pB_y_c1 = parseFp('0x10caf671d25ed6953ff93068cbd1fbb613cec26d3fb846455016680204c23eab428a265a1ad6b8b119c2cf0a676190f8');
    const pB = { x: { c0: pB_x_c0, c1: pB_x_c1 }, y: { c0: pB_y_c0, c1: pB_y_c1 }, is_point_at_infinity: false };

    const pC_x = parseFp('0x07c362b9096e3c34ba5ce8e55c6d7b820df0abbe416aaa031e886747ea4ebd6967f9ac4ba4921cf0d08f485b6b3a56c1');
    const pC_y = parseFp('0x0556f04dd6709c49029e138adaecf07ace14d9d220e028f1445fca4b5c8c7550c2fdfac84cfe4774fe0c5ae7ba78bd05');
    const pC = { x: pC_x, y: pC_y, is_point_at_infinity: false };

    const proof = { pA, pB, pC };
    const publicInputs = [];

    const result = await verifier.verifyProof(proof, publicInputs);

    console.log('result', result);
  });
});

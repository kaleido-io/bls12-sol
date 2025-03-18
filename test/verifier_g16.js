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
    // const G1AffineLib = await hre.ethers.deployContract('G1AffineLib');
    // const G1AffineDeployment = await G1AffineLib.waitForDeployment();
    // console.log('G1AffineLib deployed to:', G1AffineDeployment.target);

    // const G2AffineLib = await hre.ethers.deployContract('G2AffineLib');
    // const G2AffineDeployment = await G2AffineLib.waitForDeployment();
    // console.log('G2AffineLib deployed to:', G2AffineDeployment.target);

    const Verifier = await hre.ethers.getContractFactory('Verifier_G16', {
      libraries: {
        // G1AffineLib: G1AffineDeployment.target,
        // G2AffineLib: G2AffineDeployment.target,
      },
    });
    verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    // verifier = Verifier.attach('0xDE6C4E6F68Aebb695e787470f8FBd0085d2b01c1');
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
    const publicInputs = ['0x10'];

    const result = await verifier.verifyProof(proof, publicInputs);

    assert.isTrue(result, 'Invalid proof');
  });

  it('testPairing()', async () => {
    const p1x = parseFp('0x832deafd0280610786cff96128e3ca6d18aee9c210434330df5e99a3dbe5a5bb452f541bbb5a61233b0f30ba12ebba9');
    const p1y = parseFp('0x18c7d15f9600316d017fa325445adff204dc1b72b0f5ae026a09572d65571c8ecc5f6c02c25cbe15b901ce2068602ed7');
    const p1 = { x: p1x, y: p1y, is_point_at_infinity: false };
    const q1xc0 = parseFp('0x1638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a053');
    const q1xc1 = parseFp('0xa4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c33577');
    const q1yc0 = parseFp('0x468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899');
    const q1yc1 = parseFp('0xf6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf3');
    const q1x = { c0: q1xc0, c1: q1xc1 };
    const q1y = { c0: q1yc0, c1: q1yc1 };
    const q1 = { x: q1x, y: q1y, is_point_at_infinity: false };
    const p2x = parseFp('0x14dccb9f8090b44efc9dd52de1e2b295b299f0294f32ab2a6b9442ac141f557052c90d0588edeebb2bc62263624f6baf');
    const p2y = parseFp('0x29544d9ae3cda872d15f53b4587d0cdc9c2cb5955d5b80e6f7a7f6dd96fe55980e0804d2441f0594bf9ad48204eee60');
    const p2 = { x: p2x, y: p2y, is_point_at_infinity: false };
    const q2xc0 = parseFp('0x24aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8');
    const q2xc1 = parseFp('0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e');
    const q2yc0 = parseFp('0xce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801');
    const q2yc1 = parseFp('0x606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be');
    const q2x = { c0: q2xc0, c1: q2xc1 };
    const q2y = { c0: q2yc0, c1: q2yc1 };
    const q2 = { x: q2x, y: q2y, is_point_at_infinity: false };
    const result = await verifier.testPairing([p1, p2], [q1, q2], { gasLimit: 10000000 });
    assert.isTrue(result[0], 'Invalid precompile - unsuccessful');
    assert.equal(result[1], 1, 'Invalid precompile - returned 0');
  });
});

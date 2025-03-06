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

function split(n) {
  let str = n.toString(16).padStart(128, '0');
  return ['0x' + str.substr(-128, 64), '0x' + str.substr(-64)];
}

function split2(n) {
  let str = n.toString(16).padStart(96, '0');
  console.log(`B12.Fp(0x${str.substr(0, 32)}, 0x${str.substr(32, 64)})`);
}

function combine(a, b) {
  let aa = a.toString(16).padStart(64, '0');
  let bb = b.toString(16).padStart(64, '0');
  return BigInt('0x' + aa + bb);
}

describe('BLS12-381', function () {
  let pairing;
  this.timeout(60000);

  before(async () => {
    const PairingLib = await hre.ethers.deployContract('PairingLib');
    const deployment = await PairingLib.waitForDeployment();
    console.log('PairingLib deployed to:', JSON.stringify(deployment.target, null, 2));

    const G1AffineLib = await hre.ethers.deployContract('G1AffineLib');
    const G1AffineDeployment = await G1AffineLib.waitForDeployment();
    console.log('G1AffineLib deployed to:', JSON.stringify(G1AffineDeployment.target, null, 2));

    const G2AffineLib = await hre.ethers.deployContract('G2AffineLib');
    const G2AffineDeployment = await G2AffineLib.waitForDeployment();
    console.log('G2AffineLib deployed to:', JSON.stringify(G2AffineDeployment.target, null, 2));

    const TestPairing = await hre.ethers.getContractFactory('TestPairingLib', {
      libraries: {
        PairingLib: deployment.target,
        G1AffineLib: G1AffineDeployment.target,
        G2AffineLib: G2AffineDeployment.target,
      },
    });
    pairing = await TestPairing.deploy();
    console.log('TestPairingLib deployed to:', pairing.target);
  });

  it('pairingGenerators()', async () => {
    console.log('calling pairingGenerators()');
    const result = await pairing.pairingGenerators.call();
    console.log(result);
  });
});

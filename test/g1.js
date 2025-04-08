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

describe('G1ProjectiveLib and G1AffineLib', function () {
  let testG1Lib;
  this.timeout(600000);

  before(async () => {
    const TestG1Lib = await hre.ethers.getContractFactory('TestG1Lib');
    testG1Lib = await TestG1Lib.deploy();
    await testG1Lib.waitForDeployment();
    // testG1Lib = TestG1Lib.attach('0xDE6C4E6F68Aebb695e787470f8FBd0085d2b01c1');
    console.log('TestG1Lib deployed to:', testG1Lib.target);
  });

  it('fromAffine()', async () => {
    const p_x = parseFp('0x088d0478fb1e742414cf11f33ddfea44f97ddd4d16ef45c483914a6034bea4ba43358281a92cb1fcb4b9761c744871bb');
    const p_y = parseFp('0x057ea09786f332eb8ac5d6bbd8303213206c3cd2aeb71fef7667c26912309e47bb16f299232ad377307cea0ee556d8b7');
    const p = { x: p_x, y: p_y, is_point_at_infinity: false };

    const result = await testG1Lib.fromAffine(p);
    const expected_x = parseFp('0x088d0478fb1e742414cf11f33ddfea44f97ddd4d16ef45c483914a6034bea4ba43358281a92cb1fcb4b9761c744871bb');
    const expected_y = parseFp('0x057ea09786f332eb8ac5d6bbd8303213206c3cd2aeb71fef7667c26912309e47bb16f299232ad377307cea0ee556d8b7');
    const expected_z = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('toAffine()', async () => {
    const gx = parseFp('0x13ba2d3af7bb572e5fbd18231a1f912de3b42a6c1690e2d7750543aed24b35c9692d35ef8b106cf1619d0e3eddefde4');
    const gy = parseFp('0x10ca451002604fedeafbfdf34114efb5f296ca70b4a6df6b1ff4ba13e45c05e84db7cdaf7079c435b05ee78be9ee05d0');
    const gz = parseFp('0xa4969dba71262353c271f27c6aeb4c0929807ba68021c211ea36b53ebb773b3441159e6cfb469dd90231ac3eb040ebc');
    const g = { x: gx, y: gy, z: gz };

    const result = await testG1Lib.toAffine(g);
    const expected_x = parseFp('0x184bb665c37ff561a89ec2122dd343f20e0f4cbcaec84e3c3052ea81d1834e192c426074b02ed3dca4e7676ce4ce48ba');
    const expected_y = parseFp('0x4407b8d35af4dacc809927071fc0405218f1401a6d15af775810e4e460064bcc9468beeba82fdc751be70476c888bf3');
    verifyG1Affine(result, { x: expected_x, y: expected_y });
  });

  it('G1Projective add() - test 1', async () => {
    const gx = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const gy = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const gz = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const g = { x: gx, y: gy, z: gz };

    const rhs_x = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const rhs_y = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const rhs_z = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const rhs = { x: rhs_x, y: rhs_y, z: rhs_z };

    const result = await testG1Lib.add(g, rhs);
    const expected_x = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const expected_y = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const expected_z = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('G1Projective add() - test 2', async () => {
    const gx = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const gy = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const gz = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const g = { x: gx, y: gy, z: gz };

    const rhs_x = parseFp('0x0a0a80794d85214d38d464ba7c1171836cae7f169c3088eeea74a25af8f496d160f71584426f9e77d0de760b9e3e9eac');
    const rhs_y = parseFp('0x055dd7c08f4fc4a706f9d4f777af34c8fce3fcd442dd46c717a2db4c9d5162c5ae9d746af5d1d5ae03014edd1b8eaffe');
    const rhs_z = parseFp('0x0719ed2d3f59c903d00180853a54ca52f536e48a548eaa9ff02a64643a66be9a1476725ac1fa89831072ba6cedbe2101');
    const rhs = { x: rhs_x, y: rhs_y, z: rhs_z };

    const result = await testG1Lib.add(g, rhs);
    const expected_x = parseFp('0x04cf4f74c7e6b3dfd6db2575fd5d090adb4d41a74a786fa61a91814bd6a161578100cda934f00fee7298ea60909098cb');
    const expected_y = parseFp('0x1197939cb9bc060ca157d2cfe5f482d0f74d0502bfe2461c3be1992a3e6533bfc7672760e8f4a007e77b20aee30bdfbf');
    const expected_z = parseFp('0x048358f8ee5b946c44ec6ea839cef0a39437f2b9e40d22a6c40da29b7c41b8565e63235de92d1f0ae812fd0829a9e77c');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('G1Projective add() - test 3', async () => {
    const gx = parseFp('0x0a0a80794d85214d38d464ba7c1171836cae7f169c3088eeea74a25af8f496d160f71584426f9e77d0de760b9e3e9eac');
    const gy = parseFp('0x055dd7c08f4fc4a706f9d4f777af34c8fce3fcd442dd46c717a2db4c9d5162c5ae9d746af5d1d5ae03014edd1b8eaffe');
    const gz = parseFp('0x0719ed2d3f59c903d00180853a54ca52f536e48a548eaa9ff02a64643a66be9a1476725ac1fa89831072ba6cedbe2101');
    const g = { x: gx, y: gy, z: gz };

    const rhs_x = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const rhs_y = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const rhs_z = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    const rhs = { x: rhs_x, y: rhs_y, z: rhs_z };

    const result = await testG1Lib.add(g, rhs);
    const expected_x = parseFp('0x04cf4f74c7e6b3dfd6db2575fd5d090adb4d41a74a786fa61a91814bd6a161578100cda934f00fee7298ea60909098cb');
    const expected_y = parseFp('0x1197939cb9bc060ca157d2cfe5f482d0f74d0502bfe2461c3be1992a3e6533bfc7672760e8f4a007e77b20aee30bdfbf');
    const expected_z = parseFp('0x048358f8ee5b946c44ec6ea839cef0a39437f2b9e40d22a6c40da29b7c41b8565e63235de92d1f0ae812fd0829a9e77c');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('G1Projective add() - test 4', async () => {
    const gx = parseFp('0x191b633a5aaef4b0de0c66c95e9f5a7218bf0dde55cf16e4c600f5d7308e1c7d974471889fad50f2f244e8edfb988ba4');
    const gy = parseFp('0x057810823f03699b4e1497b3691fa7b1c2deb8cd5ba748927e921b3a2d19f2c4eae75664cc7c5f76f65b24b470dbdc51');
    const gz = parseFp('0x0d397f2ba295771076a85b84bafd4a721237631be7721cd89727e128d5b6705cac7db029cb9604ff6884c19b42bb871a');
    const g = { x: gx, y: gy, z: gz };

    const rhs_x = parseFp('0x05dff4ac6726c6cb9b6d4dac3f33e92c062e48a6104cc52f6e7f23d4350c60bd7803e16723f9f1478a13c2b29f4325ad');
    const rhs_y = parseFp('0x14e4b429606d02bc3c604c0410e5fc01d6093a00bb3e2bc9395952af0b6a0dbd599a8782a1bea48a2aa4d8e1b1df7ca5');
    const rhs_z = parseFp('0x0430df56ea4aba6928180e61b1f2cb8f962f5650798fdf279a55bee62edcdb27c04c720ae01952ac770553ef06aadf22');
    const rhs = { x: rhs_x, y: rhs_y, z: rhs_z };

    const result = await testG1Lib.add(g, rhs);
    const expected_x = parseFp('0x11fe1d770cdf4bd88a845b2688c95b2e47bc9a78518165f044d6eb1faa217b67daee27d5e26fc4bb21423d0b80bde83f');
    const expected_y = parseFp('0x181e9afd2aa89c9f99f1ca7dba34645eb3996ea770650feb7796748c99e28a4a99550a809fed9fe800dbb32cce6f98e3');
    const expected_z = parseFp('0x077c8a7ac3188fa2ab3558545d0753c78bfc7491d5d16b7c979edf8e30f6ffe361ec68a7d0861165b1cf3cac19261931');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('G1Projective add() - test 5', async () => {
    const gx = parseFp('0x191b633a5aaef4b0de0c66c95e9f5a7218bf0dde55cf16e4c600f5d7308e1c7d974471889fad50f2f244e8edfb988ba4');
    const gy = parseFp('0x057810823f03699b4e1497b3691fa7b1c2deb8cd5ba748927e921b3a2d19f2c4eae75664cc7c5f76f65b24b470dbdc51');
    const gz = parseFp('0x0d397f2ba295771076a85b84bafd4a721237631be7721cd89727e128d5b6705cac7db029cb9604ff6884c19b42bb871a');
    const g = { x: gx, y: gy, z: gz };

    const rhs_x = parseFp('0x13274e191e6172e271b09edd2be78c6d9fe4b6a0530ed2d7c0b0f3b8cec9830c206949aa6ef4aca211e8667e2843688b');
    const rhs_y = parseFp('0x14890167fa7c7cfefd071002da2c0525a19892b797ddca2ce89eb766c997035f33c4a999e4d7a088c3a3db4b8f23ce5a');
    const rhs_z = parseFp('0x0d397f2ba295771076a85b84bafd4a721237631be7721cd89727e128d5b6705cac7db029cb9604ff6884c19b42bb871a');
    const rhs = { x: rhs_x, y: rhs_y, z: rhs_z };

    const result = await testG1Lib.add(g, rhs);
    const expected_x = parseFp('0x020891d0fb6a4de9897a1ce314841ee866b9af7c2e6678033dcc4bf3dfd17e922903a77af1fb5e0a4a3b7dcaf75f965a');
    const expected_y = parseFp('0x07edc0455a5339aa6472165b8980dbf8efb0adfbd289cd544fb5e86d074a78a67bea90c6938f56971a3e3b9deee63f44');
    const expected_z = parseFp('0x150a95155b988b401417d57f35af738850c9e2f51e4752f81cb46c2948b9e2440a3ec2194ac56932aebab3f65107e635');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  // these test parameters were taken from github.com/mikelodder7/bls12_381_plus
  it.only('G1Projective mulByScalar() - test 1', async () => {
    const gx = parseFp('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb');
    const gy = parseFp('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1');
    const gz = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const g = { x: gx, y: gy, z: gz };

    const result = await testG1Lib.mulByScalar(g, '0x07f36e2ec2ee30f4220a63ea1f6b871ad6f5c58f2497908d782d09160b51f945');
    const expected_x = parseFp('0x16054cada0b496555486e6aab2677f919355894db0259a388dca7d46d333ced5f0c5ff078960796a0670da6623413e82');
    const expected_y = parseFp('0x0f0bd0c99c842c8dcf066044dfb2b294e9931ae2032f4b13eb78bc1e18b586fa4cddb624605ac584bf3f986bab6a785b');
    const expected_z = parseFp('0x0e7cf6086557d04d5ca35f5f0cbdfb0c6dcf50b30928046f10276ad47577f3857271986940cc52a2410d286dc992b9b1');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it.only('G1Projective mulByScalarTx() - test 1', async () => {
    const gx = parseFp('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb');
    const gy = parseFp('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1');
    const gz = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const g = { x: gx, y: gy, z: gz };

    const result = await testG1Lib.mulByScalarTx(g, '0x07f36e2ec2ee30f4220a63ea1f6b871ad6f5c58f2497908d782d09160b51f945');
    const receipt = await result.wait();
    console.log('mulByScalar gas cost:', receipt.gasUsed);
  });

  // these test parameters were taken from github.com/zkcrypto/bellman (groth16/src/verifier.rs)
  it('G1Projective mulByScalar() - test 2', async () => {
    const gx = parseFp('0x090edb0fd93944fcc2cf58ba1ad427b7ed4994f01cd442eae2c8dd8c3a1408a50e49bad34d46dea6f15c3fdc2f53b161');
    const gy = parseFp('0x06ef234024d61addd57a6e13c4848eb33165c4c2d7be71d523010577abc5482c6c0c71b6c3862c4266e26cad5bf0eb96');
    const gz = parseFp('0x186a01917dfd7c6ea85882291f2f13e05dc2723876f724fbe669107255f0f5139fc5efe55459fabca0a0e495044b6997');
    const g = { x: gx, y: gy, z: gz };

    const result = await testG1Lib.mulByScalar(g, '0x10f2fe4417917f59b606b0c857f3d11da2bfbeacc1af05b1acfe0ce509c5282d');
    const expected_x = parseFp('0x0d9c5bbda5acb831dca12338b422e28e5373f1825e07ecb662087cbf612be6101002ce81396414464c2465fee33af34b');
    const expected_y = parseFp('0x040a42ce5d3c2dd175a123d91717bf1e4060d3de5a2c86c92956335c899adf349c4467e7cf5b076c5381edf8c3057f9f');
    const expected_z = parseFp('0x0f77ea1fe646f8b691d75cf6fa0c46d67fb7e8d347c8d88bda84d7bf6e4f201771dd914e2c0b99945429993d931f228a');
    verifyG1Projective(result, { x: expected_x, y: expected_y, z: expected_z });
  });

  it('g1ProjectiveDouble()', async () => {
    const p_x = parseFp('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb');
    const p_y = parseFp('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1');
    const p_z = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001');
    const p = { x: p_x, y: p_y, z: p_z };
    const result = await testG1Lib.g1ProjectiveDouble(p);
    const expected_x = parseFp('0x05dff4ac6726c6cb9b6d4dac3f33e92c062e48a6104cc52f6e7f23d4350c60bd7803e16723f9f1478a13c2b29f4325ad');
    const expected_y = parseFp('0x14e4b429606d02bc3c604c0410e5fc01d6093a00bb3e2bc9395952af0b6a0dbd599a8782a1bea48a2aa4d8e1b1df7ca5');
    const expected_z = parseFp('0x0430df56ea4aba6928180e61b1f2cb8f962f5650798fdf279a55bee62edcdb27c04c720ae01952ac770553ef06aadf22');
    const expected = { x: expected_x, y: expected_y, z: expected_z };
    verifyG1Projective(result, expected);
    const result2 = await testG1Lib.g1ProjectiveDouble(expected);
    const expected2_x = parseFp('0x191b633a5aaef4b0de0c66c95e9f5a7218bf0dde55cf16e4c600f5d7308e1c7d974471889fad50f2f244e8edfb988ba4');
    const expected2_y = parseFp('0x057810823f03699b4e1497b3691fa7b1c2deb8cd5ba748927e921b3a2d19f2c4eae75664cc7c5f76f65b24b470dbdc51');
    const expected2_z = parseFp('0x0d397f2ba295771076a85b84bafd4a721237631be7721cd89727e128d5b6705cac7db029cb9604ff6884c19b42bb871a');
    const expected2 = { x: expected2_x, y: expected2_y, z: expected2_z };
    verifyG1Projective(result2, expected2);
  });
});

function verifyG1Projective(result, expected) {
  assert.equal('0x' + result.x.a.toString(16).padStart(64, '0'), expected.x.a);
  assert.equal('0x' + result.x.b.toString(16).padStart(64, '0'), expected.x.b);
  assert.equal('0x' + result.y.a.toString(16).padStart(64, '0'), expected.y.a);
  assert.equal('0x' + result.y.b.toString(16).padStart(64, '0'), expected.y.b);
  assert.equal('0x' + result.z.a.toString(16).padStart(64, '0'), expected.z.a);
  assert.equal('0x' + result.z.b.toString(16).padStart(64, '0'), expected.z.b);
}

function verifyG1Affine(result, expected) {
  assert.equal('0x' + result.x.a.toString(16).padStart(64, '0'), expected.x.a);
  assert.equal('0x' + result.x.b.toString(16).padStart(64, '0'), expected.x.b);
  assert.equal('0x' + result.y.a.toString(16).padStart(64, '0'), expected.y.a);
  assert.equal('0x' + result.y.b.toString(16).padStart(64, '0'), expected.y.b);
}

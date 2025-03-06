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

describe('Fp6 lib', function () {
  let fp6lib;
  let fp1_c0_c0, fp1_c0_c1, fp1_c1_c0, fp1_c1_c1, fp1_c2_c0, fp1_c2_c1;
  let fp2_c0_c0, fp2_c0_c1, fp2_c1_c0, fp2_c1_c1, fp2_c2_c0, fp2_c2_c1;
  let fp1, fp2;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('TestFp6Lib');
    fp6lib = await b12.waitForDeployment();
    console.log('FpLib deployed to:', JSON.stringify(fp6lib.target, null, 2));

    fp1_c0_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed57c');
    fp1_c0_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed563');
    fp1_c1_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed562');
    fp1_c1_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed561');
    fp1_c2_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed560');
    fp1_c2_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed567');
    fp1 = { c0: { c0: fp1_c0_c0, c1: fp1_c0_c1 }, c1: { c0: fp1_c1_c0, c1: fp1_c1_c1 }, c2: { c0: fp1_c2_c0, c1: fp1_c2_c1 } };

    fp2_c0_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed566');
    fp2_c0_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed565');
    fp2_c1_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed564');
    fp2_c1_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed56b');
    fp2_c2_c0 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed56a');
    fp2_c2_c1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed569');
    fp2 = { c0: { c0: fp2_c0_c0, c1: fp2_c0_c1 }, c1: { c0: fp2_c1_c0, c1: fp2_c1_c1 }, c2: { c0: fp2_c2_c0, c1: fp2_c2_c1 } };
  });

  it('zero()', async () => {
    const result = await fp6lib.zero();
    assert.equal(result.c0.c0.a, 0n);
    assert.equal(result.c0.c0.b, 0n);
    assert.equal(result.c0.c1.a, 0n);
    assert.equal(result.c0.c1.b, 0n);
    assert.equal(result.c1.c0.a, 0n);
    assert.equal(result.c1.c0.b, 0n);
    assert.equal(result.c1.c1.a, 0n);
    assert.equal(result.c1.c1.b, 0n);
    assert.equal(result.c2.c0.a, 0n);
    assert.equal(result.c2.c0.b, 0n);
    assert.equal(result.c2.c1.a, 0n);
    assert.equal(result.c2.c1.b, 0n);
  });

  it('add()', async () => {
    const result = await fp6lib.add(fp1, fp2);
    const expected_c0_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daae2');
    const expected_c0_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daac8');
    const expected_c1_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daac6');
    const expected_c1_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daacc');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daaca');
    const expected_c2_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daad0');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('sub()', async () => {
    const result = await fp6lib.sub(fp1, fp2);
    const expected_c0_a = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016');
    const expected_c0_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    const expected_c1_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa1');
    const expected_c2_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa1');
    const expected_c2_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('mul()', async () => {
    const result = await fp6lib.mul(fp1, fp2);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153fffe877e16fb74df198a');
    const expected_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d96ae5f0654');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffff20be8b7f5e9be1fc');
    const expected_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d99f6b80757');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000007a8cfac17');
    const expected_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9d3f11079e');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('mul() another test', async () => {
    const fp1_c0_c0_c0 = parseFp('0x15f30bb146420a3596196bc00af6c7091b1a912d3fe7024390015b157ce58b8cd3b853fc617f50270c4dafd0b8364404');
    const fp1_c0_c0_c1 = parseFp('0x154e7e0da1249a829901d1abbda7c91f95378f62afdff255ada13ece005b9f200223cf7241ef7224541007e5e06f8f56');
    const fp1_c0_c1_c0 = parseFp('0x1554a7b734fd6a38a44245f5a4802051ce3cd4e43ef0d2245c67706ce8bcadce52b7f555b942eda2c5f0ec0e52955a3f');
    const fp1_c0_c1_c1 = parseFp('0x129a9681d8972bf82d2d412892e1965d884373226ac49a18b0e0429a6724493bbb7cb552488b0916b200d2cb39ed87b3');
    const fp1_c0_c2_c0 = parseFp('0x00329b0efda5da0fe6f68ae49534a765298d16166d1d4a2a6431d5152ea73c01f4099634fc82edc01744cb997f49fa44');
    const fp1_c0_c2_c1 = parseFp('0x06549512e88b6a95eb31e043e5edba7e9e64a488b140186ca782becc4cc4c16cf3190036543bb8a8403bbdfe4b0f6f5c');
    const fp1_c0 = { c0: { c0: fp1_c0_c0_c0, c1: fp1_c0_c0_c1 }, c1: { c0: fp1_c0_c1_c0, c1: fp1_c0_c1_c1 }, c2: { c0: fp1_c0_c2_c0, c1: fp1_c0_c2_c1 } };

    const fp2_c0_c0_c0 = parseFp('0x08eb56c0a9dc196203f6493a107198ad1ea4b6559c1c760d4a31a6d0cafb0a31534c9aa6df8994e07f4877b4cc90fcf6');
    const fp2_c0_c0_c1 = parseFp('0x03a4235753d501c0a8a80c20ef7d6742f8945f128f7682a66dc146e7a3452e057a2268566c4015f00cd841cd916aebad');
    const fp2_c0_c1_c0 = parseFp('0x1536e376b042ac9c91c708ce541ec0febfc442931ea206ea47be83f27dcca7c6aa944b7e7391e3d509c3442686bd7f82');
    const fp2_c0_c1_c1 = parseFp('0x149bb326456b03e2739079be25d52a021b25710fd1df6357c3e82b7545fbe220a26dc2d30c8a03af75a874158c7a358d');
    const fp2_c0_c2_c0 = parseFp('0x14f3fdf39f3aab18d657d23acfa6ea19b8f25a0d932bdfd037f18c3263ece00934630916f93c7c220ce5489d32992449');
    const fp2_c0_c2_c1 = parseFp('0x0ab75a4fb139b593d0f95d1141b8f91ee1da9c02de1ecb866b3f2e0c6fe2dad46648c117c7a071ab58b1680002f4181b');
    const fp2_c0 = { c0: { c0: fp2_c0_c0_c0, c1: fp2_c0_c0_c1 }, c1: { c0: fp2_c0_c1_c0, c1: fp2_c0_c1_c1 }, c2: { c0: fp2_c0_c2_c0, c1: fp2_c0_c2_c1 } };

    const result = await fp6lib.mul(fp1_c0, fp2_c0);
    const expected_c0_a = parseFp('0x0ecf650c1b9774e5af915b191e2ee77b9da40d985840ea290713b496a5da0b395b07e1f86bb5e2d2abd98b4d299d0bdd');
    const expected_c0_b = parseFp('0x0cc8b6ba8a65d956397d2dd1de3142fe26bd61dd8e6c2dc6508412dd601bc383ba743a0fcbc5ee137db17548a23f4d09');
    const expected_c1_a = parseFp('0x02ff2f74a9e61dd3d16f24d284dd20dc1764a8f68ce9b4a3f4274cebe460362b8a6d5e8baa0c580ce62e9f02429185d3');
    const expected_c1_b = parseFp('0x0d64139a089cdbc58c66010dacb89fcdbbaf602a74178b97108b619f5ac81f2e5495b06fa329807585d3ce0db94ae696');
    const expected_c2_a = parseFp('0x0e717bdbf0d65782939c0fa53a008889d9ee04794f1c3232c1f387f2e5dd642274b85c5c1f2e53ece3a72a03d67d4e59');
    const expected_c2_b = parseFp('0x11531d70cb199bb3020105230680edd5837684ab1eb9bf10ea96bf72a97758d1c4c1092c34a7836ee54dfa27842b31c3');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('square()', async () => {
    const result = await fp6lib.square(fp1);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153fffe877e1715b7a71e48');
    const expected_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d947e23b0f6');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffff20be8b9310b1e3e4');
    const expected_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9366060593');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000014ca33ac19');
    const expected_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9b0ed5b24c');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('neg()', async () => {
    const result = await fp6lib.neg(fp1);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d52f');
    const expected_c0_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d548');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d549');
    const expected_c1_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d54a');
    const expected_c2_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d54b');
    const expected_c2_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d544');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('invert()', async () => {
    const result = await fp6lib.invert(fp1);
    const expected_c0_a = parseFp('0x0f5d3888ce8fb7e81051c8ab459ec57c5cac1cc5bad8d497f5d941f454303adb51e1f13856f01eb3b6e96a349bfd506c');
    const expected_c0_b = parseFp('0x00b5066943316367b6f802b3e2feb164112cf652c56a8fe4395f22843335c3f6db7d125937cfa97b25f59ab0a0ccae5d');
    const expected_c1_a = parseFp('0x1308087806edee690d656f71d22ae367dfc4963d04e46a2853d2e3d80c1b7494544e1cba6032f0db129086d6da4a1d61');
    const expected_c1_b = parseFp('0x18b68ea30cef69b18b39c24d25fff7c55b0ac9f2255e96f66d8aac1249925ad6c5f810e86dacdf69633e1b646ce82c64');
    const expected_c2_a = parseFp('0x07b1fa73b4b5c51f32ea6b76a0fa01e75c758e06983c5f6813890ef66fa9285f69c75be4c28fb6fb742f8f4cb2e91545');
    const expected_c2_b = parseFp('0x10fc74a9af1ceb669cf38cd6277e1cd4f7f4c10b46219aed14de3948b4b64a318f174c3b5e403449dcbc2aab5f712c57');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('frobenius_map()', async () => {
    const result = await fp6lib.frobenius_map(fp1);
    const expected_c0_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed57c');
    const expected_c0_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d548');
    const expected_c1_a = parseFp('0x1a0111ea05787f844ccd8850c33375b0de36d509e4cbd7eae6b847d6884edc05b62e2b87084092c8a13d8c0f616f800c');
    const expected_c1_b = parseFp('0x1a0111ea05787f83edb42120e3bca75f23cd0f027abc600009049e9aa156457cd8165373a63692c6733b8c0f6170800d');
    const expected_c2_a = parseFp('0x1a0111ea05787f84abe6ef80a2aa440298a09b114edb4fd5c46bf1126f47728e9446039a6a4a92cacf3f8c0fed7d556b');
    const expected_c2_b = parseFp('0x000000003407671838e68a84bce10d10e4bb1aa78b160a55b2ae8231d835a1539d0ce4ebf54f6d442ccd73f0127b5532');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('mul_by_01()', async () => {
    const fp6_c0_c0 = parseFp('0x0d0c5082a91ffea30eaaa4986ae8dc5038f273e62ab74c6ab83f682dcc95dd3bcbea6decd804302ccab2c7de1e44bca0');
    const fp6_c0_c1 = parseFp('0x0e9be29bebce548b0f87ce1998d37914d3d1b46553294924af46449e6c7657968e4bf1faaa62d958ea29e7fe0575a3a8');
    const fp6_c1_c0 = parseFp('0x0069c41e59c95f4d93a121ee45ae1681b6f95b3e54db08dbbad807097725b0da0ab111653edb261eaccd57aead9a9813');
    const fp6_c1_c1 = parseFp('0x18113584870f343c1af6901a4e81e608c2090f550ec0db483649a3cf9c506927c89ce8571afa777459349bef791bee10');
    const fp6_c2_c0 = parseFp('0x0edf8767556d8df5bbb8710dc4d7f9adcb03cca8755265357466e06ca7f79da52d3e81f2db07f1f811596320f8bbcc3e');
    const fp6_c2_c1 = parseFp('0x179fe906af8a66d21ee2b591e6d91404aff4b4e46eddb9a746fdf1507ceb31e700b70a13fd4e228211df9892be25673c');
    const fp6 = { c0: { c0: fp6_c0_c0, c1: fp6_c0_c1 }, c1: { c0: fp6_c1_c0, c1: fp6_c1_c1 }, c2: { c0: fp6_c2_c0, c1: fp6_c2_c1 } };

    const fp2_0_c0 = parseFp('0x0f9b2a1815635f5aa3d84e81484de9dafd5d161aa71ba012f05bb38a889642d228f0c476e9f3a8514687bcf809fd44fe');
    const fp2_0_c1 = parseFp('0x0508a280ced85bf7b913641df63e31428a931f63527d5411a0e6f0fe1ab4d9ce9b9b3301ec00984f91e6d9107a2b7504');
    const fp2_0 = { c0: fp2_0_c0, c1: fp2_0_c1 };

    const fp2_1_c0 = parseFp('0x0a5320003d16e0f9b9158049cc8d02c5622b4f22b95f1b250247b61fc2c7f223460ed570652814cffaf29ef25d9dd3f4');
    const fp2_1_c1 = parseFp('0x19d4b381ac23ec791fff298ad1025347cff3f2511604fa3a858f773d84fa6c3eaa2aa0c723081f00eb4c26cf3767ed91');
    const fp2_1 = { c0: fp2_1_c0, c1: fp2_1_c1 };

    const result = await fp6lib.mul_by_01(fp6, fp2_0, fp2_1);
    const expected_c0_a = parseFp('0x16e805bb23bdd484a090cb40cfc23b8f50070ff4facd53adebcf3f7e9fe5d5e6bdb29060badf61b00594954bb829f742');
    const expected_c0_b = parseFp('0x197fc451e27619a89270f63fbb5b107329504a4ced1d16fff934a921251cb3d91e0c73e868940b80be20d33a9144f01c');
    const expected_c1_a = parseFp('0x03605e60dfdfed6a3e5b86a7847f893424c1b21076794e1679cdd0d27609d2e5879436bf7cf5149c0003b478777e1b44');
    const expected_c1_b = parseFp('0x0835370583df29c7e32d10c9f39469a61cc2c15a2907feeded0e0d36a51880326142d5c92446d5206984878340b90981');
    const expected_c2_a = parseFp('0x10a4f3c2c7be606d77c381d2e1dfd1c973dd48ea72cec7cbeaa27b39a0d876d3ca157e64a6b1335a699aaed0e25b3c6e');
    const expected_c2_b = parseFp('0x0ba4f55a86def0347520626d675cde40bae1a8448b125aeeb096199af6b6f41b64578dd1f37d7cec6e7ef6210665a8d3');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });

  it('mul_by_1()', async () => {
    const fp6_c0_c0 = parseFp('0x0854493bd53e39ad204b20a1e75f1ec7ca37651d16b7ca3837b7ec6d53295d2439fb505b8872808e5561124c0195e448');
    const fp6_c0_c1 = parseFp('0x0fcd503427367d78f7fa26e6fb0cb8ab19e77dec81716171251fb9eb271de037a2271fe69113cea4b76e2ebce86e0687');
    const fp6_c1_c0 = parseFp('0x14d0531b70b2edccb6ab4c0a131d2d8a4b2153a5bdaff62b5bb082ddeb16619884d60ca80b2bc7c9f79270c15ae7d119');
    const fp6_c1_c1 = parseFp('0x1137104359711ec731f3864721846d9f42ffe3d91b0c3ed529d07a243922ead0d20815d872e071d5f563717cd89fe674');
    const fp6_c2_c0 = parseFp('0x02aca6f6b10e861e343698e7dfb2982954c9be9cca55a3939d6a113a9d706a9b1e46d0acd6a478cf2c241762eee46537');
    const fp6_c2_c1 = parseFp('0x01d2cf3b6ff696a3425ebf5e64885f1c4849eb4108b824223916766413fae5d7752b7cec138e1ac8c13709f6172802a7');
    const fp6 = { c0: { c0: fp6_c0_c0, c1: fp6_c0_c1 }, c1: { c0: fp6_c1_c0, c1: fp6_c1_c1 }, c2: { c0: fp6_c2_c0, c1: fp6_c2_c1 } };

    const fp2_1_c0 = parseFp('0x15126ddbe8aa5149572d50c1a928703c7d70213e5917d7926e8831946b0eb376ba7d4b6eacaa686334978c22cd205f0e');
    const fp2_1_c1 = parseFp('0x1341a2c853d1f148a9472fd3b229d671585ab9f4e76b90951c18001a8e30a6578c03581d92d5d599b43f33bbdc421ec3');
    const fp2_1 = { c0: fp2_1_c0, c1: fp2_1_c1 };

    const result = await fp6lib.mul_by_1(fp6, fp2_1);
    const expected_c0_a = parseFp('0x12c33fa0891eb897625c7847bf39e6193f48926fd4fdb849656d918fc366f7658e71a862d038487b8da4a29bf02f19d1');
    const expected_c0_b = parseFp('0x08dce830277b4848502cb14d2109af44b085dd1992c0d92c338493130634a1db6009ada7a7de2778f62a933a5b285abd');
    const expected_c1_a = parseFp('0x13f88f1567dd0d0283907ec1b382b27f123b7aec289936c167784afbee4bd23b059e3a54d418c13619ff634dbbd9a4bc');
    const expected_c1_b = parseFp('0x10ddb70793563aa46e6874f62bfd21aa21e92d8e2c656eaf1a299e2aad4ae2854c9b7eb595b7419450f78c8570b712a2');
    const expected_c2_a = parseFp('0x08ec92a029d5fe1a152ba1efefba48bd961facac02c9e3894ac9b04282366147522a7755d83efc1b20be321ab0f19cbf');
    const expected_c2_b = parseFp('0x0a038d3b9f70e5e68d52eda964a114cd455387b09e40f669e82d565ac88c0fb55d073ee3815094af96aa47e64702d0b3');
    verify(result, { c0: { c0: expected_c0_a, c1: expected_c0_b }, c1: { c0: expected_c1_a, c1: expected_c1_b }, c2: { c0: expected_c2_a, c1: expected_c2_b } });
  });
});

function verify(result, expected) {
  assert.equal('0x' + result.c0.c0.a.toString(16).padStart(64, '0'), expected.c0.c0.a);
  assert.equal('0x' + result.c0.c0.b.toString(16).padStart(64, '0'), expected.c0.c0.b);
  assert.equal('0x' + result.c0.c1.a.toString(16).padStart(64, '0'), expected.c0.c1.a);
  assert.equal('0x' + result.c0.c1.b.toString(16).padStart(64, '0'), expected.c0.c1.b);
  assert.equal('0x' + result.c1.c0.a.toString(16).padStart(64, '0'), expected.c1.c0.a);
  assert.equal('0x' + result.c1.c0.b.toString(16).padStart(64, '0'), expected.c1.c0.b);
  assert.equal('0x' + result.c1.c1.a.toString(16).padStart(64, '0'), expected.c1.c1.a);
  assert.equal('0x' + result.c1.c1.b.toString(16).padStart(64, '0'), expected.c1.c1.b);
  assert.equal('0x' + result.c2.c0.a.toString(16).padStart(64, '0'), expected.c2.c0.a);
  assert.equal('0x' + result.c2.c0.b.toString(16).padStart(64, '0'), expected.c2.c0.b);
  assert.equal('0x' + result.c2.c1.a.toString(16).padStart(64, '0'), expected.c2.c1.a);
  assert.equal('0x' + result.c2.c1.b.toString(16).padStart(64, '0'), expected.c2.c1.b);
}

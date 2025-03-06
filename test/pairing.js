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
const { verify } = require('./fp12');

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

  it('doubling_step()', async () => {
    const x_c0 = parseFp('0x098974011291ffadd4014bf59679803f7badc4704dacdacc3ea240383d49f2ace917a7119e93edef7ee61b95df1644eb');
    const x_c1 = parseFp('0x0371b9836eb9e3ffaec304e4a542fd2f6b490d272aecf475fb5c4f7baf079f159add41e0156493d5e9c4bbdb85cf968e');
    const x = { c0: x_c0, c1: x_c1 };

    const y_c0 = parseFp('0x037e8f96a3d7c033a334ac6b79646aed4815a6a84edc7fb6d22fda184a245db63a1924cbb752f7cce5d4e796af138ec1');
    const y_c1 = parseFp('0x062865e5f4a1a7cee0741289ea219f648dc516994536ecb77778a3165758472c5dfd94648e3f8da09bc02dfc5be05789');
    const y = { c0: y_c0, c1: y_c1 };

    const z_c0 = parseFp('0x0dba751e468c57fcac2c9539778813d3b10b010287d88bdd3a421642164ccf32acdb62ca9afb577164f252d704f6fab3');
    const z_c1 = parseFp('0x03751c7251f288b9d76f5567a9e72d0e93db7aecadbde7ec1d2068b7f2ab7e311be9be0c76b46e4bdaad0421c11d63a4');
    const z = { c0: z_c0, c1: z_c1 };

    const result = await pairing.doubling_step({ x, y, z });

    const expected_0_c0 = parseFp('0x16252b8dd268d802427658fa71e963b0a9eb3c943719265de7cfa0cbe8ffa56506552038f3a1934e464973e0fe1fc35c');
    const expected_0_c1 = parseFp('0x07160af82df76585315b6a86ed15707cca52a67be7bec61d27bf3c64c059e6e3953e9d2cb65c09b4e5eb8b6127139ce4');
    const expected_1_c0 = parseFp('0x02e41c97d90be113245263ae54eabf5c11a6db229e4f046662303606a04034fb8ca50bfac28074e21bb385547ad39217');
    const expected_1_c1 = parseFp('0x18b792dcb6dfcebe6f813d3ef78e3c61e21fab60f92eb2c263c37a4b9fcc0fbb1750632eb165531cd4eb1c3511a4220e');
    const expected_2_c0 = parseFp('0x14d5d6f5ec60da40b4d62f99e85cdcde38d7286d4ed3672bd3db21897257f34c8d92b634fa07305b64121868a14e9077');
    const expected_2_c1 = parseFp('0x0e5c3a5d5b3da77ba29b8e6d9cb2e116cd9182a141eaf807f495d0658c435fac2aedfa74c33fc640d2aa7eadab79eb30');
    assert.equal('0x' + result[0].c0.a.toString(16).padStart(64, '0'), expected_0_c0.a);
    assert.equal('0x' + result[0].c0.b.toString(16).padStart(64, '0'), expected_0_c0.b);
    assert.equal('0x' + result[0].c1.a.toString(16).padStart(64, '0'), expected_0_c1.a);
    assert.equal('0x' + result[0].c1.b.toString(16).padStart(64, '0'), expected_0_c1.b);
    assert.equal('0x' + result[1].c0.a.toString(16).padStart(64, '0'), expected_1_c0.a);
    assert.equal('0x' + result[1].c0.b.toString(16).padStart(64, '0'), expected_1_c0.b);
    assert.equal('0x' + result[1].c1.a.toString(16).padStart(64, '0'), expected_1_c1.a);
    assert.equal('0x' + result[1].c1.b.toString(16).padStart(64, '0'), expected_1_c1.b);
    assert.equal('0x' + result[2].c0.a.toString(16).padStart(64, '0'), expected_2_c0.a);
    assert.equal('0x' + result[2].c0.b.toString(16).padStart(64, '0'), expected_2_c0.b);
    assert.equal('0x' + result[2].c1.a.toString(16).padStart(64, '0'), expected_2_c1.a);
    assert.equal('0x' + result[2].c1.b.toString(16).padStart(64, '0'), expected_2_c1.b);
  });

  it('ell()', async () => {
    const self_c0_c0_c0 = parseFp('0x09f6b38f39c0ceec16d46a11dc3b2d10cb5546ee84b96f5f6c3387757d2cd2ca0ad49de5493794c468f9de93a1b8b925');
    const self_c0_c0_c1 = parseFp('0x17f3382cbd6929c94f0b3e120c925d99c47dfff42b04e2ce94327fdc831af0a14aa4efdcada5ffccd2b90c6c2d391966');
    const self_c0_c1_c0 = parseFp('0x06168d4e7d109c5748e7cab86a9f8b08e0caac21f9e21442280d1b43c66eda3d3d06d88f772fc9e45284550fd8b3fcd5');
    const self_c0_c1_c1 = parseFp('0x0d8f2f523bd5791f0396e10acd27b5e815e7b600bd5052ec12dc55400c0afb7a7aa56bbcfaa2d0cdec465b415955d05e');
    const self_c0_c2_c0 = parseFp('0x19a6e663a3b8b8af4ae21036d4f1798bbae58b1d1e9f909340555adddef1cdec47bb56282365a1c4471e83b4d3fa7171');
    const self_c0_c2_c1 = parseFp('0x0de4fac25803a7bae28f38eb012302e042f09cdf682cdac6c2cb642c980cd6461f30bd7bd3078bace0cdb85fd3c56af8');
    const self_c1_c0_c0 = parseFp('0x0854493bd53e39ad204b20a1e75f1ec7ca37651d16b7ca3837b7ec6d53295d2439fb505b8872808e5561124c0195e448');
    const self_c1_c0_c1 = parseFp('0x0fcd503427367d78f7fa26e6fb0cb8ab19e77dec81716171251fb9eb271de037a2271fe69113cea4b76e2ebce86e0687');
    const self_c1_c1_c0 = parseFp('0x14d0531b70b2edccb6ab4c0a131d2d8a4b2153a5bdaff62b5bb082ddeb16619884d60ca80b2bc7c9f79270c15ae7d119');
    const self_c1_c1_c1 = parseFp('0x1137104359711ec731f3864721846d9f42ffe3d91b0c3ed529d07a243922ead0d20815d872e071d5f563717cd89fe674');
    const self_c1_c2_c0 = parseFp('0x02aca6f6b10e861e343698e7dfb2982954c9be9cca55a3939d6a113a9d706a9b1e46d0acd6a478cf2c241762eee46537');
    const self_c1_c2_c1 = parseFp('0x01d2cf3b6ff696a3425ebf5e64885f1c4849eb4108b824223916766413fae5d7752b7cec138e1ac8c13709f6172802a7');
    const self = {
      c0: {
        c0: { c0: self_c0_c0_c0, c1: self_c0_c0_c1 },
        c1: { c0: self_c0_c1_c0, c1: self_c0_c1_c1 },
        c2: { c0: self_c0_c2_c0, c1: self_c0_c2_c1 },
      },
      c1: {
        c0: { c0: self_c1_c0_c0, c1: self_c1_c0_c1 },
        c1: { c0: self_c1_c1_c0, c1: self_c1_c1_c1 },
        c2: { c0: self_c1_c2_c0, c1: self_c1_c2_c1 },
      },
    };

    const coeffs_0_c0 = parseFp('0x04447570720213b52f6584549920b79949aeb85d3066ce1ad518e535ba74c81a5dc6ea8ec76f7455d0ca97c5eff0a781');
    const coeffs_0_c1 = parseFp('0x093667f9cc8076fa4dbb708096f71e4e85a2db546987cb942a47ad0d35ca18b77a2e9bc00b74ea31012d0c099aa6fd5f');
    const coeffs_1_c0 = parseFp('0x11dc9c0356ea1228229054c728f503c4373e47617b7e8be0246cd052786a1bb6e201ea0b5f4da4767bf93061739c06a1');
    const coeffs_1_c1 = parseFp('0x0546e49be73d736f7d43c215ab9647e96491e0ad4bb6fa4b026b7433a3c66ebe157d33cd8454b0e58c15166e4235d2b4');
    const coeffs_2_c0 = parseFp('0x05107e5274ea0496ebfda722b7fd264cbb78be7e9b14596c5e8440ed302dcd51ab895778736638d5bd29c037fe889159');
    const coeffs_2_c1 = parseFp('0x157ab5f9c8765b265d80b06d5f7084512e310c1d1975ebc7f3409634f99c84a7eef8ad7e850681065e1c30fbd8aa58d7');
    const coeffs = [
      { c0: coeffs_0_c0, c1: coeffs_0_c1 },
      { c0: coeffs_1_c0, c1: coeffs_1_c1 },
      { c0: coeffs_2_c0, c1: coeffs_2_c1 },
    ];

    const g1Affine_x = parseFp('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb');
    const g1Affine_y = parseFp('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1');
    const g1Affine_p = { x: g1Affine_x, y: g1Affine_y, is_point_at_infinity: false };

    const result = await pairing.ell(self, coeffs, g1Affine_p);

    const expected_c0_c0_c0 = parseFp('0x10426de23b060317b5f5e6093864833bfe12c9619d3b63ce6750e817b0fd9af00101798a2410427bf10499ef1b435f0e');
    const expected_c0_c0_c1 = parseFp('0x036b1c8e650587303df5a5bf0ce4db8bc300c73c0a9eed2a8e1026e2e8618e7f3fcdb37837f557da474aee99292e2298');
    const expected_c0_c1_c0 = parseFp('0x1725d8d776b0bdb5413d00e7bbd64d4e3adf1337a0aa80fb196794b154347d159914a9727e6a5404cf69235e9334e654');
    const expected_c0_c1_c1 = parseFp('0x066bf3a0b796eeed20a1855ce075611e3280473528965be10b8c8aec9822da0dbe12645e1e2295343ec66ce912de3984');
    const expected_c0_c2_c0 = parseFp('0x10b2ee8971a009d722d1ebd855042cc09193d9112f124cea43977718c6be2e0cc5feadc99030fb192029dced30435992');
    const expected_c0_c2_c1 = parseFp('0x024af609c7b585d36b4c65770db4a199ba0d12eb53db2d72c058045ed3dc6acf854d76086ca5b8bf005188943ff14bcc');
    const expected_c1_c0_c0 = parseFp('0x0328e424c757fe20dcc2a990f02305e7e2db46738ec7b28e5c9c1e6122ae221e33c1689629f0de15c3dfb7d56b292e42');
    const expected_c1_c0_c1 = parseFp('0x17c814efa4959f66a86d4749f924dba616148880694fc5924bc25c663e51590130ddd829d649412bc707583da491bd98');
    const expected_c1_c1_c0 = parseFp('0x19f1d4980c6431f55bb9408c86813d6ff1fb4c93037a764727693fb4eef00981a44c8fe2ccbfed442353442aa8f23821');
    const expected_c1_c1_c1 = parseFp('0x119333342f858af9c68985c95f71c5cccf10fb86f0a7d83ac05ba2e4b14c02d9a4404947dfa7963c735eccae622f06e6');
    const expected_c1_c2_c0 = parseFp('0x0185d63ac1d0bdf333cbd09e59f8fea872c9f7601f05e815eddcfdb9aac5ca8baccff50a25e00ddfe2072b20d9e4dce7');
    const expected_c1_c2_c1 = parseFp('0x07e50373a50cfa55df727f3388c4d1dd9e2ae0f3004e9e1ca7593e3954c97a1e97af2aa6b01ccd1c163ffb7f45c1125c');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('pairingGenerators()', async () => {
    console.log('calling pairingGenerators()');
    const result = await pairing.pairingGenerators();
    console.log(result);
  });

  it('cyclotomic_square()', async () => {
    const self_c0_c0_c0 = parseFp('0x124380762e22ca937c6ac33e9ddb6ebeb4748576189768f2784ecca385911956bc8156477c7d5ca906c9f89e2036eab0');
    const self_c0_c0_c1 = parseFp('0x0cd2033285139a04ef68e31007030e948d97f113944493d75a2016d0cc393897c39a09544af1e4deead993dc4b585bd6');
    const self_c0_c1_c0 = parseFp('0x003982f20fabb302ed14338be89827f697cd4b78cec08a52981a01254b0b50f33130c385bed18ba2ea64384bd14cc205');
    const self_c0_c1_c1 = parseFp('0x059d190b7326e9ee16dd0f5dde597e02c65045adca73066c3303f17c6867c6d09fbf297653ade561c7dae1508c95db16');
    const self_c0_c2_c0 = parseFp('0x10c617c6bb371adc31049231fa04bfe4a5d9156c3608f3ebc77cd0a818bd374843239bd65e671e12c352c8501fd3780a');
    const self_c0_c2_c1 = parseFp('0x04508e58b02ddf6e46130e78d01b568bde430e6683613326fe33e1bd227591cb73b81eaae48e2ce57da74512572efc3f');
    const self_c1_c0_c0 = parseFp('0x094250a35fd720dbdd1e7f9122e67a23323908549f435e1bd571f8173a0e120385ed9c95d817566cdf1b551b123ced57');
    const self_c1_c0_c1 = parseFp('0x1769df0dc7b1aaabb3df48467637ffa784edbce76d974b09a5b6eb8b4e8d5be9a264d99d696576a20beaf6a3152fbdf0');
    const self_c1_c1_c0 = parseFp('0x08213e625d838feb36cb8935e5e2e2351073aa09f70f5b868411e3b9c236fc0058993a61a373327cd902cf21296868c8');
    const self_c1_c1_c1 = parseFp('0x16de3da0e1c1f16a55c3b36326ecdee27d3c26873a2fc4ce74781bca796f3bf8160484c4562b6e3ec06140bc3d2d7deb');
    const self_c1_c2_c0 = parseFp('0x0286af0f4990de66eb2234270312cab163e96a71fb9b8f428de09b3cb66c199dabe5d30c8603598983fba8229e3892f3');
    const self_c1_c2_c1 = parseFp('0x12ed01677ccf2b63c14686e650bd0f4872c8a1a8de44fb96df1aa06d3ad95ad0eaaa196c90ef97c177c68d0526b87b80');
    const self = {
      c0: {
        c0: { c0: self_c0_c0_c0, c1: self_c0_c0_c1 },
        c1: { c0: self_c0_c1_c0, c1: self_c0_c1_c1 },
        c2: { c0: self_c0_c2_c0, c1: self_c0_c2_c1 },
      },
      c1: {
        c0: { c0: self_c1_c0_c0, c1: self_c1_c0_c1 },
        c1: { c0: self_c1_c1_c0, c1: self_c1_c1_c1 },
        c2: { c0: self_c1_c2_c0, c1: self_c1_c2_c1 },
      },
    };

    const result = await pairing.cyclotomic_square(self);

    const expected_c0_c0_c0 = parseFp('0x097b5e6ebb593ba512e189c70d26b673267a224c8d55b61d604c3448ade3d6c85b6899cbd084fc130679dba27f14f6da');
    const expected_c0_c0_c1 = parseFp('0x0aca7f832cbb61ed8e271cbb132b3bf1b2388096c820ab12f27bcb718c256dcd850518167278648a0d6cbc3e8455b2f5');
    const expected_c0_c1_c0 = parseFp('0x01e599054f528a0a883ef967a6eb5ebce990bdeda46e5e0ba47b64b7a4fe40454ee4ef5f6f499647d894c09bec6a8fc4');
    const expected_c0_c1_c1 = parseFp('0x15cb5231598f37a312ddc399aa8a179e02d80a94e4a06de0ad10bce1e76ca770bb845a44992a585cbcab8112de011f68');
    const expected_c0_c2_c0 = parseFp('0x0f6b9a7a3ae1a216967dadcac954eb03756f3c02699241e3e9a1a05975ea8c82d255ec9bb37fa65eddcc65e165dee320');
    const expected_c0_c2_c1 = parseFp('0x1595cef891f5f408c844427a7beca154e2613c700e98f0bcc862660054ce03f985c9c8ad3e0651e8bb2141c012b75f9a');
    const expected_c1_c0_c0 = parseFp('0x0ad18ec6bf30af945ee6105e6089505bb77f3c2a41bab1ba80f247f0f52515e391785f488288757bede7d0eee2693179');
    const expected_c1_c0_c1 = parseFp('0x0bd5c1ee06aa70f6b39d3689bd0c9bbc9ad8373f40ac32adea0d7080685785e9455839be126952fce49266d2ff2deae9');
    const expected_c1_c1_c0 = parseFp('0x0e8ee3d58a222ebf1da957f77b234b161a8c4cbdd47cd0fd351a881ea8dfc7aca8634f8c84f9f57f3b62e57edaac77da');
    const expected_c1_c1_c1 = parseFp('0x062142e6736884b1d9d7e9cbfcf361f6d4ac7f36ce6465c3986946f44c90c69f5252f32afd5e1e3f95192189fcbb16a7');
    const expected_c1_c2_c0 = parseFp('0x1624bf3e6776592908fd19825d1ffdc1d9010fdd861b558ff9ffbd5264868607594b6201f47ef36e1d9165c1ce31779a');
    const expected_c1_c2_c1 = parseFp('0x0134aac7b65c309351d17f04d2510b3edd95fdddc7b20cdf2db63d9903aae22446bebd36a424aca464c74878972345c9');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('cyclotomic_exp()', async () => {
    const self_c0_c0_c0 = parseFp('0x0b6fdc065ff0bac7b80bd63f4e46633173fd5ce271019041049c2cb03678d19dac26770baedba4bbb9d1bca414aca9a1');
    const self_c0_c0_c1 = parseFp('0x02ec907dbff85572b2148bc1f9d67a968fdb2b8fb9f317dd6dd2e7b50cad133d47fffede28261c51710c38b8a08d7a7d');
    const self_c0_c1_c0 = parseFp('0x0b27ca967b92bb46ab5b8af46ce368ea43a635a3653c68b7735dde29efd64e551537748cc1bae81f8b156c04fbc3ed98');
    const self_c0_c1_c1 = parseFp('0x0fa66ea55cb675d3d1e0b1635bcbedc6d5358bc0f69e74ececb0900c3198c04c94486f150ffe814599e1763deb960ccd');
    const self_c0_c2_c0 = parseFp('0x168575d742f8a82b6b89df92cbb5bfb5f1191b1f09206646beb6e49383241eac4d2ffd27335a8c6296bab1894526a55b');
    const self_c0_c2_c1 = parseFp('0x180b557ab7f8cb1d5ee18cfd6f8ee3a57a7ef2ee9fc2b0c42539c4b11615949781e8594b9d78aecc72e021de03bc145a');
    const self_c1_c0_c0 = parseFp('0x0244417af373d9fe065d86b4f9098c65d3996428ad28960e591dfdd24c75c265beccd5816ec52b5b2699c2c2b6fec341');
    const self_c1_c0_c1 = parseFp('0x10b9f709d2a19d3791c82008c4e618dccabd8471c67c5937c803b63bc74c61d4ff440acd3e835536df3d7e402771cb16');
    const self_c1_c1_c0 = parseFp('0x1275ff4b64f79920c1ec23e42aa1a46ec0edd6697fab8898cf93b1ebf5a069bcada7f6543dfc586c913d0b98cdd4a8c3');
    const self_c1_c1_c1 = parseFp('0x0814b7c3db265a140b15efb5cc29b7b9812822e3e475d5f51d4560a4d02dfef1957d5543c1cb3d58e4062421bcc309c1');
    const self_c1_c2_c0 = parseFp('0x11c90283e1bab380b7d343d518fecb475379ab125a9ca68d81ffbc2863f24f4a01c0a7af080a0fa0ddc7261aeac3e527');
    const self_c1_c2_c1 = parseFp('0x1a0011c5c9bec1f5e6113dfb14191f38778cb960631af8bdd540a97e911ba622dc13ef1ad3a9c8bb8a13dd8b06dae908');
    const self = {
      c0: {
        c0: { c0: self_c0_c0_c0, c1: self_c0_c0_c1 },
        c1: { c0: self_c0_c1_c0, c1: self_c0_c1_c1 },
        c2: { c0: self_c0_c2_c0, c1: self_c0_c2_c1 },
      },
      c1: {
        c0: { c0: self_c1_c0_c0, c1: self_c1_c0_c1 },
        c1: { c0: self_c1_c1_c0, c1: self_c1_c1_c1 },
        c2: { c0: self_c1_c2_c0, c1: self_c1_c2_c1 },
      },
    };

    const result = await pairing.cyclotomic_exp(self);

    const expected_c0_c0_c0 = parseFp('0x11f572099b931b8668e3447d7ca2a53e82fb159dd346e4a18e8797d11f208b9148ca22f0b12b67afa3ebd4b193b9ca0e');
    const expected_c0_c0_c1 = parseFp('0x022e84257151ecf508fbe86cc164c57134e51c0e24b3a2a52ca4cabb6efb9b13fa8ac297eebe673c3730a1ef09ba8a92');
    const expected_c0_c1_c0 = parseFp('0x0263fd0564f1d39813f9e531da3c4b759b12df8dc5960e4f1986b716c9b9b660d63d63c29373da163668b9cb9e48f54c');
    const expected_c0_c1_c1 = parseFp('0x000ca035c4df4b0445a520a4cd7b85bf463e3571df6aefba73526544f81805bba9f4706c76843ab59d0dc5f3294c6e18');
    const expected_c0_c2_c0 = parseFp('0x15b6a9eb2873e42f86c4a8bcad77a9b8f5fa18b817154c328283032bc821447661811f8be17d2cdcc6b8b62549f4b5e6');
    const expected_c0_c2_c1 = parseFp('0x09c8017c81b1410d9b158815e2bf1e61fc9aa8482a9b4f95762e7639455825fd82acc63cf0d2c73b2278e8e765aeca4c');
    const expected_c1_c0_c0 = parseFp('0x0dabd84f6926c7b74b1a6228fcc44e150683abf417c68dd6d38d1f6f23ace53983bdf7338360708b7b86ddc36b3cf08f');
    const expected_c1_c0_c1 = parseFp('0x1071fce26064cfd4ad22e63d7a36a915af40bee95c8a10b770609bb0468fc4a7c2eb0fcc5fe26d63578c2a51de44bc0e');
    const expected_c1_c1_c0 = parseFp('0x079d47df7468411ddeb73cbc278996f1f13f9482552462d0861eb5700919a02a56a71477a5dcd5702538b21470003cf1');
    const expected_c1_c1_c1 = parseFp('0x0a0133158d36bf906ca9d2dc42015ef7011ed787db174a0c20567e0c17fa7738b0c6a33b4e118c9bc1284f295a89b0dd');
    const expected_c1_c2_c0 = parseFp('0x0b3fee8a1858de6e27823b0cd40505825598400a5d719b133e04a81ce15604c19adc50ad256e6363ca3e188240b7b58a');
    const expected_c1_c2_c1 = parseFp('0x1747bd4ca58ef9ae807d4d3cbb6af21f1f30ea89d1bbad265f0bde5f2edea39e570170a793665b2733692f62c8914a01');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });
});

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

describe('Fp12 lib', function () {
  let fp12lib;
  let fp1_c0_c0_c0, fp1_c0_c0_c1, fp1_c0_c1_c0, fp1_c0_c1_c1, fp1_c0_c2_c0, fp1_c0_c2_c1, fp1_c1_c0_c0, fp1_c1_c0_c1, fp1_c1_c1_c0, fp1_c1_c1_c1, fp1_c1_c2_c0, fp1_c1_c2_c1;
  let fp2_c0_c0_c0, fp2_c0_c0_c1, fp2_c0_c1_c0, fp2_c0_c1_c1, fp2_c0_c2_c0, fp2_c0_c2_c1, fp2_c1_c0_c0, fp2_c1_c0_c1, fp2_c1_c1_c0, fp2_c1_c1_c1, fp2_c1_c2_c0, fp2_c1_c2_c1;
  let fp1, fp2;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('TestFp12Lib');
    fp12lib = await b12.waitForDeployment();
    console.log('FpLib deployed to:', JSON.stringify(fp12lib.target, null, 2));

    fp1_c0_c0_c0 = parseFp('0x15f30bb146420a3596196bc00af6c7091b1a912d3fe7024390015b157ce58b8cd3b853fc617f50270c4dafd0b8364404');
    fp1_c0_c0_c1 = parseFp('0x154e7e0da1249a829901d1abbda7c91f95378f62afdff255ada13ece005b9f200223cf7241ef7224541007e5e06f8f56');
    fp1_c0_c1_c0 = parseFp('0x1554a7b734fd6a38a44245f5a4802051ce3cd4e43ef0d2245c67706ce8bcadce52b7f555b942eda2c5f0ec0e52955a3f');
    fp1_c0_c1_c1 = parseFp('0x129a9681d8972bf82d2d412892e1965d884373226ac49a18b0e0429a6724493bbb7cb552488b0916b200d2cb39ed87b3');
    fp1_c0_c2_c0 = parseFp('0x00329b0efda5da0fe6f68ae49534a765298d16166d1d4a2a6431d5152ea73c01f4099634fc82edc01744cb997f49fa44');
    fp1_c0_c2_c1 = parseFp('0x06549512e88b6a95eb31e043e5edba7e9e64a488b140186ca782becc4cc4c16cf3190036543bb8a8403bbdfe4b0f6f5c');
    fp1_c1_c0_c0 = parseFp('0x13481c6fffc20eb036e011b81b1d3ce16fbc76865078fef1a6866d1f31f2a2a5a102d326b37dedfdc0c5196258fb405f');
    fp1_c1_c0_c1 = parseFp('0x1967190a72709dff96d913851bfc0cd2ad3ff4f84e2e65f835ff59469e8a8c234ea6287f925088b30c9f9c61d9dc7d05');
    fp1_c1_c1_c0 = parseFp('0x0192a396c9f3dd698610e6663ae63a148303a67bb2fe23b93a2541af555eef94f4968726c731c9dd1b4609c2e6c498e2');
    fp1_c1_c1_c1 = parseFp('0x0911cb58b939e97b259e92cbc3f762d0a4392863a9625facf0b70b09ff27c6e4e5a029aaf840f3d4a86e7ef3834db63b');
    fp1_c1_c2_c0 = parseFp('0x0e73f51654c73f1674f30fe5a450bf7881f4e6e272ae2c41e573fabf2f6717dea83f8a7112db1dbe03b8173e57c57383');
    fp1_c1_c2_c1 = parseFp('0x04cc1157baea01e9d4da36d60eb9fe96d8308a9f3f4a38256cf6b460fd3b3152dad05f740a8fb550d9ad14acf6b61d57');
    fp1 = {
      c0: {
        c0: { c0: fp1_c0_c0_c0, c1: fp1_c0_c0_c1 },
        c1: { c0: fp1_c0_c1_c0, c1: fp1_c0_c1_c1 },
        c2: { c0: fp1_c0_c2_c0, c1: fp1_c0_c2_c1 },
      },
      c1: {
        c0: { c0: fp1_c1_c0_c0, c1: fp1_c1_c0_c1 },
        c1: { c0: fp1_c1_c1_c0, c1: fp1_c1_c1_c1 },
        c2: { c0: fp1_c1_c2_c0, c1: fp1_c1_c2_c1 },
      },
    };

    fp2_c0_c0_c0 = parseFp('0x08eb56c0a9dc196203f6493a107198ad1ea4b6559c1c760d4a31a6d0cafb0a31534c9aa6df8994e07f4877b4cc90fcf6');
    fp2_c0_c0_c1 = parseFp('0x03a4235753d501c0a8a80c20ef7d6742f8945f128f7682a66dc146e7a3452e057a2268566c4015f00cd841cd916aebad');
    fp2_c0_c1_c0 = parseFp('0x1536e376b042ac9c91c708ce541ec0febfc442931ea206ea47be83f27dcca7c6aa944b7e7391e3d509c3442686bd7f82');
    fp2_c0_c1_c1 = parseFp('0x149bb326456b03e2739079be25d52a021b25710fd1df6357c3e82b7545fbe220a26dc2d30c8a03af75a874158c7a358d');
    fp2_c0_c2_c0 = parseFp('0x14f3fdf39f3aab18d657d23acfa6ea19b8f25a0d932bdfd037f18c3263ece00934630916f93c7c220ce5489d32992449');
    fp2_c0_c2_c1 = parseFp('0x0ab75a4fb139b593d0f95d1141b8f91ee1da9c02de1ecb866b3f2e0c6fe2dad46648c117c7a071ab58b1680002f4181b');
    fp2_c1_c0_c0 = parseFp('0x10037f4b9d2667c806ebe566021be42ed3069e5461c99d5074fae7a6d32581da10865513e4dceab3f65bb6104b82723d');
    fp2_c1_c0_c1 = parseFp('0x00e5f5a8675f33fee5cc6665a0091c499b4840d88d71ccdbc7f0aced12965be1916ed600e431059f47fa8b524cc21128');
    fp2_c1_c1_c0 = parseFp('0x185b3bd20f55b08ade36986e680e429fab32c96066d0e157e56f585662db45243589bfc60f0cb828ed80a58a93806dbb');
    fp2_c1_c1_c1 = parseFp('0x18028b15d1e9786464831e24047a36fe0f80812c3030f2e18b018bf04d2749b8e77381789662c9505a0094e7424026f0');
    fp2_c1_c2_c0 = parseFp('0x1005b726c0f3eb3b2783bfbfb9f49edfad4be32094adf427da33f4dd377d24755063164f70d4b9ef75b9cdcfe485ea70');
    fp2_c1_c2_c1 = parseFp('0x0cd6ccb109f7cc80c01fcd00a4428a81ec32b65ac96cfb2896a8698de0588ec05bd264c05f46d27f8e45c56f6506beae');
    fp2 = {
      c0: {
        c0: { c0: fp2_c0_c0_c0, c1: fp2_c0_c0_c1 },
        c1: { c0: fp2_c0_c1_c0, c1: fp2_c0_c1_c1 },
        c2: { c0: fp2_c0_c2_c0, c1: fp2_c0_c2_c1 },
      },
      c1: {
        c0: { c0: fp2_c1_c0_c0, c1: fp2_c1_c0_c1 },
        c1: { c0: fp2_c1_c1_c0, c1: fp2_c1_c1_c1 },
        c2: { c0: fp2_c1_c2_c0, c1: fp2_c1_c2_c1 },
      },
    };
  });

  it('one()', async () => {
    const result = await fp12lib.one();
    assert.equal(result.c0.c0.c0.a, 1n);
    assert.equal(result.c0.c0.c0.b, 0n);
    assert.equal(result.c0.c0.c1.a, 0n);
    assert.equal(result.c0.c0.c1.b, 0n);
    assert.equal(result.c0.c1.c0.a, 0n);
    assert.equal(result.c0.c1.c0.b, 0n);
    assert.equal(result.c0.c1.c1.a, 0n);
    assert.equal(result.c0.c1.c1.b, 0n);
    assert.equal(result.c0.c2.c0.a, 0n);
    assert.equal(result.c0.c2.c0.b, 0n);
    assert.equal(result.c0.c2.c1.a, 0n);
    assert.equal(result.c0.c2.c1.b, 0n);
    assert.equal(result.c1.c0.c0.a, 0n);
    assert.equal(result.c1.c0.c0.b, 0n);
    assert.equal(result.c1.c0.c1.a, 0n);
    assert.equal(result.c1.c0.c1.b, 0n);
    assert.equal(result.c1.c1.c0.a, 0n);
    assert.equal(result.c1.c1.c0.b, 0n);
    assert.equal(result.c1.c1.c1.a, 0n);
    assert.equal(result.c1.c1.c1.b, 0n);
    assert.equal(result.c1.c2.c0.a, 0n);
    assert.equal(result.c1.c2.c0.b, 0n);
    assert.equal(result.c1.c2.c1.a, 0n);
    assert.equal(result.c1.c2.c1.b, 0n);
  });

  it('mul()', async () => {
    const result = await fp12lib.mul(fp1, fp2);
    const expected_c0_c0_c0 = parseFp('0x0129afc7c1ca7d1f962c83320b1f917416f67d39c5555d6d0fe36fee9ed7268b644b855036b05d016ef6d3a246026046');
    const expected_c0_c0_c1 = parseFp('0x0d6e3fba17f36cfe1f88ee187892b650827fb693538213ed785551294534f7771d7438b13a289031ea7b2f75b64c2a27');
    const expected_c0_c1_c0 = parseFp('0x006364f3ed0b46136ff623364595b668196a032814bf422cc3ebec42d8ed984ca1a9a1a0ad14a537241d0dfcb0c1dd95');
    const expected_c0_c1_c1 = parseFp('0x02680bd3eb89aa87261c6d6b16a9a0b157d65994699f9109f035ed5c33c7e3cf74339bb002b09c81638ede38bda4d1b1');
    const expected_c0_c2_c0 = parseFp('0x07879ada3a5032e92bd6fd23c9aca9af8d1cace444b8c0cead456442f2486f952dd69959a25bfe4a9d7ed1617fc85e35');
    const expected_c0_c2_c1 = parseFp('0x14d9b49d750e3234fb4076bc9cd84563dd67c7e02935248385ad7c5a8179042f0a1bfee3538ce6f66529c6a06d6bdfb5');
    const expected_c1_c0_c0 = parseFp('0x07d324bb6fb13e2058f0f3dea6fd9b627e4d29ad84d0bc2813c45049273f48b60a7ae85ae05ae77d38e7a62e3d152d17');
    const expected_c1_c0_c1 = parseFp('0x00343f072a0d670d454ff64f58d53cdc7a65b2a6f4b0d32652f256e7857a41f26dc76fc2b868ae193254d51119b12553');
    const expected_c1_c1_c0 = parseFp('0x092a1658eb9b3d3c0bc9b2479f0a9f22259b1fa599f0eae47094f04788e3b6b7adcb86b1f127c9e555d5a14348b1e843');
    const expected_c1_c1_c1 = parseFp('0x19305585246b802f64de7a7ad24dc21c93caf38f95595e3247a61da36c017d1fed2840254bcf80b3e9df9dadbdc2be01');
    const expected_c1_c2_c0 = parseFp('0x0ce8082c150f325da559b64d4bf6cdecf57b4cd08c9ba8904100fb926ef0f1197a0b5d7278752486a6317f63318bd6c4');
    const expected_c1_c2_c1 = parseFp('0x11261ebccab20e9c9228b218c35a4bb1e5abbfc01535987518f0e76af842e6b99461b6f8cbf95e8698c063809d81b15d');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('square()', async () => {
    const result = await fp12lib.square(fp1);
    const expected_c0_c0_c0 = parseFp('0x190868e8fac47fda5c2a8131bffeac4a1762f21089ce303f0f48601472c36dcab0484a3ba2c744321f95cb9f6a233e0b');
    const expected_c0_c0_c1 = parseFp('0x17654a404c677dea53ed0be5ff5bbdd785d950de47759c532b00951eccdc0e59fff2114e85a3ffbb8bc6c7a4b08efd1b');
    const expected_c0_c1_c0 = parseFp('0x03e0993de3f59a473df3ffbcf296799bb6432f7f07b54857deb383b8214710c8f22c05a503079318004c74d9e44cdcc6');
    const expected_c0_c1_c1 = parseFp('0x08893437da4595deb892c894262c505344391dbfe4ffaab56bb7ea831e2172bf7be94f7ecb8062c56ba4b3c0b23fefac');
    const expected_c0_c2_c0 = parseFp('0x0309a24597b14dd0de296a188e7aa14c772a860f3bb4a871313b74999af95d3dd52cb141fc2859af6fe68a902986dfaf');
    const expected_c0_c2_c1 = parseFp('0x1118aea76bfe11f72620aab9c43c3d9c4dbdef9b82f5afaa63d0d39fdcba35ea1d3127eb014f978b3c187ce7226785bb');
    const expected_c1_c0_c0 = parseFp('0x00d3d7547d23ed8c972e8e833fbd7c83ec8abb1c11a662e3415be8fc54d142822ded146d6ee0c0fe38cc089ed51ad410');
    const expected_c1_c0_c1 = parseFp('0x0b8c4e0618b6ba68dc721dda927b69f6935df0efd59c4da17964129728bb4e1a1f1ada7e0cc161e3895540117f6a20ca');
    const expected_c1_c1_c0 = parseFp('0x176fdcaa4311d056920a3fc7bbe2a1dab3766f1c5e8c0dda28990e63443f2e646815c997c3c9ab13ec22c1d5e91e931c');
    const expected_c1_c1_c1 = parseFp('0x09fb834104bc84a0f1361af5cee3f88b91370e2548df45fd668529cd30ec04d0c237a0e495eed432fceb6447bd2344e0');
    const expected_c1_c2_c0 = parseFp('0x08bccbdc6b2621760a67a65adf69b386cb07fadf02fd262f61f58583a8ac9c8a08000d056c1d82cf420205f5b4184e23');
    const expected_c1_c2_c1 = parseFp('0x11ece3887f4e66254df1e1e48bf1b8bb491cbddb32d4a846c006e334c83abc7fd8345c6412f07c1dd7f0e1c62365e483');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('square() another test', async () => {
    const self_c0_c0_c0 = parseFp('0x17c7ac66a7e3013bf890460402ebcb7ed9d774e8cb1730819d61eea5f44e3900f767b944f9bb5b8eb9d2d515f2b4e0a1');
    const self_c0_c0_c1 = parseFp('0x1284eaad24708408b0a24e5a880daa7b4c269433ce96671e497d5bd7343f8bb748208a3a126612355a4b3f7900aab208');
    const self_c0_c1_c0 = parseFp('0x0c494334ff3b94dd14d5da1fdf7f27696386d2f40a8cfc56c37b31d65e19b3e3431b95edecf145214731702074cafa58');
    const self_c0_c1_c1 = parseFp('0x09ac8337c31d4b981252a2ca910eaa250c59cbb77f731cc65236e7fd1a5ce476e126ee843f7cee21f7b8a4bd03d4a39e');
    const self_c0_c2_c0 = parseFp('0x15b126f88c3033353598b3e817b0b6fa9f59d918b81aaf14874530cd84c8c803031a0f8c20a1f259e3d20ceebb1ab784');
    const self_c0_c2_c1 = parseFp('0x0a762f51cb6b59526276d4e9dae229fbc9faac7aea9e0d08f790e301ee793aa2c6f3caa9bd31166adc1223c29c469f2e');
    const self_c1_c0_c0 = parseFp('0x0f16c3f25700abc8077e118813e396074c590100c950ed8b1bab16a412f93adddc6aab9eab9cdbc47893d2f65f2cead2');
    const self_c1_c0_c1 = parseFp('0x19c6cf4424dd6a38b11d9e97a88e275307a848513e6b97e42801352ab818a906b71e0f39d3dad0b73d74d0f89d1c2874');
    const self_c1_c1_c0 = parseFp('0x06f748e7f16d94a63fbaeea8108f4046c49f2204019cc68491597f302fe50d834efb5c619edc9189a5a888c9026043ab');
    const self_c1_c1_c1 = parseFp('0x09e801ae1d5bab189149a8770e0e74ef6934c0d4d4c503ace704099e60ea0aaecf1b94082c642efb5a4230fae87f1c5f');
    const self_c1_c2_c0 = parseFp('0x01b955cfffe897f1ab47451a34c951ce0a8ca005a17c8509561036c5bbcda3e7cfe4d54a73654c9c57f31887a2dc8ec8');
    const self_c1_c2_c1 = parseFp('0x142dc6d1eb202e6d2dcb69a1924b2c4b4236681b38e742945963e824e0d73d62ac8221df673ae75642a51b0772e09d26');
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
    const result = await fp12lib.square(self);
    const expected_c0_c0_c0 = parseFp('0x086e1ad516be18ba5ee921aa83a5cae2e1bbcf81dee6f4fbf009d87c900cdafa671db9f476eae6eede4f454a990c1ea7');
    const expected_c0_c0_c1 = parseFp('0x04f7b1dd8228f61c6330520dc1b51c9466a0a121487a368c8a81f2f99f6f2977bcb934aff9fb9e44216cc38233866f45');
    const expected_c0_c1_c0 = parseFp('0x080106b9b58355f5c6b7002c2c1ca9f7530f67204cb6709d49666f0256313b2c370754f481e63ba36ba595b220c1c069');
    const expected_c0_c1_c1 = parseFp('0x0090d1a6a26dedc8948c56b56ed951f931d36cbeb47565b8678af1da4585a39af222d18e3ce143d885af0bcda3e42347');
    const expected_c0_c2_c0 = parseFp('0x1703ca80a57cef619c2189059c46ca6c2698b7ce3971aa8d70e5246b1eeeeb9f48e4cf9429353ff20d65b2c2f849de5a');
    const expected_c0_c2_c1 = parseFp('0x01f7d56176a8ca16cbcd3f158e020902e876784b5f720b643276fbde44fac32a4c4c37fc58be5a2af8cdc3fc92c66f97');
    const expected_c1_c0_c0 = parseFp('0x083ad865fde2767387350a586d922f86b932e55be61f0395d9204dadbd2dc02509a4c34e22b0249859e863ee8bc767be');
    const expected_c1_c0_c1 = parseFp('0x064ad3f30ac6b31d4014279b6fae826404e8e4c59d4cb142eea9c8c20f928174a94bd8f4d4d791b0b94fda6057b47ec1');
    const expected_c1_c1_c0 = parseFp('0x0aa427866a3817ca64c22093f6239a392e3e5f2af111161b1ab8a32ff7e7d8143494fcab3fdfa935033372d3a421b80d');
    const expected_c1_c1_c1 = parseFp('0x06d5d6603855511161a621a029091821909de98e69444caa68317b9382de34957244a533ab8a4bec1d039e51c6e6412f');
    const expected_c1_c2_c0 = parseFp('0x0042499ec46a12b6e215550f7c4731d9f54ebb19237ff34edff8b98978ddd1ccbf8c839ef29bba7252cfb1e41b0459dc');
    const expected_c1_c2_c1 = parseFp('0x12e62e784cfb1349de912b9f3dbde721c482bb98e1f878ebd56fc52cce3c2c6cf1b11b52eb99afddf38a5306e41cb096');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('invert()', async () => {
    const result = await fp12lib.invert(fp1);
    const expected_c0_c0_c0 = parseFp('0x0cede514d1f8a3751e7ce444093ffa1d35dd2e30310806b407ba1948247ab9e52cfaf49915575d1e75e944a00c0ca2bd');
    const expected_c0_c0_c1 = parseFp('0x0efa0737debdcad772f304546151a73e923c2613be65112290d6fef6af7089b4dc2073224faac826eebc9384ef55abe8');
    const expected_c0_c1_c0 = parseFp('0x0931f46c846f1599e1f77e11d4af739c96ad5d57b0a276071dc2e998a7bae3413cb7dbc67c25e9152f095786a857e8c6');
    const expected_c0_c1_c1 = parseFp('0x052ee2047680480938e2b69a5aa24d5ed7ec76e8d7c3a70242e3bc1ee0bfffdebc339b22ae1f3f79c9e602fd97994234');
    const expected_c0_c2_c0 = parseFp('0x00dadaaf8101f5cb9876260230437046ee8a070ca7aead923260504b7ab40a75f37abde788ae19e92712ba357cca90e0');
    const expected_c0_c2_c1 = parseFp('0x19104f41e277c40b1776202d24d01c1625593aba6a07e567bcb0050eb7a069844acb64c80b72cd15b749266ca862c77a');
    const expected_c1_c0_c0 = parseFp('0x16008a2f3d3c5125ac2768b6f8f67393f271f04af22fe58d3b8a011eba3c141bb4810dc3dc5c485a9770974c6e079ccb');
    const expected_c1_c0_c1 = parseFp('0x12307506f2af0a464313d0b1b58a89fad5ed0afbcd7b5309644cfb01969185658bf9a5cbe7bd5708fb673fadbbb3a40d');
    const expected_c1_c1_c0 = parseFp('0x00622d3ac69696f367a7e5b5e4baa290891aa5f44a1a763a15fbea3e4f74e052586d8bf81d106bb3e1ec9db6172cdef6');
    const expected_c1_c1_c1 = parseFp('0x0d7a59b37e2e353ef6bb04dbd56841f04b50189996550602d93df7e5c6b511c6735031ba43337e069ff7df8bf03ffa67');
    const expected_c1_c2_c0 = parseFp('0x13e736ea0183ac3af18929935f3e65e41de0f6056d77f1c2f193a1883a3bb405d602acc3083638ee3d3e2afdf74404dc');
    const expected_c1_c2_c1 = parseFp('0x0cc556f48855d00fb42260b84756fcedd9eeabbbdd600550b016c0c20052afbbba1f4678e61a608a42b74f7b93e5978f');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('frobenius_map()', async () => {
    const result = await fp12lib.frobenius_map(fp1);
    const expected_c0_c0_c0 = parseFp('0x15f30bb146420a3596196bc00af6c7091b1a912d3fe7024390015b157ce58b8cd3b853fc617f50270c4dafd0b8364404');
    const expected_c0_c0_c1 = parseFp('0x04b293dc985b4c17b219d60a85a3e3b7cf3fbc2243a52069b98f93d2f65557041c88308c6f648ddb65eef81a1f901b55');
    const expected_c0_c1_c0 = parseFp('0x02481c0453dde3b97f0da08d9b51b759443d35c9f851ba0c0a3790b5cb83cd9338da21ccad32815731e8bfcce5c67e93');
    const expected_c0_c1_c1 = parseFp('0x09750a21a5bf579a8547a4962d93d17d5b4524a6875b7a0520d7075dd6e3351ecb10f65d1ab9769515a17ccaa80a2709');
    const expected_c0_c2_c0 = parseFp('0x12be8c09e110109b513c0f93e6063cffc191bcb0f78cf5e7f935c49a8b64be6574ca83735303807f65a52e7b45d66c6e');
    const expected_c0_c2_c1 = parseFp('0x10b50724c658a333c47eedfb0248c118da9a7b250c571972e92eee26a4828c20d3fe94f583d13bc3b3fb53a2e240f8e1');
    const expected_c1_c0_c0 = parseFp('0x0d5e4cde27d75477c3c3b859eaf60bb2523808bf53ee4d149721aedd46e061d533856fdcdb8028ae3aae7fc1c148ec7d');
    const expected_c1_c0_c1 = parseFp('0x0d4607d984afaebd55039de595953cc03eaf171f453dc04f54f134e849358c5e6f91970fe1ac1ffdefc32d06d92c89d6');
    const expected_c1_c1_c0 = parseFp('0x1565f1dc8dcf6165429bf9f7267864fb4dd752d030f253c03404308d1112c5f3992d9fde39f7b7b25342694ae50388a8');
    const expected_c1_c1_c1 = parseFp('0x160405304c584fdfa0963f6b74e102f3afc7a14889af7679dbac658fb8f6fb854076ba6ac787182ede7c55d20994fa80');
    const expected_c1_c2_c0 = parseFp('0x0d3bd9e1ec2dc95390cc5a49fb7664c7c08ca96a34acf8cdb07c9bb0b1d5e375df619a5c1637ba70291a29a57f3dba60');
    const expected_c1_c2_c1 = parseFp('0x1320fc638c14abd4f7256d8d690d3ce4e6bf14221e8719ff7c1dce5ae7f98d5671a69d7003ce6757ab6e7cdafa4ddd30');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });

  it('mul_by_014()', async () => {
    const self_c0_c0_c0 = parseFp('0x132b9a2276dd2b39a919aca4cdb85f6c7a9810d84e9bd2c36004c2a080a01b2c4863f7ba024fbe5e22b4d2298f43149c');
    const self_c0_c0_c1 = parseFp('0x05a5e66e993b22427a2a056c3209e27ea26235086cdf10361b3e867efb382f820c7161791fafa6924f96d2b8d2cc63e0');
    const self_c0_c1_c0 = parseFp('0x02e9d6c766b919bcfdf44fa26e8ed3b24feaaf753911c715046c78551aa70508f899e668beb913bfb6d8f3be1a96d675');
    const self_c0_c1_c1 = parseFp('0x07bc899d78f23bf3637bdac70786490b2e072cf07018ad00160bbd5ef9d6f16536c91691a97e26353a748ff8572d531b');
    const self_c0_c2_c0 = parseFp('0x0ca481b0d2769793c1381c9d3eb71a53022355bec8ec8e15b8ab0d54d0b36747b3ec687f9910e0eccde5491d34820c0d');
    const self_c0_c2_c1 = parseFp('0x0b7eef8a2ad5bd98d49c44a21e453ffc7bb1a66969ef9125c54c2e1da6903631ab29dced7bc281deb9e3124a81ba29c3');
    const self_c1_c0_c0 = parseFp('0x10e55ff65d870eddfefed56f8c16c50a98821bb9e42eea3bcc83f1a29e8502aa2d853d4830f1f0a569ee48fd90358cf4');
    const self_c1_c0_c1 = parseFp('0x1178407cea31312aa12f56a11577d71fa5c6634092fe1cf433f0deb1b5257132ff661997ab349fa85e4ef5e53f311126');
    const self_c1_c1_c0 = parseFp('0x0aadde69740a41eaf21bcbfc0b8ad7b880675423305db228eb9022724f9fb62d47e55c8fa93e488438a576b7db9f0dc2');
    const self_c1_c1_c1 = parseFp('0x03887539fa9491e585c78533d3bbb4560b6b17d09c98ba826f3d02f8f8eaad79132b6b09564d9753475756e7c040f259');
    const self_c1_c2_c0 = parseFp('0x018ba36bae8d6a59f1fead1281cf15fc4066e99fe3c921b21255c1870914bc663ea1cc1a68c91347b115fa0c84283edf');
    const self_c1_c2_c1 = parseFp('0x110f8b22b698917f92ecc162fb202e2905bd04835345a91ec48eac579aa16a0d9c89c62021fb35d905b99d1335998cac');
    const self = {
      c0: { c0: { c0: self_c0_c0_c0, c1: self_c0_c0_c1 }, c1: { c0: self_c0_c1_c0, c1: self_c0_c1_c1 }, c2: { c0: self_c0_c2_c0, c1: self_c0_c2_c1 } },
      c1: { c0: { c0: self_c1_c0_c0, c1: self_c1_c0_c1 }, c1: { c0: self_c1_c1_c0, c1: self_c1_c1_c1 }, c2: { c0: self_c1_c2_c0, c1: self_c1_c2_c1 } },
    };

    const fp2_0_c0 = parseFp('0x15bd1d9a82410fbecaef7909f15c831102aaf87506e22777a333cc20d2ef49d12f5a0abb68992e4d05cfea1755c72aa9');
    const fp2_0_c1 = parseFp('0x0da429e796147140d6f8e54926fcbd274e827742d0e63f689175860e3796596372ee3842cc2709f4ba9f8f788f76343c');
    const fp2_0 = { c0: fp2_0_c0, c1: fp2_0_c1 };

    const fp2_1_c0 = parseFp('0x12cc9b83b5d28f4dd9df39fd0879219dd44b2c9a70848603543e14aad569f016aba92900e29befc4ed33bc71fdba4366');
    const fp2_1_c1 = parseFp('0x001d8d93b119701f94a5a6e5f06410bbbaf073fe3dd76e737887ebaaf0438809ff785c971bae01639c49304e4bd87360');
    const fp2_1 = { c0: fp2_1_c0, c1: fp2_1_c1 };

    const fp2_4_c0 = parseFp('0x064ec29b548f6a30d5fa1d59af4067c5fdc4a820352dd4864ebb2d1518b576713ab3d1c93766762f8168be1a2bca07ca');
    const fp2_4_c1 = parseFp('0x149308e7efcd7a81fc134c36e140ef23f0f4309199c4899e713ff05a2beb19f711c6d66369bfb905aa1c5c9f8dafbad8');
    const fp2_4 = { c0: fp2_4_c0, c1: fp2_4_c1 };

    const result = await fp12lib.mul_by_014(self, fp2_0, fp2_1, fp2_4);
    const expected_c0_c0_c0 = parseFp('0x0d6595dfe84be1ceb26b9fdeead87a1348309e2d95714a3cfe5919f68481f06603f8a6f91709cca9b78a992adc89faae');
    const expected_c0_c0_c1 = parseFp('0x183707e84a632926eaf14ee6253970767cdfb4d2a08950e08c768fed7dc12ff34c8bb783082fd32e097981d6c86a4096');
    const expected_c0_c1_c0 = parseFp('0x0f5bdb63a7cd6eedfd9baa8c54c44a8d4c4cf939669f473ce019b63c6e43c808ff1b4935d57d8d82d7b80159d4b7c368');
    const expected_c0_c1_c1 = parseFp('0x04f18c4f5852d38885c558a76d07561910970a1a50f6b931479465aef1467f89e54160ec60bd17ca65da6c7e02dffec3');
    const expected_c0_c2_c0 = parseFp('0x0199ca2bcb91c48f24c1b06c47b498f8ff4122912c2a7ffc439052fdad1516f355f22cee7004253a4e3bc86bf886a4e9');
    const expected_c0_c2_c1 = parseFp('0x0badd62ee35aabcda09500a07b0a00f675e6255361790307aa59ebdffa80422df8152d1d57797d4cffa56d246bd9d77b');
    const expected_c1_c0_c0 = parseFp('0x154378a04d6e055817a0efd6a9e0ec8535159a14e69279e2e9f7845fc9d0454c938da291bc0652c3e56b671bd1a600ad');
    const expected_c1_c0_c1 = parseFp('0x0340df62b823707f0eb88e21266133384457689f8af380ac6295a9d8faac3bc6f1139139344e44b56e6128bfa1771e60');
    const expected_c1_c1_c0 = parseFp('0x08f80d344069eb337427278f9199d1b7508795379baf5a02fd15acc38ffae3a31b84510ee75b3aaf4919e55dbe29146e');
    const expected_c1_c1_c1 = parseFp('0x192fa76ca99c3cceb76f78c5195c576bd2d447ac9aceb719aad96ea94a01aff24695bf8501972a23025b13c34b9040d8');
    const expected_c1_c2_c0 = parseFp('0x191516eebc9fc5be1dbc06a074bb990f6df38524550a50b322f3cb9f6dd41a37c61d7619ae4d91ab3c89e1f95bae4d63');
    const expected_c1_c2_c1 = parseFp('0x1355f0b4838d2928cfe902f0d51f7f074d38b2c35d3f0a86e09700a2f994214c05e97cd9105c8f542e2e305624d1ea29');
    const expected = {
      c0: { c0: { c0: expected_c0_c0_c0, c1: expected_c0_c0_c1 }, c1: { c0: expected_c0_c1_c0, c1: expected_c0_c1_c1 }, c2: { c0: expected_c0_c2_c0, c1: expected_c0_c2_c1 } },
      c1: { c0: { c0: expected_c1_c0_c0, c1: expected_c1_c0_c1 }, c1: { c0: expected_c1_c1_c0, c1: expected_c1_c1_c1 }, c2: { c0: expected_c1_c2_c0, c1: expected_c1_c2_c1 } },
    };
    verify(result, expected);
  });
});

function verify(result, expected) {
  assert.equal('0x' + result.c0.c0.c0.a.toString(16).padStart(64, '0'), expected.c0.c0.c0.a);
  assert.equal('0x' + result.c0.c0.c0.b.toString(16).padStart(64, '0'), expected.c0.c0.c0.b);
  assert.equal('0x' + result.c0.c0.c1.a.toString(16).padStart(64, '0'), expected.c0.c0.c1.a);
  assert.equal('0x' + result.c0.c0.c1.b.toString(16).padStart(64, '0'), expected.c0.c0.c1.b);
  assert.equal('0x' + result.c0.c1.c0.a.toString(16).padStart(64, '0'), expected.c0.c1.c0.a);
  assert.equal('0x' + result.c0.c1.c0.b.toString(16).padStart(64, '0'), expected.c0.c1.c0.b);
  assert.equal('0x' + result.c0.c1.c1.a.toString(16).padStart(64, '0'), expected.c0.c1.c1.a);
  assert.equal('0x' + result.c0.c1.c1.b.toString(16).padStart(64, '0'), expected.c0.c1.c1.b);
  assert.equal('0x' + result.c0.c2.c0.a.toString(16).padStart(64, '0'), expected.c0.c2.c0.a);
  assert.equal('0x' + result.c0.c2.c0.b.toString(16).padStart(64, '0'), expected.c0.c2.c0.b);
  assert.equal('0x' + result.c0.c2.c1.a.toString(16).padStart(64, '0'), expected.c0.c2.c1.a);
  assert.equal('0x' + result.c0.c2.c1.b.toString(16).padStart(64, '0'), expected.c0.c2.c1.b);
}

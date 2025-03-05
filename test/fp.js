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

describe('Fp lib', function () {
  let fplib;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('TestFpLib');
    fplib = await b12.waitForDeployment();
    console.log('FpLib deployed to:', JSON.stringify(fplib.target, null, 2));
  });

  it('zero()', async () => {
    const result = await fplib.zero();
    assert.equal(result.a, 0n);
    assert.equal(result.b, 0n);
  });

  it('add()', async () => {
    const fp1 = parseFp('0x104bf052ad3bc99bcb176c24a06a6c3aad4eaf2308fc4d282e106c84a757d061052630515305e59bdddf8111bfdeb704');
    const fp2 = parseFp('0x12b5621fb67239efef4531c602935e8c6d62d28368942b7fcf27b47a5809a390c9539259bda4d957b6a21594e68abbb2');
    const result = await fplib.add(fp1, fp2);
    const expected = parseFp('0x090040882a2e1cf16f40f6345fb21defb63a36217e0b65e896074e5e08b07dcdafcdc2ac5f56bef3da8296a6a669c80b');
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
  });

  it('add4()', async () => {
    const fp1 = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000096c5b29a2aeacf35d2a8bafa77d7d541888fea8ec23d26865dfb3ba90bf1b2');
    const fp2 = parseFp('0x04253d2a4b6ea502f8bd517132cb4593026d83d7d764fbc33fe960b38be47b900000000000000000000000000000000000000000000000000000000000000000');
    const result = await fplib.add4(fp1.a, fp1.b, fp2.a, fp2.b);
    const expected = parseFp('0x000000000000000000000000000000000000000000000000000000000000000004bc02dce5998fd22e8ffa2c2d431d6843f613c2662738e9c6475bef34f06d42');
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
  });

  it('sub()', async () => {
    const fp1 = parseFp('0x104bf052ad3bc99bcb176c24a06a6c3aad4eaf2308fc4d282e106c84a757d061052630515305e59bdddf8111bfdeb704');
    const fp2 = parseFp('0x12b5621fb67239efef4531c602935e8c6d62d28368942b7fcf27b47a5809a390c9539259bda4d957b6a21594e68abbb2');
    const result = await fplib.sub(fp1, fp2);
    const expected = parseFp('0x1797a01d3049764626ede214e122ba85a463282493ed3467c6198aab45ff22f45a7e9df646b50c43e13c6b7cd953a5fd');
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
  });

  it('mul()', async () => {
    const fp1 = parseFp('0x1254a406f08c6978ff8235b819d7c2dc2f20a5210d486a3330eb856957a1aa5d07432b90669ebc88888d5cee8d8fce43');
    const fp2 = parseFp('0x033301683e94505ce72df95a03df715a39e4f10db53df4c3ef20850f81f4ec3c8e4dd269d33fb95f47e13f8e54a495ea');
    const result = await fplib.mul(fp1, fp2);
    const expected = parseFp('0x027191460df9d8ff6e5e657a1c4c3ebf2ca4dd706ef8ecd289749fc04ed5e710bbf203be02019f9be35391700a68680f');
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
  });

  it('neg()', async () => {
    const fp1 = parseFp('0x104bf052ad3bc99bcb176c24a06a6c3aad4eaf2308fc4d282e106c84a757d061052630515305e59bdddf8111bfdeb704');
    const result = await fplib.neg(fp1);
    const expected = parseFp('0x09b521978c441cfe80043b91a2e1409cb7289c61ea88c5973920661c4f5925c31985cfad5e4e1a63dc1f7eee4020f3a7');
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
  });

  it('invert()', async () => {
    const fp1 = parseFp('0x135dc396cc7c6cad6aa54253bc83c32c86ef95bb71957b80fe4a153eb6bc11214787d42f3e3b9358ccd7a153b15ea042');
    const result = await fplib.invert(fp1);
    const expected = parseFp('0x07f2e4347edee1da2979af3da154bbda03c261e839b037e9f47392df17742778a20841b53cc59c4c328d4804b6cb4c21');
    assert.equal('0x' + result.b.toString(16).padStart(64, '0'), expected.b);
    assert.equal('0x' + result.a.toString(16).padStart(64, '0'), expected.a);
  });
});

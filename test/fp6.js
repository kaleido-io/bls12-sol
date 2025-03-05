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
  let fp1_c0_a, fp1_c0_b, fp1_c1_a, fp1_c1_b, fp1_c2_a, fp1_c2_b;
  let fp2_c0_a, fp2_c0_b, fp2_c1_a, fp2_c1_b, fp2_c2_a, fp2_c2_b;
  let fp1, fp2;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('TestFp6Lib');
    fp6lib = await b12.waitForDeployment();
    console.log('FpLib deployed to:', JSON.stringify(fp6lib.target, null, 2));

    fp1_c0_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed57c');
    fp1_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed563');
    fp1_c1_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed562');
    fp1_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed561');
    fp1_c2_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed560');
    fp1_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed567');
    fp1 = { c0: { a: fp1_c0_a, b: fp1_c0_b }, c1: { a: fp1_c1_a, b: fp1_c1_b }, c2: { a: fp1_c2_a, b: fp1_c2_b } };

    fp2_c0_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed566');
    fp2_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed565');
    fp2_c1_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed564');
    fp2_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed56b');
    fp2_c2_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed56a');
    fp2_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed569');
    fp2 = { c0: { a: fp2_c0_a, b: fp2_c0_b }, c1: { a: fp2_c1_a, b: fp2_c1_b }, c2: { a: fp2_c2_a, b: fp2_c2_b } };
  });

  it('zero()', async () => {
    const result = await fp6lib.zero();
    assert.equal(result.c0.a.a, 0n);
    assert.equal(result.c0.a.b, 0n);
    assert.equal(result.c0.b.a, 0n);
    assert.equal(result.c0.b.b, 0n);
    assert.equal(result.c1.a.a, 0n);
    assert.equal(result.c1.a.b, 0n);
    assert.equal(result.c1.b.a, 0n);
    assert.equal(result.c1.b.b, 0n);
    assert.equal(result.c2.a.a, 0n);
    assert.equal(result.c2.a.b, 0n);
    assert.equal(result.c2.b.a, 0n);
    assert.equal(result.c2.b.b, 0n);
  });

  it('add()', async () => {
    const result = await fp6lib.add(fp1, fp2);
    const expected_c0_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daae2');
    const expected_c0_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daac8');
    const expected_c1_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daac6');
    const expected_c1_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daacc');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daaca');
    const expected_c2_b = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000001181daad0');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });

  it('sub()', async () => {
    const result = await fp6lib.sub(fp1, fp2);
    const expected_c0_a = parseFp('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016');
    const expected_c0_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    const expected_c1_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa1');
    const expected_c2_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa1');
    const expected_c2_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaa9');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });

  it('mul()', async () => {
    const result = await fp6lib.mul(fp1, fp2);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153fffe877e16fb74df198a');
    const expected_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d96ae5f0654');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffff20be8b7f5e9be1fc');
    const expected_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d99f6b80757');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000007a8cfac17');
    const expected_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9d3f11079e');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });

  it('square()', async () => {
    const result = await fp6lib.square(fp1);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153fffe877e1715b7a71e48');
    const expected_c0_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d947e23b0f6');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffff20be8b9310b1e3e4');
    const expected_c1_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9366060593');
    const expected_c2_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000014ca33ac19');
    const expected_c2_b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000001cbc15d9b0ed5b24c');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });

  it('neg()', async () => {
    const result = await fp6lib.neg(fp1);
    const expected_c0_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d52f');
    const expected_c0_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d548');
    const expected_c1_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d549');
    const expected_c1_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d54a');
    const expected_c2_a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d54b');
    const expected_c2_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffff73f0d544');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });

  it('invert()', async () => {
    const result = await fp6lib.invert(fp1);
    const expected_c0_a = parseFp('0x0f5d3888ce8fb7e81051c8ab459ec57c5cac1cc5bad8d497f5d941f454303adb51e1f13856f01eb3b6e96a349bfd506c');
    const expected_c0_b = parseFp('0x00b5066943316367b6f802b3e2feb164112cf652c56a8fe4395f22843335c3f6db7d125937cfa97b25f59ab0a0ccae5d');
    const expected_c1_a = parseFp('0x1308087806edee690d656f71d22ae367dfc4963d04e46a2853d2e3d80c1b7494544e1cba6032f0db129086d6da4a1d61');
    const expected_c1_b = parseFp('0x18b68ea30cef69b18b39c24d25fff7c55b0ac9f2255e96f66d8aac1249925ad6c5f810e86dacdf69633e1b646ce82c64');
    const expected_c2_a = parseFp('0x07b1fa73b4b5c51f32ea6b76a0fa01e75c758e06983c5f6813890ef66fa9285f69c75be4c28fb6fb742f8f4cb2e91545');
    const expected_c2_b = parseFp('0x07b1fa73b4b5c51f32ea6b76a0fa01e75c758e06983c5f6813890ef66fa9285f69c75be4c28fb6fb742f8f4cb2e91545');
    verify(result, { c0: { a: expected_c0_a, b: expected_c0_b }, c1: { a: expected_c1_a, b: expected_c1_b }, c2: { a: expected_c2_a, b: expected_c2_b } });
  });
});

function verify(result, expected) {
  assert.equal('0x' + result.c0.a.a.toString(16).padStart(64, '0'), expected.c0.a.a);
  assert.equal('0x' + result.c0.a.b.toString(16).padStart(64, '0'), expected.c0.a.b);
  assert.equal('0x' + result.c0.b.a.toString(16).padStart(64, '0'), expected.c0.b.a);
  assert.equal('0x' + result.c0.b.b.toString(16).padStart(64, '0'), expected.c0.b.b);
  assert.equal('0x' + result.c1.a.a.toString(16).padStart(64, '0'), expected.c1.a.a);
  assert.equal('0x' + result.c1.a.b.toString(16).padStart(64, '0'), expected.c1.a.b);
  assert.equal('0x' + result.c1.b.a.toString(16).padStart(64, '0'), expected.c1.b.a);
  assert.equal('0x' + result.c1.b.b.toString(16).padStart(64, '0'), expected.c1.b.b);
  assert.equal('0x' + result.c2.a.a.toString(16).padStart(64, '0'), expected.c2.a.a);
  assert.equal('0x' + result.c2.a.b.toString(16).padStart(64, '0'), expected.c2.a.b);
  assert.equal('0x' + result.c2.b.a.toString(16).padStart(64, '0'), expected.c2.b.a);
  assert.equal('0x' + result.c2.b.b.toString(16).padStart(64, '0'), expected.c2.b.b);
}

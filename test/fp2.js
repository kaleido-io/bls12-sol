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

describe('Fp2 lib', function () {
  let fp2lib;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('TestFp2Lib');
    fp2lib = await b12.waitForDeployment();
    console.log('FpLib deployed to:', JSON.stringify(fp2lib.target, null, 2));
  });

  it('zero()', async () => {
    const result = await fp2lib.zero();
    assert.equal(result.c0.a, 0n);
    assert.equal(result.c0.b, 0n);
    assert.equal(result.c1.a, 0n);
    assert.equal(result.c1.b, 0n);
  });

  it('add()', async () => {
    const fp1a = parseFp('0x08ccecff3ed67578ddeae5439da2b02eab31d18b53078ed5d3f5cadea0c65f27340ae4a11560fd2b96a09231943c6dab');
    const fp1b = parseFp('0x0bd35556170fab6f325e416abe497d9e055d5fb2ff8fddcf6fbb096adcc2b04bfc38f87f1c9644538b4bf7ec8dee1be9');
    const fp2a = parseFp('0x0fc9d8b7e3b626ce947b122db3425e68ae9745b3857ffd05157321b22d5a04c0134579a52cfa8b4f01e3fc00c5962be5');
    const fp2b = parseFp('0x0325f3f2af61549b350ae4025242be1008a618864f9cef0cf179640918b4d31a738fd0966dcadba0b5f86e4c5ffa1da2');
    const fp1 = { c0: fp1a, c1: fp1b };
    const fp2 = { c0: fp2a, c1: fp2b };
    const result = await fp2lib.add(fp1, fp2);
    const expected_a = parseFp('0x1896c5b7228c9c477265f77150e50e9759c9173ed8878bdae968ec90ce2063e747505e46425b887a98848e3259d29990');
    const expected_b = parseFp('0x0ef94948c671000a6769256d108c3bae0e0378394f2cccdc61346d73f57783666fc8c9158a611ff441446638ede8398b');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('sub()', async () => {
    const fp1a = parseFp('0x08ccecff3ed67578ddeae5439da2b02eab31d18b53078ed5d3f5cadea0c65f27340ae4a11560fd2b96a09231943c6dab');
    const fp1b = parseFp('0x0bd35556170fab6f325e416abe497d9e055d5fb2ff8fddcf6fbb096adcc2b04bfc38f87f1c9644538b4bf7ec8dee1be9');
    const fp2a = parseFp('0x0fc9d8b7e3b626ce947b122db3425e68ae9745b3857ffd05157321b22d5a04c0134579a52cfa8b4f01e3fc00c5962be5');
    const fp2b = parseFp('0x0325f3f2af61549b350ae4025242be1008a618864f9cef0cf179640918b4d31a738fd0966dcadba0b5f86e4c5ffa1da2');
    const fp1 = { c0: fp1a, c1: fp1b };
    const fp2 = { c0: fp2a, c1: fp2b };
    const result = await fp2lib.sub(fp1, fp2);
    const expected_a = parseFp('0x1304263194a03544948b7acc2dabfe9d6111d75cc10ca49025b37bcd6a1d508b3f716afa99ba71dc4ebb9630cea5ec71');
    const expected_b = parseFp('0x08ad616367ae56d3fd535d686c06bf8dfcb7472caff2eec27e41a561c40ddd3188a927e8aecb68b2d55389a02df3fe47');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('mul()', async () => {
    const fp1a = parseFp('0x08ccecff3ed67578ddeae5439da2b02eab31d18b53078ed5d3f5cadea0c65f27340ae4a11560fd2b96a09231943c6dab');
    const fp1b = parseFp('0x0bd35556170fab6f325e416abe497d9e055d5fb2ff8fddcf6fbb096adcc2b04bfc38f87f1c9644538b4bf7ec8dee1be9');
    const fp2a = parseFp('0x0fc9d8b7e3b626ce947b122db3425e68ae9745b3857ffd05157321b22d5a04c0134579a52cfa8b4f01e3fc00c5962be5');
    const fp2b = parseFp('0x0325f3f2af61549b350ae4025242be1008a618864f9cef0cf179640918b4d31a738fd0966dcadba0b5f86e4c5ffa1da2');
    const fp1 = { c0: fp1a, c1: fp1b };
    const fp2 = { c0: fp2a, c1: fp2b };
    const result = await fp2lib.mul(fp1, fp2);
    const expected_a = parseFp('0x080690eade1ad5acb2d25bcc90c42586948168be63dff75f16e1ac619556ce0f9677b92dc10d7dc4df06bbf3f0fe3a47');
    const expected_b = parseFp('0x06e7530b168c449a974a86ef04b08f86912666780a57f3ae3477f44f30c19df036ca7635cc60dd923e8c7db21115127e');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('mul() with overflow', async () => {
    const fp1a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed562');
    const fp1b = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000008c0ed561');
    const fp2a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9fefff73f1254c3');
    const fp2b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffee7e24fdeb');
    const fp1 = { c0: fp1a, c1: fp1b };
    const fp2 = { c0: fp2a, c1: fp2b };
    const result = await fp2lib.mul(fp1, fp2);
    const expected_a = parseFp('0x00000000000000000000000000000000000000000000000000000000000000000000000000000004ca03a446b21249f0');
    const expected_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153fff15bf41406c0f63443');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('mul_by_nonresidue()', async () => {
    const fp1a = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffe5d7bdf094e9ab736bdbdb000');
    const fp1b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffe5d7bdedd9b397dbe4ad91759');
    const fp1 = { c0: fp1a, c1: fp1b };
    const result = await fp2lib.mul_by_nonresidue(fp1);
    const expected_a = parseFp('0x0000000000000000000000000000000000000000000000000000000000000000000000000000002bb361397872e498a7');
    const expected_b = parseFp('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffe09a3bde72fd534f508971cae');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('square()', async () => {
    const fp1a = parseFp('0x08ccecff3ed67578ddeae5439da2b02eab31d18b53078ed5d3f5cadea0c65f27340ae4a11560fd2b96a09231943c6dab');
    const fp1b = parseFp('0x0bd35556170fab6f325e416abe497d9e055d5fb2ff8fddcf6fbb096adcc2b04bfc38f87f1c9644538b4bf7ec8dee1be9');
    const fp1 = { c0: fp1a, c1: fp1b };
    const result = await fp2lib.square(fp1);
    const expected_a = parseFp('0x0fc9d8b7e3b626ce947b122db3425e68ae9745b3857ffd05157321b22d5a04c0134579a52cfa8b4f01e3fc00c5962be5');
    const expected_b = parseFp('0x0325f3f2af61549b350ae4025242be1008a618864f9cef0cf179640918b4d31a738fd0966dcadba0b5f86e4c5ffa1da2');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('neg()', async () => {
    const fp1a = parseFp('0x08ccecff3ed67578ddeae5439da2b02eab31d18b53078ed5d3f5cadea0c65f27340ae4a11560fd2b96a09231943c6dab');
    const fp1b = parseFp('0x0bd35556170fab6f325e416abe497d9e055d5fb2ff8fddcf6fbb096adcc2b04bfc38f87f1c9644538b4bf7ec8dee1be9');
    const fp1 = { c0: fp1a, c1: fp1b };
    const result = await fp2lib.neg(fp1);
    const expected_a = parseFp('0x113424eafaa971216d30c272a5a8fca8b94579f9a07d83e9933b07c255ea96fceaa11b5d9bf302d4235e6dce6bc33d00');
    const expected_b = parseFp('0x0e2dbc9422703b2b18bd664b85022f395f19ebd1f3f534eff775c93619ee45d82273077f94bdbbac2eb3081372118ec2');
    verify(result, { c0: expected_a, c1: expected_b });
  });

  it('invert()', async () => {
    const fp1a = parseFp('0x00a4aab3f92a8e29eabd22358787933cd4195e5a337d7db6344484087a18586c7cb77accf6a4e5e337a85d2a62baf070');
    const fp1b = parseFp('0x1776bede1e413ba79349fbe6cc88298b9f184537aef2966b539d7364999eb35707b33c802bede6916fa9f3d1d08a643b');
    const fp1 = { c0: fp1a, c1: fp1b };
    const result = await fp2lib.invert(fp1);
    const expected_a = parseFp('0x066e47b32ff3d468eb1aba35968a2bbdb9d0225cbdc399bb960534036f625a359271825b46349b307298025eea77770c');
    const expected_b = parseFp('0x0dc7224aee9cb5468ad40ee5dccbf0264407602cf426b135e0e0d837a8cf5d9ec73fc9a610ece44f3c738a358aa60150');
    verify(result, { c0: expected_a, c1: expected_b });
  });
});

function verify(result, expected) {
  assert.equal('0x' + result.c0.a.toString(16).padStart(64, '0'), expected.c0.a);
  assert.equal('0x' + result.c0.b.toString(16).padStart(64, '0'), expected.c0.b);
  assert.equal('0x' + result.c1.a.toString(16).padStart(64, '0'), expected.c1.a);
  assert.equal('0x' + result.c1.b.toString(16).padStart(64, '0'), expected.c1.b);
}

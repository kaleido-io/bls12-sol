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
  let verifier;
  this.timeout(60000);

  before(async () => {
    const b12 = await hre.ethers.deployContract('B12');
    const deployment = await b12.waitForDeployment();
    console.log('B12 deployed to:', JSON.stringify(deployment.target, null, 2));

    const TestVerifier = await hre.ethers.getContractFactory('TestVerifier', {
      libraries: {
        B12: deployment.target,
      },
    });
    verifier = await TestVerifier.deploy();
    console.log('TestVerifier deployed to:', verifier.target);
  });

  it('pairing()', async () => {
    console.log('calling init()');
    await verifier.init();
    console.log('calling pairing()');
    const pairing = await verifier.pairing.call();
    console.log(pairing);
  });
});

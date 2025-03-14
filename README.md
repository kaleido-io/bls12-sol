# Solidity verifier of groth16 proofs using BLS12_381

This project demonstrates a basic implementation of a Solidity based verifier of groth16 proofs that uses the BLS12_381 curve for pairing.

The implementation is based on these projects:

- https://github.com/mikelodder7/bls12_381_plus
- https://github.com/paulmillr/noble-curves

## Test

```shell
npm i
npm test
```

### Status

There's a solidity based implementation of the `pairing` operation, with miller_loop and final_exponentiation, which is super expensive. It takes setting the block gas limit to `2,000,000,000,000` to complete. So the test `pairingGenerators` can only be tested against the local hardhat network.

To try this, remove the `skip` from the test and run:

```console
npx hardhat test
```

A much better way to perform pairing is by using the new precompile in the Pectra hardfork. It requires using Holesky as the target network, which is the only network where the Pectra fork has been completed.

```console
npx hardhat test --network holesky
```

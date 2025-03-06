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

The miller_loop() implementation currently can not complete and seems to crash the VM. To see it running remove the `skip` from the test `pairingGenerators`. It will cause a revert after ~33 iterations.

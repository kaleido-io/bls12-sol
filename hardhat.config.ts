import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "prague",
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    },
  },
  networks: {
    mekong: {
      url: "http://localhost:8545",
      accounts: [
        "edf0f2922e84fdb90ee4b6e0f7c136c2843025d65f44e24402194a418a81a796",
      ],
    },
    hardhat: {
      gas: 12000000000,
      blockGasLimit: 12000000000,
    },
    local: {
      url: "http://localhost:8545",
      accounts: [
        "edf0f2922e84fdb90ee4b6e0f7c136c2843025d65f44e24402194a418a81a796",
      ],
      gas: 12000000000,
      gasPrice: 0,
    },
  },
};

export default config;

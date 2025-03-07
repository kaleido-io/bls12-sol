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
    hardhat: {
      blockGasLimit: 2000000000000,
    },
  },
};

export default config;

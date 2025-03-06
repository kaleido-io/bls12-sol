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
        "xxxx",
      ],
    },
    hardhat: {
      gas: 12000000000,
      blockGasLimit: 12000000000,
    },
    local: {
      url: "http://localhost:8545",
      gas: 12000000000,
      gasPrice: 0,
    },
  },
};

export default config;

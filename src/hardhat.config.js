require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const privateKey =  "561edf0f8f845e7664b801acb037eb6a823e45122a7bb6b67182c101ee5ca11d"
const api_key = "XC18M4KYBNPKJBD3X1JSKHDZGQN98VUQBX"

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: api_key
  },
};

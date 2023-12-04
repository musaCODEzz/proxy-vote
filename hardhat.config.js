require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "mumbai",
  networks: {
     hardhat: {},
     mumbai: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/BgTumac_F7FRiANuA6OX2Q3Bb1hauSWG",
        accounts: [`0x${process.env.PRIVATE_KEY}`],
        

      }
  },
};

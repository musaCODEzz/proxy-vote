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
        url:process.env.API_URL,
        accounts: [`0x${process.env.PRIVATE_KEY}`],
        

      }
  },
};

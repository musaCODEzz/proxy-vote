require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "sepolia",
  networks: {
     hardhat: {},
     sepolia: {
        url:process.env.API_URL,
        accounts: [`0x${process.env.PRIVATE_KEY}`],
        chainId: 11155111,
        
        
        

      }
  },
  etherscan: {
    apiKey: {
      sepolia:process.env.ETHERSCAN_API_KEY
    }
  },
  customChains: [
    {
      network:"sepolia",
      chainId:11155111,
      urls:{
        apiURL:"​https://api-sepolia.etherscan.io/api",
        browswerURL:"https://sepolia.etherscan.io"
      }
    }
  ]
};

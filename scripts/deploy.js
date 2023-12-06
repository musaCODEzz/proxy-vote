// Define a global variable to store the candidate names
const candidateNames = ["Mark", "Mike", "Henry", "Rock"];

// Export the candidateNames for accessibility in other files
module.exports = {
  candidateNames: candidateNames
};

const { ethers, run, network } = require("hardhat");

async function main() {
  const durationInMinutes = 10;

  const Voting = await ethers.getContractFactory("Voting");
  const Voting_ = await Voting.deploy(candidateNames, durationInMinutes);

  await Voting_.deployed();

  console.log("Voting deployed to:", Voting_.address);
  console.log(network.config);

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await Voting_.deployTransaction.wait(6);
    await verify(Voting_.address, candidateNames, durationInMinutes);
  }
}

const verify = async (contractAddress, candidateNames, durationInMinutes) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [candidateNames, durationInMinutes],
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

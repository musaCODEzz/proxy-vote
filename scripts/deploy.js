
const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const Voting_ = await Voting.deploy(["Mark", "Mike", "Henry", "Rock"], 10);

  await Voting_.deployed();

  console.log("Voting deployed to:", Voting_.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

const { ethers } = require("hardhat");

const main = async () => {
  const contractFactory = await ethers.getContractFactory("TaskContract");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log("Contract Deployed to: ", contract.address);
};

// run the main function
const runMain = async () => {
  try {
    await main();
    process.exit(0); // success
  } catch (error) {
    console.log(error);
    process.exit(1); // failure
  }
};

runMain();

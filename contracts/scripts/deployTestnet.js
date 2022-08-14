// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  let vrfCoordinator;
  let keyHash;
  let linkToken;
  let subscriptionId;

  vrfCoordinator = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
  linkToken= "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
  subscriptionId = 1363;

  // We get the contract to deploy
  const FivePolygons = await hre.ethers.getContractFactory("FivePolygons");
  const fivePolygons = await FivePolygons.deploy(vrfCoordinator, keyHash, subscriptionId);

  await fivePolygons.deployed();

  console.log("FivePolygons deployed to "+network, fivePolygons.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

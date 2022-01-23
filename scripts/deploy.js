// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

    const Adoption = await hre.ethers.getContractFactory("Adoption");
    const adoption = await Adoption.deploy();

    await adoption.deployed();

    console.log("Adoption deployed to:", adoption.address);
    saveFrontendFiles(adoption)
}

function saveFrontendFiles(adoption) {
    const fs = require("fs")
    const contractsDir = __dirname + "/../frontend/src/contracts"

    if(!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify({ Adoption: adoption.address }, undefined, 2)
    )
    
    const AdoptionArtifact = artifacts.readArtifactSync("Adoption")

    fs.writeFileSync(
        contractsDir + "/Adoption.json",
        JSON.stringify(AdoptionArtifact, null, 2)
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

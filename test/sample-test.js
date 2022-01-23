const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Adoption", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Adoption = await ethers.getContractFactory("Adoption");
    const adoption = await Adoption.deploy();
    await adoption.deployed();

    const [owner] = await ethers.getSigners();


    expect((await adoption.adopt(3)).value).to.equal(0);

    expect(await adoption.adopters(3)).to.equal(owner.address);
  });
});

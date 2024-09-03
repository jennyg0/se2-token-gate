import { expect } from "chai";
import { ethers } from "hardhat";
import { TokenGateContract, GateToken } from "../typechain-types";

describe("TokenGateContract", function () {
  let gateToken: GateToken;
  let tokenGate: TokenGateContract;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy the GateToken contract
    const GateToken = await ethers.getContractFactory("GateToken");
    gateToken = (await GateToken.deploy("GateToken", "GTKN", ethers.parseUnits("10000", 18))) as GateToken & {
      address: string;
    };
    await gateToken.waitForDeployment();

    // Deploy the TokenGateContract contract
    const TokenGate = await ethers.getContractFactory("TokenGateContract");
    tokenGate = await TokenGate.deploy(gateToken.getAddress(), ethers.parseUnits("10", 18));
    await tokenGate.waitForDeployment();
  });

  it("Should initialize with correct values", async function () {
    const gateTokenAddress = await gateToken.getAddress();
    expect(await tokenGate.token()).to.equal(gateTokenAddress);

    expect(await tokenGate.requiredBalance()).to.equal(ethers.parseUnits("10", 18));
  });

  it("Should grant access to users with sufficient token balance", async function () {
    await gateToken.transfer(addr1.address, ethers.parseUnits("15", 18));
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(true);
  });

  it("Should revoke access from users with insufficient token balance", async function () {
    await gateToken.transfer(addr1.address, ethers.parseUnits("5", 18));
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(false);
  });

  it("Should correctly identify users with access based on token balance", async function () {
    await gateToken.transfer(addr1.address, ethers.parseUnits("10", 18));
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(true);

    await gateToken.transfer(addr1.address, ethers.parseUnits("1", 18)); // addr1 now has 11 tokens
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(true);

    await gateToken.connect(addr1).transfer(owner.address, ethers.parseUnits("5", 18)); // addr1 now has 6 tokens
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(false);
  });

  it("Denies access to users with zero balance", async function () {
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(false);
  });

  it("Grants access to users with exactly the required balance", async function () {
    await gateToken.transfer(addr1.address, ethers.parseUnits("10", 18));
    expect(await tokenGate.hasAccess(addr1.address)).to.equal(true);
  });

  it("Owner can update required balance", async function () {
    await tokenGate.updateRequiredBalance(ethers.parseUnits("20", 18));
    expect(await tokenGate.requiredBalance()).to.equal(ethers.parseUnits("20", 18));
  });

  it("Non-owner cannot update required balance", async function () {
    await expect(tokenGate.connect(addr1).updateRequiredBalance(ethers.parseUnits("20", 18))).to.be.revertedWith(
      "Ownable: caller is not the owner",
    );
  });

  it("Owner can mint tokens", async function () {
    const mintAmount = ethers.parseUnits("1000", 18);
    await gateToken.mint(owner.address, mintAmount);
    expect(await gateToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("11000", 18));
  });

  it("Non-owner cannot mint tokens", async function () {
    await expect(gateToken.connect(addr1).mint(addr1.address, ethers.parseUnits("1000", 18))).to.be.revertedWith(
      "Ownable: caller is not the owner",
    );
  });

  it("Users can transfer tokens", async function () {
    await gateToken.transfer(addr1.address, ethers.parseUnits("100", 18));
    expect(await gateToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));

    await gateToken.connect(addr1).transfer(owner.address, ethers.parseUnits("50", 18));
    expect(await gateToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("9950", 18));
    expect(await gateToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("50", 18));
  });
});

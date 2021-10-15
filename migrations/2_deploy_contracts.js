// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
// const SimpleCounter = artifacts.require("SimpleCounter");
const VaccinePassport = artifacts.require("VaccinePassport");

module.exports = async function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
  // deployer.deploy(SimpleCounter);
  await deployer.deploy(VaccinePassport);
  const contract = await VaccinePassport.deployed();

  console.log("Contract address: ", contract.address);
};

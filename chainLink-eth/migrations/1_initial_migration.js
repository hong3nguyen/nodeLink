const LinkToken = artifacts.require("LinkToken");
const MockOracle = artifacts.require("MockOracle");
const getAddressTemplate = artifacts.require("getAddressTemplateTesting");
const getBool = artifacts.require("getBoolTemplate");
const getDemo3 = artifacts.require("SimpleChainlink");
// const MockOracle = artifacts.require("MockOracle");
const getAddress2 = artifacts.require("getAddressTemplate2"); 
const APIconsumer = artifacts.require("APIConsumer");
const getAddressOrigin = artifacts.require("getAddressTemplateOrigin");
module.exports = async function (deployer) {
  // Deploy the MockLINK contract with an initial supply of 1,000 LINK tokens
  // Note: Solidity uses the lowest token denomination, so to create 1,000 LINK
  // with 18 decimals, you need to add 18 zeros to the end of 1,000.
  // await deployer.deploy(MockLINK, "10000000",  { gas: 6721975 });
  //  await deployer.deploy(MockLINK, "1000000000000000000000",  { gas: 6721975 });
  // await deployer.deploy(getAddressTemplate, { gas: 6721975 });
 // await deployer.deploy(MockOracle, { gas: 6721975 });
 // await deployer.deploy(LinkToken);
 // await deployer.deploy(MockOracle, "0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96"); // add link token address contract here
 
  //await deployer.deploy(LinkToken);
  //await deployer.deploy(MockOracle, "0x3f5CBA916576A6Ce277dA066fD210D895a595F71"); // add link token address contract here
 
 deployer.deploy(getAddressOrigin);
};
const MockLINK = artifacts.require("LinkToken");
const getAddressTemplate = artifacts.require("WeatherContract");
const getBool = artifacts.require("getBoolTemplate");
const getDemo3 = artifacts.require("SimpleChainlink");
const MockOracle = artifacts.require("MockOracle");
const getAddress2 = artifacts.require("getAddressTemplate2"); 
module.exports = async function (deployer) {
  // Deploy the MockLINK contract with an initial supply of 1,000 LINK tokens
  // Note: Solidity uses the lowest token denomination, so to create 1,000 LINK
  // with 18 decimals, you need to add 18 zeros to the end of 1,000.
  // await deployer.deploy(MockLINK, "10000000",  { gas: 6721975 });
  //  await deployer.deploy(MockLINK, "1000000000000000000000",  { gas: 6721975 });
  // await deployer.deploy(getAddressTemplate, { gas: 6721975 });
 // await deployer.deploy(MockOracle, { gas: 6721975 });
  await deployer.deploy(getAddress2);
};



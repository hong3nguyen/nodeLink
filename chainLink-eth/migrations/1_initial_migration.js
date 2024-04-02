const MockLINK = artifacts.require("MockLINK");
const getAddressTemplate = artifacts.require("WeatherContract");
const getBool = artifacts.require("getBoolTemplate");
const getDemo3 = artifacts.require("SimpleChainlink");

module.exports = async function (deployer) {
  // Deploy the MockLINK contract with an initial supply of 1,000 LINK tokens
  // Note: Solidity uses the lowest token denomination, so to create 1,000 LINK
  // with 18 decimals, you need to add 18 zeros to the end of 1,000.
  // await deployer.deploy(MockLINK, "10000000",  { gas: 6721975 });
  //await deployer.deploy(MockLINK, "1000000000000000000000",  { gas: 6721975 });
  // await deployer.deploy(getAddressTemplate, { gas: 6721975 });
  //await deployer.deploy(getBool, { gas: 6721975 });
  await deployer.deploy(getDemo3, { gas: 6721975 });
};



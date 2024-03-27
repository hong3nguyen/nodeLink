const MockLINK = artifacts.require("MockLINK");

module.exports = function (deployer) {
  // Deploy the MockLINK contract with an initial supply of 1,000 LINK tokens
  // Note: Solidity uses the lowest token denomination, so to create 1,000 LINK
  // with 18 decimals, you need to add 18 zeros to the end of 1,000.
  deployer.deploy(MockLINK, "1000000000000000000000");
};

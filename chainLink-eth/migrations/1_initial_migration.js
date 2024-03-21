const getAddressTemplate = artifacts.require("getAddressTemplate");

module.exports = async (deployer) => {
  await deployer.deploy(getAddressTemplate, { gas: 5000000 });
};
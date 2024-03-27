const getAddressTemplate = artifacts.require("WeatherContract");

module.exports = async (deployer) => {
  await deployer.deploy(getAddressTemplate);
};
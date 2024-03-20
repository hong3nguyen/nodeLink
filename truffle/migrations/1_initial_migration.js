var Migrations = artifacts.require("HelloWorld");
// var Hello = artifacts.require("Hello");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
//   deployer.deploy(Hello);
};

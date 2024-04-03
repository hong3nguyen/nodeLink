const SimpleChainlink = artifacts.require("SimpleChainlink");

module.exports = async function(callback) {
  try {
    // Get the deployed contract
    const simpleChainlink = await SimpleChainlink.deployed();

    // Call the requestVolumeData function
    const tx = await simpleChainlink.requestVolumeData();

    console.log("Transaction sent! Waiting for it to be mined...");
    await tx.wait();
    console.log("Transaction mined!");

    // Get the volume data
    const volume = await simpleChainlink.volume();
    console.log("24-hour trading volume for ETH: ", volume.toString());

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
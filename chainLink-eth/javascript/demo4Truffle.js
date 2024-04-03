
const fs = require('fs');

const SimpleChainlink = artifacts.require('SimpleChainlink');
// const LinkToken = artifacts.require('LinkToken');
// const OracleContract = artifacts.require('MockOracle');


// // Get the contract ABI
// const abi = JSON.parse(fs.readFileSync('./build/contracts/SimpleChainlink.json', 'utf8')).abi;
// // Get the contract address
// const contractAddress = '0xe73ea4Bf769e735Ee06f4c8097eA3f1667c97613';
// // Create a new contract instance
// const simpleChainlink = new web3.eth.Contract(abi, contractAddress);

// Get the contract ABI
const abi2 = JSON.parse(fs.readFileSync('../build/contracts/LinkToken.json', 'utf8')).abi;
// Get the contract address
const contractAddress2 = '0x3f5CBA916576A6Ce277dA066fD210D895a595F71';
// Create a new contract instance
const  linkToken = new web3.eth.Contract(abi2, contractAddress2);

// Get the contract ABI
const abi3 = JSON.parse(fs.readFileSync('../build/contracts/MockOracle.json', 'utf8')).abi;
// Get the contract address
const contractAddress3 = '0x88e384AcF40052Ab9A59a1752560c295151e2240';
// Create a new contract instance
const oracleContract = new web3.eth.Contract(abi3, contractAddress3);

const provider = "0x1B792475319E97186F676Bea61280388C0A12E7a";

it('should make a data request', async () => {
  this.timeout(5000000);
//   linkToken =  LinkToken.deployed();
    simpleChainlink =  await SimpleChainlink.deployed();
//   oracleContract =  OracleContract.deployed(); // Replace OracleContract with your actual oracle contract

    // Transfer 1 LINK to the SimpleChainlink contract
     linkToken.methods.mint(simpleChainlink.address, web3.utils.toWei('1000000000000000000000', 'ether'));

    // Check if the contract is authorized by the oracle
//   const isAuthorized =  oracleContract.isAuthorizedSender(simpleChainlink.address);
//   assert(isAuthorized);
//   done();
});
async function makeDataRequest() {
  console.log('Provider address:', provider);
  console.log('SimpleChainlink address:', simpleChainlink.address);

  const balance = await linkToken.methods.balanceOf(simpleChainlink.address).call();
  console.log('LINK balance:', balance);  
}

makeDataRequest();

it('should make a data request', async () => {
  console.log('Provider address:', provider);
  console.log('SimpleChainlink address:', simpleChainlink.address);

  const balance = await linkToken.methods.balanceOf(simpleChainlink.address).call();
  console.log('LINK balance:', balance);  
  
  // Make a data request
  const tx = await simpleChainlink.requestVolumeData({ from: provider });
  console.log('Gas used:', tx.receipt.gasUsed);
  // Get the request ID from the transaction receipt
  const requestId = tx.logs[0].args._requestId;

  // Wait for the Chainlink node to fulfill the request
  // This would normally be done automatically by the Chainlink node, but for testing purposes we can do it manually
  // Replace '12345' with the actual volume data
  await simpleChainlink.fulfill(requestId, '12345', { from: provider });

  // Check the volume data
  const volume = await simpleChainlink.volume();
  assert.equal(volume.toString(), '12345');
});
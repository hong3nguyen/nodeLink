// const Web3 = require('web3');
const fs = require('fs');

// Connect to the Ethereum network
const { Web3 } = require('web3');
const web3 = new Web3("ws://192.168.3.66:8546");
//  const provider = new WebsocketProvider("ws://192.168.3.66:8546")

web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log(e));

// Get the contract ABI
const abi = JSON.parse(fs.readFileSync('../build/contracts/SimpleChainlink.json', 'utf8')).abi;
// Get the contract address
const contractAddress = '0xFc9B62D16F5f56E7e32046411a9e1C90bef65831';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Get the account address
const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';

// get the LINK token contract ABI
const linkAbi = JSON.parse(fs.readFileSync('../build/contracts/LinkToken.json', 'utf8')).abi;
const linkAddress = "0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96"
let linkTokenContract = new web3.eth.Contract(linkAbi, linkAddress);

console.log('Contract address:', contract.address);
console.log('From account:', accountAddress);
console.log('from link address:', linkTokenContract.address);

linkTokenContract.methods.transfer(contractAddress, web3.utils.toWei('1000000', 'ether')).send({ from: accountAddress }).then( () => {
  
  let contractbalance =  linkTokenContract.methods.balanceOf(contractAddress).call()
  .then(contractbalance => {
    console.log("LINK contract balance is: ", web3.utils.fromWei(contractbalance, 'ether'));
  })
  .catch(console.error);
});

// Call the requestVolumeData function
contract.methods.requestVolumeData().send({ from: accountAddress })
  .then(receipt => {
    console.log(receipt);
  })
  .catch(error => {
    console.error(error);
  });




// web3.eth.getAccounts().then(accounts => {
//   // Ensure accounts are loaded and you have an account to use
//   const fromAccount = accountAddress; // Use the first account found, or a predefined one
  
//   console.log("does it work")

//   contract.methods.requestVolumeData().send({ from: fromAccount })
//     .then(receipt => console.log('Receipt:', receipt))
//     .catch(error => {
//   console.error('An error occurred:', error);
// });
// });
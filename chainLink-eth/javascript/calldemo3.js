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
const contractAddress = '0xD0353575b1c759eb0700b081bB594A6A32296915';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

web3.eth.defaultAccount = '0x1B792475319E97186F676Bea61280388C0A12E7a';

// Call the requestVolumeData function
contract.methods.requestVolumeData().send({ from: web3.eth.defaultAccount })
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
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
const abi = JSON.parse(fs.readFileSync('../build/contracts/getBoolTemplate.json', 'utf8')).abi;

// Get the contract address
const contractAddress = '0x03b7c7CC00e76874d445490cfe63B64b79eFb961';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';

web3.eth.getAccounts().then(accounts => {
  // Ensure accounts are loaded and you have an account to use
  const fromAccount = accountAddress; // Use the first account found, or a predefined one
  
  console.log("does it work")

  contract.methods.requestBool().send({ from: fromAccount })
    .then(receipt => console.log('Receipt:', receipt))
    .catch(error => {
  console.error('An error occurred:', error);
});
});
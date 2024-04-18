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
const abi = JSON.parse(fs.readFileSync('../build/contracts/getAddressTemplateTesting.json', 'utf8')).abi;
// Get the contract addressas
const contractAddress = '0x41138ec56F5661B50B12E1B4AB7E0e75717a14dd';
// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';

// Call the RequestAddress function
contract.methods.RequestAddress().send({ from: accountAddress })
  .then(receipt => {
    console.log('Transaction receipt:', receipt);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
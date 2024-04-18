const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');


// Connect to the Ethereum network
const web3 = new Web3("ws://192.168.3.66:8546");
//  const provider = new WebsocketProvider("ws://192.168.3.66:8546")

web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log(e));
// Load the contract ABI
const abi = JSON.parse(fs.readFileSync('../build/contracts/APIConsumer.json', 'utf-8')).abi;

// Contract address
const contractAddress = '0xfc1F6CB5f6bdDb3113ba38Ff041923D506De5524';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Account from which to call the contract function
const account = '0x1B792475319E97186F676Bea61280388C0A12E7a';

// Call the requestVolumeData function
contract.methods.requestVolumeData().send({ from: account })
  .then(receipt => {
    console.log('Transaction receipt:', receipt);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
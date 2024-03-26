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
const abi = JSON.parse(fs.readFileSync('../build/contracts/getAddressTemplate.json', 'utf8')).abi;

// Get the contract address
const contractAddress = '0xA253e5A8E365f12C5dFF86b9F3e948e11d42f3B1';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Call the RequestAddress function
contract.methods.RequestAddress().send({ from: '0x1b792475319e97186f676bea61280388c0a12e7a' })
  .on('receipt', console.log)
  .on('error', console.error);
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
const abi = JSON.parse(fs.readFileSync('../build/contracts/getAddressTemplate2.json', 'utf8')).abi;
// Get the contract address
const contractAddress = '0x321AF15c41E0cD96bff8F958B4D3D8107b89B533';
// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';

console.log('Contract address:', contractAddress);
console.log('From account:', accountAddress );

// Call the requestVolumeData function
contract.methods.RequestAddress().send({ from: contractAddress })
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
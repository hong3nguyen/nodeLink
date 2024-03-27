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
const abi = JSON.parse(fs.readFileSync('../build/contracts/WeatherContract.json', 'utf8')).abi;

// Get the contract address
const contractAddress = '0x1a0203989423c56712A6DcC6E0c1cBecfd839602';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

// Call the RequestAddress function
// contract.methods.RequestAddress().send({ from: '0xa34ce306b31f810afc0d00bdd4cc8051b6da0acf' })
//   .on('receipt', console.log)
//   .on('error', console.error);
const accountAddress = '0x26fd5013A99bA26505C03D47D0D61Cc66062f071';

const linkAbi = JSON.parse(fs.readFileSync('../build/contracts/MockLINK.json', 'utf8')).abi;
const linkAddress = "0xB6eFca1fcDDbb3E1950d1AaC422f9CC913Cc602e"
//const accountAddress2 = '0xa34ce306b31f810afc0d00bdd4cc8051b6da0acf';
console.log("does it work2")
let linkTokenContract = new web3.eth.Contract(linkAbi, linkAddress);
let balance =  linkTokenContract.methods.balanceOf(accountAddress).call()
.then(balance => {
    console.log("LINK balance is: ", web3.utils.fromWei(balance, 'ether'));
})
.catch(console.error);
//console.log("LINK balance is: ", web3.utils.fromWei(balance, 'ether'));

const city = "London"; // Example parameter, adjust based on your contract

// Call the function. Adjust if your function requires parameters.
// web3.eth.getAccounts().then(accounts => {
//     // Ensure accounts are loaded and you have an account to use
//     const fromAccount = accounts[0] || accountAddress; // Use the first account found, or a predefined one
//   console.log("does it work")
//     contract.methods.requestTemperatureData(city).send({ from: fromAccount })
//       .on('transactionHash', hash => console.log('Tx Hash:', hash))
//       .on('receipt', receipt => console.log('Receipt:', receipt))
//       .on('error', console.error);
// });
web3.eth.getAccounts().then(accounts => {
  // Ensure accounts are loaded and you have an account to use
  const fromAccount = accountAddress; // Use the first account found, or a predefined one
  console.log("does it work")

  contract.methods.requestTemperatureData(city).estimateGas({ from: fromAccount })
    .then(gasAmount => {
      console.log('Estimated gas amount:', gasAmount);
      return contract.methods.requestTemperatureData(city).send({ from: fromAccount, gas: gasAmount });
    })
    .then(receipt => console.log('Receipt:', receipt))
    .catch(console.error);
});
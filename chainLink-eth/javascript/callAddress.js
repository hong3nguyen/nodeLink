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
const contractAddress = '0xed306eeE724202EF30d88a04918f794EA36272c4';

// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';

const city = "London"; // Example parameter, adjust based on your contract

web3.eth.getAccounts().then(accounts => {
  // Ensure accounts are loaded and you have an account to use
  const fromAccount = accountAddress; // Use the first account found, or a predefined one
  
  console.log("does it work")

  contract.methods.requestTemperatureData(city,  { gas: 6721975 }).estimateGas({ from: fromAccount })
    .then(gasAmount => {
      console.log('Estimated gas amount:', gasAmount);
      return contract.methods.requestTemperatureData(city).send({ from: fromAccount, gas: gasAmount });
    })
    .then(receipt => console.log('Receipt:', receipt))
    .catch(console.error);
}).catch(error => {
  console.error('An error occurred:', error);
});
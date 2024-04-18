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
const abi = JSON.parse(fs.readFileSync('../build/contracts/getAddressTemplateOrigin.json', 'utf8')).abi;
// Get the contract addressas
const contractAddress = '0xea9440d78Ff867eca904242d6b874fd5a5F78588';
// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);


contract.getPastEvents('Log', {
    fromBlock: 0,
    toBlock: 'latest'
}, (error, events) => { console.log(events); })
.catch((err) => console.error(err));
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
const contractAddress = '0xD0353575b1c759eb0700b081bB594A6A32296915';
// Create a new contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const accountAddress = '0x1B792475319E97186F676Bea61280388C0A12E7a';


// Call the RequestAddress function
// contract.methods.RequestAddress().send({ from: accountAddress })
//   .then(receipt => {
//     console.log('Transaction receipt:', receipt);
//   })
//   .catch(error => {
//     console.error('An error occurred:', error);
//   });


//   contract.methods.requestVolumeData().send({ from: accountAddress })
//   .then(receipt => {

//     console.log('Transaction receipt:', receipt);

//     contract.events.DataFullfilled()
//     .on('data', (event) => {
//         console.log('DataFullfilled event received:', event.returnValues);
//     })
//     .on('error', console.error);

//   })
//   .catch(error => {
//     console.error('An error occurred:', error);
//   });

// contract.methods.requestVolumeData().send({ from: accountAddress })
// .then(receipt => {
//     console.log('Transaction receipt:', receipt);

//     const event = receipt.events.DataFullfilled;
//     if (event) {
//         console.log('DataFullfilled event:', event.returnValues);
//     } else {
//         console.log('No DataFullfilled event found');
//     }
// })
// .catch(error => {
//     console.error('An error occurred:', error);
// });

contract.methods.test().call()
.then(result => {
    console.log("Test value is: ", result);
})
.catch(error => {
    console.error('An error occurred:', error);
});
// Listen for the DataFullfilled event
contract.events.DataFullfilled()
.on('data', (event) => {
    console.log('DataFullfilled event received:', event.returnValues);

    // Assert
    if (event) {
        console.log('Event is not null');
    } else {
        console.error('Event is null');
    }

    contract.methods.getVolume().call({ from: accountAddress })
    .then(volume => {
        console.log("Volume is: ", volume);

        if (typeof volume === 'number') {
            console.log('Volume is a number');
        } else {
            console.error('Volume is not a number');
        }

        if (volume > 0) {
            console.log('Volume is greater than 0');
        } else {
            console.error('Volume is not greater than 0');
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
})
// .on('error', console.error);
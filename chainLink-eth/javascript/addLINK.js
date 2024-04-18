// const Web3 = require('web3');
const fs = require('fs');

// Connect to the Ethereum network
const { Web3 } = require('web3');
const web3 = new Web3("ws://192.168.3.66:8546");
//  const provider = new WebsocketProvider("ws://192.168.3.66:8546")

web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log(e));

// Get the account address receive
const accountAddress = '0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96';

// Get the contract address
const linkAbi = JSON.parse(fs.readFileSync('../build/contracts/LinkToken.json', 'utf8')).abi;
const linkAddress = "0x3f5CBA916576A6Ce277dA066fD210D895a595F71"
let linkTokenContract = new web3.eth.Contract(linkAbi, linkAddress);

// account gives the LINK token 
const fromAccount = "0x1B792475319E97186F676Bea61280388C0A12E7a"

linkTokenContract.methods.transfer(accountAddress, web3.utils.toWei('1000000', 'ether')).send({ from: fromAccount }).then( () => {
  
  let balance =  linkTokenContract.methods.balanceOf(accountAddress).call()
  .then(balance => {
    console.log("LINK balance is: ", web3.utils.fromWei(balance, 'ether'));
  })
.catch(console.error);

  let balanceFrom =  linkTokenContract.methods.balanceOf(fromAccount).call()
  .then(balanceFrom => {
    console.log("LINK from Account balance is: ", web3.utils.fromWei(balanceFrom, 'ether'));
  })
  .catch(console.error);
});

let gasPrice = '20000'; // 20 Gwei. Adjust this value as needed.

web3.eth.sendTransaction({
  from: fromAccount,
  to: accountAddress,
  value: web3.utils.toWei('1', 'ether'),
  gasPrice: gasPrice
})
.then(receipt => {
  console.log(receipt);
})
.catch(console.error);
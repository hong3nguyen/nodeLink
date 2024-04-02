// const Web3 = require('web3');
const fs = require('fs');

// Connect to the Ethereum network
const { Web3 } = require('web3');
const web3 = new Web3("ws://192.168.3.66:8546");
//  const provider = new WebsocketProvider("ws://192.168.3.66:8546")

web3.eth.net.isListening()
    .then(() => console.log('is connected'))
    .catch(e => console.log(e));

// Get the contract address
const accountAddress = '0xe15e23a8ba28745623382a54b999145C49E70bF9';

const linkAbi = JSON.parse(fs.readFileSync('../build/contracts/MockLINK.json', 'utf8')).abi;
const linkAddress = "0x0E3c944F32BCc729D292F8F0F552145332011104"

let linkTokenContract = new web3.eth.Contract(linkAbi, linkAddress);

const fromAccount = "0x1B792475319E97186F676Bea61280388C0A12E7a"

linkTokenContract.methods.mint(accountAddress, web3.utils.toWei('100000', 'ether')).send({ from: fromAccount }).then( () => {
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
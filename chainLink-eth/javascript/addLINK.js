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
const accountAddress = '0x321AF15c41E0cD96bff8F958B4D3D8107b89B533';

const linkAbi = JSON.parse(fs.readFileSync('../build/contracts/LinkToken.json', 'utf8')).abi;
const linkAddress = "0x3f5CBA916576A6Ce277dA066fD210D895a595F71"
let linkTokenContract = new web3.eth.Contract(linkAbi, linkAddress);

const fromAccount = "0x1B792475319E97186F676Bea61280388C0A12E7a"

linkTokenContract.methods.mint(accountAddress, web3.utils.toWei('1000000000000000000000', 'ether')).send({ from: fromAccount }).then( () => {
  
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
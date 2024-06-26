# Ethereum - Link

## env
> sudo mount -t vboxsf -o uid=1000,gid=1000 ethereum Public

# Ethereum - PoW version

## reset geth old data
> ./geth_run/geth removedb; rm -rf geth

## initial folder
> ./geth_run/geth --datadir . init genesis.json

## execute Ethereum or Ethereum client from Link view
> IP=$(ip -4 addr show enp0s3 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
> 
> ./geth_run/geth --identity "node00" --http --http.addr $IP --http.port "8000" --http.corsdomain "*" --datadir . --port "30303" --nodiscover --http.api "eth,debug,net,web3,personal,miner,admin" --ws --ws.addr $IP --ws.port 8546 --networkid 2024 --nat "any" --allow-insecure-unlock  --rpc.gascap "99999999999999999" --ipcpath=~/Pictures/

## console to each node
> ./geth_run/geth attach http://$IP:8000

### Create a new account
> personal.newAccount()

### take information from a peer
> admin.nodeInfo.enode

##  send a transaction between two accounts

> eth.sendTransaction({from: eth.acconts[0], to: eth.accounts[1], value: web3.toWei(1, "ether")})
### Set balance to account recive the money for all nodes
> miner.setEtherbase(eth.accounts[0])

### Unlock account in the first node
> web3.personal.unlockAccount(web3.personal.listAccounts[0],"",15000);

## add a computer to the network [add Peer to netwokr](https://ethereum.stackexchange.com/questions/43045/how-to-connect-another-node-to-my-own-private-network)

By another computer, I'm assuming you mean a separate machine within your the same LAN? Did you assign it a unique IP or is just on a subnet?

Either way, try 
> admin.addPeer("enode://address@ip:port") in console

## Start a miner

### Set balance to account recevie the money for all nodes
``` bash
miner.setEtherbase(eth.accounts[0])


web3.personal.unlockAccount(web3.personal.listAccounts[0],"",15000);

eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(1, "ether")})

```
### Start stop mining with

> miner.start()

> miner.stop()


### Truffle for smart contract 
#### [install nodejs](https://ostechnix.com/install-node-js-linux/) vs truffle
``` bash
nvm install 12.20.2
 
nvm use 12.20.2

npm install -g truffle

mkdir truffle

cd truffle 

truffle init

```

/truffle/contract/hello.sol
``` solidity
pragma solidity >=0.4.22 <0.9.0;
contract Hello {
  string public message;
  constructor() {
    message = "Hello, World : This is a Solidity Smart Contract on the Private Ethereum Blockchain ";
    }
}
```
/truffle/migration/1_initial_migration.js
``` js
var Migrations = artifacts.require("Migrations");
var Hello = artifacts.require("test");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Hello);
};
```
> npm install --no-bin-links

Current problem with solidity version 0.8.20 so we need to move the compile to be 0.8.19
# LINK

## env - [install docker](docs.docker.com/engine/install/ubuntu/)

### remove docker 
> docker swarm leave -f; docker stop $(docker ps -a -q)  ; docker rm -f $(docker ps -aq) ; docker system prune -a ; docker volume prune ; docker ps -a ; docker images -a ;  docker network prune; docker network ls; docker volume ls;

## PostgreSQL vs Chainlink

### postgreSQL
> docker run --name cl-postgres -e POSTGRES_PASSWORD=Trideptrai123456789 -p 5432:5432 -d postgres

> docker ps -a -f name=cl-postgres

## run chainLink node
Create a folder for chainlink data
> mkdir chainLink-eth

Create a config.toml for configuration
``` bash

IP=$(ip -4 addr show enp0s3 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

echo "InsecureFastScrypt = true # Default
RootDir = '~/.chainlink' # Default
ShutdownGracePeriod = '5s' # Default

[Log]
Level = 'warn'

[WebServer]
AllowOrigins = '\*'
TLS.HTTPSPort = 0

[Insecure]
DevWebServer = true

[WebServer.TLS]
HTTPSPort = 0

[[EVM]]
ChainID = '2024'

[[EVM.Nodes]]
Name = 'node00'
WSURL = 'ws://$IP:8546'
HTTPURL = 'http://$IP:8000'
" > chainLink-eth/config.toml
```

Create srcrets.tomp for postgreSQL
``` bash
echo "[Password]
Keystore = 'Trideptrai123456789'
[Database]
URL = 'postgresql://postgres:Trideptrai123456789@host.docker.internal:5432/postgres?sslmode=disable'
" > chainLink-eth/secrets.toml
```

## start the chainLink node from docker
> cd chainLink-eth
> 
> docker run --platform linux/x86_64/v8 --name chainlink -v .:/chainlink -it -p 6688:6688 --add-host=host.docker.internal:host-gateway smartcontract/chainlink:2.0.0 node -config /chainlink/config.toml -secrets /chainlink/secrets.toml start

## add job
``` toml
type            = "cron"
schemaVersion   = 1
schedule = "CRON_TZ=UTC 0 0 1 1 * *"
# Optional externalJobID: Automatically generated if unspecified
# externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"
observationSource   = """
ds          [type="http" method=GET url="https://chain.link/ETH-USD"];
ds_parse    [type="jsonparse" path="data,price"];
ds_multiply [type="multiply" times=100];
ds -> ds_parse -> ds_multiply;
"""

OR

type = "directrequest"
schemaVersion = 1

# Optional externalJobID: Automatically generated if unspecified
# externalJobID   = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F46"

observationSource   = """
ds          [type="http" method=GET url="https://chain.link/ETH-USD"];
ds_parse    [type="jsonparse" path="data,price"];
ds_multiply [type="multiply" times=100];
ds -> ds_parse -> ds_multiply;
"""

curl -X POST -H 'Content-Type: application/json' -d @job.toml http://localhost:6688/v2/specs
```

## run job 

> curl -X POST http://localhost:6688/v2/specs/:id

## Smart contract chainlink
### Migrating a Chainlink Contract

To migrate a Chainlink contract using Truffle, follow these steps:

1. **Install Chainlink contracts:** If you haven't already done so, install the Chainlink contracts in your project using npm:

> npm install @chainlink/contracts

2. **Create a migration file:** Create a new migration file in the migrations directory of your Truffle project. This file should import your contract and the Chainlink contract, and then deploy them using the deployer.deploy function.
Here's an example of what your migration file might look like if you're deploying a contract that uses the ChainlinkClient contract:
``` js
const MyContract = artifacts.require('MyContract');
const { LinkToken } = require('@chainlink/contracts/truffle/v0.8/LinkToken');

module.exports = async (deployer) => {
  await deployer.deploy(LinkToken);
  const linkToken = await LinkToken.deployed();
  await deployer.deploy(MyContract, linkToken.address);
};
```
In this example, MyContract is the name of your contract, and LinkToken is the Chainlink contract. Replace MyContract with the actual name of your contract.

3. **Update your Truffle configuration:** Update your truffle-config.js file to specify the network you want to deploy to. Here's an example of how you can do this:

``` js
module.exports = {
  networks: {
    development: {
      host: "192.168.3.66",     // Localhost
      port: 8000,            // Standard Ethereum port
      network_id: "*",       // Any network
    },
  },
  // ...
};
```
4. **Run the migration:** Run the migration using the truffle migrate command:
This command compiles your contracts (if they haven't been compiled already), deploys them to the network specified in your Truffle configuration, and runs any migration scripts you've created.

> truffle migrate

Remember to replace MyContract with the actual name of your contract, and update the truffle-config.js file with the correct network details.


install Chainlink package
> npm install @chainlink/contracts

> docker pull smartcontract/chainlink:1.11.0

## Job chainlink
The job need to clarify the oracle contract address


#### Need to send eth from the network to chainlink

### Check LINK amount
``` js
let linkAbi = 
let linkAddress = 
let accountAddress =  
let linkTokenContract = new web3.eth.Contract(linkAbi,linkAddress);
let balance = await linkTokenContract.methods.balanceOf(accountAddress).call();
console.log("LINK balance is: ", web3.utils.fromWei(balance, 'ether'));
```


Token Contract: This is the smart contract that governs the behavior of a token, such as LINK. It includes functions to transfer tokens, check balances, and so on.

Chainlink Oracle Contract: This is the smart contract that Chainlink nodes interact with to receive data requests and send responses. When your custom contract wants to make a data request, it sends the request to the Oracle contract. The Chainlink node listens for these requests on the Oracle contract, performs the requested job, and sends the data back to your contract through the Oracle contract.

Custom Contract: This is the contract you write and deploy. It interacts with the Chainlink Oracle contract to request data. It specifies the job it wants to run (by job ID), the data it wants, and the amount of LINK it's willing to pay for the data.


npx hardhat run scripts/deploy.js --network localhost

> add money (Link) to oracle contract address

> check carefully function from MockOracle and Operator

# Flow

1 - Ethereum
2 - Link Token migrate 
3 - Oracle contract migate with LinkToken address
4 - config.toml for chainlink configuration with LinkToken address
5 - Job with OracleContract address
6 - compile custom contract with JobID
7 - add LinkToken to this contract address
8 - add money 
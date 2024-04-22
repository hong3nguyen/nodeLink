# Ethereum - Link

## env
> sudo mount -t vboxsf -o uid=1000,gid=1000 ethereum Public

# Ethereum - PoW version
File geth is in folder ./geth_run

Reset geth old data
> ./geth_run/geth removedb; rm -rf geth

Initial folder
> ./geth_run/geth --datadir . init genesis.json

 execute Ethereum or Ethereum client from Link view
``` bash
IP=$(ip -4 addr show enp0s3 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
./geth_run/geth --identity "node00" --http --http.addr $IP --http.port "8000" --http.corsdomain "*" --datadir . --port "30303" --nodiscover --http.api "eth,debug,net,web3,personal,miner,admin" --ws --ws.addr $IP --ws.port 8546 --networkid 2024 --nat "any" --allow-insecure-unlock  --rpc.gascap "99999999999999999" --ipcpath=~/Pictures/
```

Console to each node
> ./geth_run/geth attach http://$IP:8000

Create an account for the miner
> personal.newAccount()

Set balance to account recive the money from mining
> miner.setEtherbase(eth.accounts[0])

Unlock account for deploying smart contracts
> web3.personal.unlockAccount(web3.personal.listAccounts[0],"<password for the account[0]>",15000);

Add a computer to the network [add Peer to netwokr](https://ethereum.stackexchange.com/questions/43045/how-to-connect-another-node-to-my-own-private-network)

## Start a miner

### Set balance to account recevie the money for all nodes
``` bash
miner.setEtherbase(eth.accounts[0])
web3.personal.unlockAccount(web3.personal.listAccounts[0],"",15000);
eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(1, "ether") })
```

Start stop mining with
``` bash
> miner.start()

> miner.stop()
```

# Truffle for smart contract deploying
#### [install nodejs](https://ostechnix.com/install-node-js-linux/) vs truffle
``` bash
nvm install 12.20.2
nvm use 12.20.2
npm install -g truffle
mkdir truffle
cd truffle 
truffle init
```
## Config Truffle in truffle-config.js 
> networkID, IPaddress, solidity-version

#### Current problem with solidity version 0.8.20 so we need to move the compile to be 0.8.19

## Deploy LinkToken and Oracle smart contract on Ethereum
In this work we use mockLinkToken, mockOracle, and mockOperator
After compiling and deploying, we get the address for those LinkToken and Oracle contact, called addrLinkToken and addrOracleContract
When deploy OracleContract, addrLinkToken is an extra parameter for migrating

# ChainLink - Oracle
Deploy Chainlink Operator via Docker, including PostgreSQL and Chainlink 
#### env - [install docker](docs.docker.com/engine/install/ubuntu/)

## PostgreSQL vs Chainlink
postgreSQL
> docker run --name cl-postgres -e POSTGRES_PASSWORD=Trideptrai123456789 -p 5432:5432 -d postgres

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
LinkContractAddress = '<addrLinkToken>' # address of mockLinkToken contract after deploying
MinContractPayment = '0.1 link'

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

## Start the chainLink node from docker
> cd chainLink-eth
> 
> docker run --platform linux/x86_64/v8 --name chainlink -v .:/chainlink -it -p 6688:6688 --add-host=host.docker.internal:host-gateway smartcontract/chainlink:2.0.0 node -config /chainlink/config.toml -secrets /chainlink/secrets.toml start

### Create a job from 127.0.0.1:6688
This job is goto
``` toml
type = "directrequest"
schemaVersion = 1
name = "Get ETH Volume"
contractAddress = "<addrOracleContract>"
maxTaskDuration = "0s"
observationSource = """
    decode_log   [type="ethabidecodelog"
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type="cborparse" data="$(decode_log.data)"]
    fetch        [type="http" method=GET url="$(decode_cbor.get)"]
    parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]
    encode_data  [type="ethabiencode" abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    encode_tx    [type="ethabiencode"
                  abi="fulfillOracleRequest(bytes32 requestId, bytes32 data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"data\\": $(encode_data)}"
                ]
    submit_tx    [type="ethtx" to="<addrOracleContract>" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```
After that get the JobexternalID 

### Create a custom smart contract
```Solidity
// SPDX-License-Identifier: MIT
// https://glink.solutions
// Discord=https://discord.gg/KmZVYhYJUy

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract getAddressTemplateOrigin is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address public addressVariable;
  address public oracle;

  bytes32 private externalJobId;
  uint256 private oraclePayment;

  uint256 public volume;

  event RequestFulfilled(bytes32 indexed requestId,address indexed addressVariable);
  event Log(string message); // log event

  event DataFullfilled(uint256 volume);

  constructor() {
    //setPublicChainlinkToken(); if we use mainchain
    // use address of LinkToken contract
    setChainlinkToken(<addrLinkToken>);
    // use address of Oracle contract
    setChainlinkOracle(<addrOracleContract>);
    // This should be the job id
    externalJobId = "<JobexternalID>"; 
    oraclePayment = ((14 * LINK_DIVISIBILITY) / 10); // n * 10**18
    // This should be the oracle contract address
    oracle = <addrOracleContract>;
  }
  /**
    * Create a Chainlink request to retrieve API response, find the target
    * data, then multiply by 1000000000000000000 (to remove decimal places from data).
    */
  function requestVolumeData() public returns (bytes32 requestId) {
    Chainlink.Request memory request = buildChainlinkRequest(
        externalJobId,
        address(this),
        this.fulfill.selector
    );

    // Set the URL to perform the GET request on
    request.add(
        "get",
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
    );
    request.add("path", "RAW,ETH,USD,VOLUME24HOUR");

    // Multiply the result by 1000000000000000000 to remove decimals
    int timesAmount = 10**18;
    request.addInt("times", timesAmount);

    // Sends the request
    return sendChainlinkRequestTo(oracle, request, oraclePayment);
  }
  /**
    * Receive the response in the form of uint256
    */
  function fulfill(bytes32 _requestId, uint256 _volume)
      public
      recordChainlinkFulfillment(_requestId)
  {
      volume = _volume;
      emit DataFullfilled(volume);
  }

  function getVolume() public view returns (uint256) {
    return volume;
  }
}
```
This smart contract will access a link with a path we provide via JobexternalID

However, to work on it the contracts need to have some fee for that

# Provide Link and Eth to accounts
Send eth to Chainlink Operator (who manages the docker)
> eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(1, "ether")})

## Send Link to addrOracleContractk, addrCustomSmartContract, addrChainLinkOperator

# Flow

1. Ethereum
2. Link Token migrate with addrLinkToken
3. Oracle contract migate with LinkToken address to addrOracleContract
4. config.toml for chainlink configuration with LinkToken address (addrLinkToken)
5. create Job with OracleContract address (addrOracleContract)
6. compile custom contract with JobID 
7. add Link to this custom contract address and addrOracleLink
8. execute the custom smart contract
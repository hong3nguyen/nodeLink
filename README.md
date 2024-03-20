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
> ./geth_run/geth --identity "node00" --http --http.addr $IP --http.port "8000" --http.corsdomain "*" --datadir . --port "30303" --nodiscover --http.api "eth,debug,net,web3,personal,miner,admin" --ws --ws.addr $IP --ws.port 8546 --networkid 2024 --nat "any" --allow-insecure-unlock --rpc.gascap "999999" --ipcpath=~/Pictures/

## console to each node
> ./geth_run/geth attach http://$IP:8000

### Create a new account
> personal.newAccount()

### take information from a peer
> admin.nodeInfo.enode

## add a computer to the network [add Peer to netwokr](https://ethereum.stackexchange.com/questions/43045/how-to-connect-another-node-to-my-own-private-network)

By another computer, I'm assuming you mean a separate machine within your the same LAN? Did you assign it a unique IP or is just on a subnet?

Either way, try 
> admin.addPeer("enode://address@ip:port") in console

## Start a miner

### Set balance to account recevie the money for all nodes

> miner.setEtherbase(eth.accounts[0])

### Start stop mining with

> miner.start()

> miner.stop()


### Truffle for smart contract 
#### [install nodejs](https://ostechnix.com/install-node-js-linux/) vs truffle
```
nvm install 12.20.2
 
nvm use 12.20.2

npm install -g truffle

mkdir truffle

cd truffle 

truffle init

```

/truffle/contract/hello.sol
```
pragma solidity >=0.4.22 <0.9.0;
contract Hello {
  string public message;
  constructor() {
    message = "Hello, World : This is a Solidity Smart Contract on the Private Ethereum Blockchain ";
    }
}
```
/truffle/migration/1_initial_migration.js
```
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
``` 

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
```
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
```
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
> docker pull smartcontract/chainlink:1.11.0
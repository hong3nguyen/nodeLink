# Ethereum - Link

## env
> sudo mount -t vboxsf -o uid=1000,gid=1000 ethereum Public

# Ethereum - PoW version

## reset geth old data
> geth removedb; rm -rf geth

## initial folder
> geth --datadir . init genesis.json

## execute Ethereum or Ethereum client from Link view

> ./geth_run/geth --identity "node00" --http --http.addr "192.168.1.18" --http.port "8000" --http.corsdomain "*" --datadir . --port "30303" --nodiscover --http.api "eth,debug,net,web3,personal,miner,admin" --ws --ws.addr "192.168.1.18" --ws.port 8546 --networkid 2024 --nat "any" --ipcdisable --allow-insecure-unlock --rpc.gascap "999999" --miner.gaslimit "30067718" --override.terminaltotaldifficulty "750000"

## console to each node
> geth attach http://192.168.1.18:8000

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
echo "[Log]
Level = 'warn'

[WebServer]
AllowOrigins = '\*'
SecureCookies = false

[WebServer.TLS]
HTTPSPort = 0

[[EVM]]
ChainID = '2024'

[[EVM.Nodes]]
Name = 'node00'
WSURL = 'wss://192.168.1.18:8546'
HTTPURL = 'http://192.168.1.18:8000'
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


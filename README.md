# Ethereum - Link

## reset geth old data
> geth removedb; rm -rf geth

## initial folder
> geth --datadir . init genesis.json
> 
## execute Ethereum

> ./geth_run/geth --identity "node00" --http --http.addr "192.168.1.18" --http.port "8000" --http.corsdomain "*" --datadir . --port "30303" --nodiscover --http.api "eth,debug,net,web3,personal,miner,admin" --networkid 2021 --nat "any" --ipcdisable --allow-insecure-unlock --rpc.gascap "999999999999999" --miner.gaslimit "30067718" --override.terminaltotaldifficulty "750000"

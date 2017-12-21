# POA Network Validators Dapp

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask plugin setup

* Connect to POA Network in MetaMask plugin (See [Connect to POA Network via MetaMask](https://github.com/oraclesorg/oracles-wiki/blob/master/MetaMask-connect.md#connect-to-oracles-network-via-metamask))

![](./docs/all.png)

![](./docs/set_metadata.png)

## Configuration file
It is configured with [POA Network contract](https://github.com/oraclesorg/poa-network-consensus-contracts)

Path: [`./src/contracts/addresses.js`](./src/contracts/addresses.js)

```
module.exports = {
  METADATA_ADDRESS: '0xcBB2912666c7e8023B7ec78B6842702eB26336aC',
  KEYS_MANAGER_ADDRESS: '0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8',
  POA_ADDRESS: '0x8bf38d4764929064f2d4d3a56520a76ab3df415b'
}
```

## Building from source

1) `npm i`

2) `npm start`
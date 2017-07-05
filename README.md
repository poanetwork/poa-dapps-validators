# Oracles network Validators List Dapp

![](./docs/index.png)

## Configuration file
It is configured with [Oracles network contract](https://github.com/oraclesorg/oracles-contract)

Path: `./assets/javascripts/config.json`

```
{
  "environment": "live",
  "Ethereum": {
    "live": {
      "contractAddress": "Oracles_contract_address"
    }
  }
}
```

## Building from source

1) `npm install`

2) `npm run sass`

3) `npm run coffee`

4) `npm start`

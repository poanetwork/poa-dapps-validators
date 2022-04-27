# POA Network Validators DApp

Validators DApp is built for POA Network based blockchains. It gives an opportunity for the current validators of the network to set their personal information on-chain. Also, everyone can view current validators' personal data from this DApp.

## Base supported networks

- Core POA network (RPC endpoint: `https://core.poa.network`)
- Sokol testnet (RPC endpoint: `https://sokol.poa.network`)
- Kovan testnet (RPC endpoint: `https://kovan.infura.io/`)

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask/Nifty Wallet extensions setup

* Connect to POA Network in MetaMask extension (See [POA Network on MetaMask](https://github.com/poanetwork/wiki/wiki/POA-Network-on-MetaMask)) or in Nifty Wallet extension (See [POA Network on Nifty Wallet](https://github.com/poanetwork/wiki/wiki/POA-Network-on-Nifty-Wallet))

Validators DApp is based on [POA Network Governance contracts](https://github.com/poanetwork/poa-network-consensus-contracts)

## Validator role

### Set metadata
If you are a new validator of the POA Network and your validator node is successfully launched, you should fill your personal data. To do it you need:
- connect to the corresponding endpoint of POA Network in Metamask
- select your voting key from accounts in Metamask
- click **SET METADATA** in the navigation bar
- fill all fields in the form of a new validator
- click **+ SET METADATA** button
- confirm transaction in Metamask.

That's it. After DApp will get a receipt for the transaction you'll see a success message and your personal data will be added to the list of validators.

If you need to change already submitted data you need to repeat previous instruction with the only difference your changes will be applied after two confirmations from other validators.

### Confirm and finalize change in metadata
If you are an active validator of POA Network you have an ability to confirm pending changes of personal information from other validators. To do it you need:
- connect to the corresponding endpoint of POA Network in Metamask
- select your voting key from accounts in Metamask
- click **PENDING CHANGES** in the navigation bar. You'll see all pending changes
- find pending changes card
- click **Confirm** button

If you see **Finalize** button, then 2 confirmations are already submitted and you or any other validator might click it to apply changes of validator's personal data.

## Building from source

1) `npm i`

2) `npm start`

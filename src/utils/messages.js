import { getNetworkFullName } from './utils'

let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The current key is not a valid Voting Key! Please make sure you have loaded the correct Voting Key in MetaMask / Nifty Wallet.'
messages.noMetamaskAccount = 'Your MetaMask / Nifty Wallet is locked.'
messages.noMetamaskFound = 'MetaMask / Nifty Wallet is not found.'
messages.userDeniedAccessToAccount = 'You have denied access to your accounts'

messages.networkMatchError = function(netId) {
  const networkName = getNetworkFullName(Number(netId))
  return `Networks in DApp and MetaMask (Nifty Wallet) do not match. Switch MetaMask / Nifty Wallet to <b>${networkName}</b> or change the network in DApp.`
}

export default messages

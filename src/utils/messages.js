import { getNetworkFullName } from './utils'

let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The current key is not a valid Voting Key! Please make sure you have loaded the correct Voting Key in Metamask / Nifty Wallet.'
messages.noMetamaskAccount = 'Your MetaMask is locked.'
messages.noMetamaskFound = 'Metamask is not found.'

messages.networkMatchError = function(netId) {
  const networkName = getNetworkFullName(Number(netId))
  return `Networks in DApp and MetaMask do not match. Switch MetaMask to ${networkName} or change the network in DApp.`
}

export default messages

import { getNetworkFullName } from './utils'

let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The current key is not a valid Voting Key! Please make sure you have loaded the correct Voting Key in MetaMask / Nifty Wallet.'
messages.noMetamaskAccount = 'Your MetaMask / Nifty Wallet is locked.'
messages.noMetamaskFound =
  'MetaMask / Nifty Wallet is not found. Please, install/activate it to be able to make transactions.'
messages.userDeniedAccessToAccount = 'You have denied access to your accounts'

messages.networkMatchError = function(netId) {
  const networkName = getNetworkFullName(Number(netId))
  return `Networks in DApp and MetaMask (Nifty Wallet) do not match. Switch MetaMask / Nifty Wallet to <b>${networkName}</b> or change the network in DApp.`
}

messages.poaGnoMerging =
  'POA is joining the Gnosis Chain ecosystem, and token holders can now swap POA for STAKE and then STAKE for GNO on the Gnosis Chain! More info and instructions <a href="https://www.poa.network/" target="_blank">here</a>.'

messages.poaGnoMerged =
  'POA Network merged with the Gnosis Chain.<br /><a href="https://www.poa.network/" target="_blank">More information</a> about the merger.'

export default messages

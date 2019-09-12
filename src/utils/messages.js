let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The key is not a valid voting Key! Please make sure you have loaded the correct voting key in Metamask / Nifty Wallet.'
messages.noMetamaskAccount = 'Your MetaMask is locked.'
messages.networkMatchError = 'Networks do not match. Change the network in Metamask.'

module.exports = {
  messages
}

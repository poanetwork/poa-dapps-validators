let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The key is not a valid voting Key! Please make sure you have loaded the correct voting key in Metamask / Nifty Wallet.'
messages.noMetamaskAccount = `Your MetaMask is locked.
Please choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`
messages.networkMatchError = 'Networks do not match. Change the network in Metamask'

module.exports = {
  messages
}

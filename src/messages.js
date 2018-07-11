let messages = {}
messages.wrongRepo = function(repo) {
  return `There is no such file in configured repo ${repo}`
}
messages.invalidaVotingKey =
  'The key is not valid voting Key or you are connected to the wrong chain! Please make sure you have loaded correct voting key in Metamask'

module.exports = {
  messages
}

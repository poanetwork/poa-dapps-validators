let messages = {};
messages.wrongRepo = function(repo) {
	return `There is no such file in configured repo ${repo}`;
};
messages.invalidaVotingKey = "The key is not valid voting Key or you are connected to the wrong chain! Please make sure you have loaded correct voting key in Metamask"
messages.noMetamaskAccount = `Your MetaMask is locked.
Please choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;

module.exports = {
  messages
};
let messages = {};
messages.wrongRepo = function(repo) {
	return `There is no contracts.json in configured repo ${repo}`;
};
module.exports = {
  messages
};
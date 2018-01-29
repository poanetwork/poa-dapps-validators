let messages = {};
messages.wrongRepo = function(repo) {
	return `There is no such file in configured repo ${repo}`;
};
module.exports = {
  messages
};
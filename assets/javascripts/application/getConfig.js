//gets config file with address of Oracles contract
async function getConfig(cb) {
  	let config = await $.getJSON("./assets/javascripts/config.json")
	let contractAddress = config.Ethereum[config.environment].contractAddress
	let networkID = config.networkID
	let configJSON = {
		contractAddress,
		networkID
	}
	if (cb) cb(configJSON)
	return configJSON;
}
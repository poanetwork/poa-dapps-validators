const constants = {};
constants.organization = 'poanetwork';
constants.repoName = 'poa-chain-spec';
constants.addressesSourceFile = 'contracts.json';
constants.ABIsSources = {
	'KeysManager': 'KeysManager.abi.json',
	'PoaNetworkConsensus': 'PoaNetworkConsensus.abi.json',
	'ValidatorMetadata': 'ValidatorMetadata.abi.json'
};
constants.userDeniedTransactionPattern = 'User denied transaction';

module.exports = {
  constants
};
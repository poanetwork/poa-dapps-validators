//launches main application
function startDapp(web3, isOraclesNetwork) {
	if (!isOraclesNetwork) {
		$(".loading-container").hide();
		return;
	}
		
	$(function() {
		startDappInner(web3);
	});
}

async function startDappInner(web3) {
	var validators;
  	let config = await getConfig()
  	getValidators(web3, config.contractAddress, config.abi, false, function(_validatorsArray) {
	  	$(".loading-container").hide();
		validators = _validatorsArray;
		for(var i = 0; i < _validatorsArray.length; i++) {
			var validator = _validatorsArray[i];
			var validatorAddress = Object.keys(validator)[0];
			var validatorPropsObj = validator[validatorAddress];
			$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
		}

		$(".search-input").on("keyup", function() {
			var searchInput = $(this).val();
			var filteredValidators = filterValidators(searchInput, validators);
			$(".validators").empty();
			for(var i = 0; i < filteredValidators.length; i++) {
				var validator = filteredValidators[i];
				if (validator) {
					var validatorAddress = Object.keys(validator)[0];
					var validatorPropsObj = validator[validatorAddress];
					$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
				}
			}
		});
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});
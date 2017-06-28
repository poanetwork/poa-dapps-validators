//launches main application
function startDapp(web3, isOraclesNetwork) {
	if (!isOraclesNetwork) return
		
	$(function() {
		var validators;
	  	getConfig(function(contractAddress) {
			getValidators(web3, "getValidators()", contractAddress, false, function(_validatorsArray) {
				$(".loading-container").hide();
				validators = _validatorsArray;
				for(var i = 0; i < _validatorsArray.length; i++) {
					var validator = _validatorsArray[i];
					var validatorAddress = Object.keys(validator)[0];
					var validatorPropsObj = validator[validatorAddress];
					$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
				}
			});
		});

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
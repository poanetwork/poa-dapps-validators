$(function() {
	var api = window.parity.api;
	var config;
	var validators;
  	$.getJSON("./assets/javascripts/config.json", function(_config) {
		config = _config;

		getValidators(api, 
			"getValidators()",
			config.Ethereum[config.environment].account,
			config.Ethereum[config.environment].contractAddress,
			false,
			function(_validatorsArray) {
				validators = _validatorsArray;
				for(var i = 0; i < _validatorsArray.length; i++) {
					var validator = _validatorsArray[i];
					var validatorAddress = Object.keys(validator)[0];
					var validatorPropsObj = validator[validatorAddress];
					$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
				}
			}
		);
	});

	$(".search-input").on("keyup", function() {
		var searchInput = $(this).val();
		var filteredValidators = filterValidators(searchInput);
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

	function filterValidators(searchInput) {
		return validators.map(function(validator, i) {
			if (validator) {
				var searchValidated = validateSearch(validator, searchInput.toLowerCase());
		      	if (!searchValidated) return null;
		      	else return validator;
			} else return null;
	    })
	}

	function validateSearch(validator, searchInput) {
		var validatorAddress = Object.keys(validator)[0];
		if (validatorAddress.indexOf(searchInput) > -1) return true;

		var validatorPropsObj = validator[validatorAddress];
		if (validatorPropsObj["fullName"].toLowerCase().indexOf(searchInput) > -1) return true;
		else if (validatorPropsObj["streetName"].toLowerCase().indexOf(searchInput) > -1) return true;
		else if (validatorPropsObj["zip"].toString().indexOf(searchInput) > -1) return true;
		else if (validatorPropsObj["licenseID"].toString().indexOf(searchInput) > -1) return true;
		else if (formatDate(new Date(parseInt(validatorPropsObj["licenseExpiredAt"])*1000), "MM/dd/yyyy h:mmTT").toLowerCase().indexOf(searchInput) > -1)
			return true;

		var stateCode = validatorPropsObj["state"].toString();
		if (stateCode) {
			var statesList = List.getStatesList();

			if (statesList[stateCode]) {
				if (statesList[stateCode].toLowerCase().indexOf(searchInput) > -1)
					return true;
			}
		}

		return false;
	}
});
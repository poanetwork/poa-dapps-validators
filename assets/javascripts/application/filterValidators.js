function filterValidators(searchInput, validators) {
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
	else if (validatorPropsObj["state"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (formatDate(new Date(parseInt(validatorPropsObj["licenseExpiredAt"])*1000), "MM/dd/yyyy h:mmTT").toLowerCase().indexOf(searchInput) > -1)
		return true;

	return false;
}
function getValidators(web3, contractAddress, abi, disabled, cb) {
	let ValidatorsStorage = attachToContract(web3, abi, contractAddress)
	console.log("attach to oracles contract");
    if (!ValidatorsStorage) {
      return cb();
    }

    ValidatorsStorage.methods.getValidators().call(function(err, validatorsArray) {
    	if (validatorsArray.length == 0) {
			return cb(validatorsArray);
		}

		var validatorsArrayOut = [];
		var iasync = 0;
		var validatorDataCount = 6;
		if (disabled)
			validatorDataCount++;
		for (var i = 0; i < validatorsArray.length; i++) {
			getValidatorFullName(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("fullName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			getValidatorStreetName(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("streetName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			getValidatorState(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("state", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			getValidatorLicenseExpiredAt(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("licenseExpiredAt", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			getValidatorZip(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("zip", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			getValidatorLicenseID(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("licenseID", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
			});

			if (disabled) {
				getValidatorDisablingDate(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("disablingDate", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
					if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
				});
			}
		}
    })
}

function getPropertyCallback(prop, resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb) {
	if (validatorsArrayOut.length == _i) {
		var validator = {};
		validator[validatorsArray[_i]] = {};
		validator[validatorsArray[_i]][prop] = resp;
		validatorsArrayOut.push(validator);
	} else {
		validatorsArrayOut[_i][validatorsArray[_i]][prop] = resp;
	}

	return validatorsArrayOut;
}
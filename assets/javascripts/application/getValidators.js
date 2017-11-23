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

		getValidatorsProperties(web3, validatorsArray, contractAddress, abi, iasync, validatorDataCount, disabled, validatorsArrayOut, cb)
    })
}

function getValidatorsProperties(web3, validatorsArray, contractAddress, abi, iasync, validatorDataCount, disabled, validatorsArrayOut, cb) {
	for (var i = 0; i < validatorsArray.length; i++) {
		var addr = validatorsArray[i]
		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorFullName", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("fullName", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorStreetName", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("streetName", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorState", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("state", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorLicenseExpiredAt", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("licenseExpiredAt", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorZip", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("zip", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorLicenseID", function(_i, resp) {
			iasync++;
			validatorsArrayOut = getPropertyCallback("licenseID", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
			finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
		});

		if (disabled) {
			callContractMethod(web3, addr, i, contractAddress, abi, "getValidatorDisablingDate", function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("disablingDate", resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb)
			});
		}
	}
}

function getPropertyCallback(prop, resp, _i, validatorsArray, validatorDataCount, validatorsArrayOut, cb) {
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

function finish(iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb) {
	if (iasync == validatorsArray.length * validatorDataCount) {cb(validatorsArrayOut)};
}
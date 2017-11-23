function getValidatorFullName(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorFullName(addr).call(function(err, fullname) {
	    	cb(i, fullname);
	    })
	});
}

function getValidatorStreetName(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorStreetName(addr).call(function(err, streetname) {
	    	cb(i, streetname);
	    })
	});
}

function getValidatorState(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorState(addr).call(function(err, state) {
	    	cb(i, state);
	    })
	});
}

function getValidatorLicenseExpiredAt(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorLicenseExpiredAt(addr).call(function(err, licenseExpiredAt) {
	    	cb(i, licenseExpiredAt);
	    })
	});
}

function getValidatorDisablingDate(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorDisablingDate(addr).call(function(err, disablingDate) {
	    	cb(i, disablingDate);
	    })
	});
}

function getValidatorZip(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorZip(addr).call(function(err, zip) {
	    	cb(i, zip);
	    })
	});
}

function getValidatorLicenseID(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, ValidatorsStorage) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    ValidatorsStorage.methods.getValidatorLicenseID(addr).call(function(err, licenseID) {
	    	console.log(licenseID)
	    	cb(i, licenseID);
	    })
	});
}
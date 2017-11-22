function getValidatorFullName(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorFullName(addr).call(function(err, fullname) {
	    	cb(i, fullname);
	    })
	});
}

function getValidatorStreetName(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorStreetName(addr).call(function(err, streetname) {
	    	cb(i, streetname);
	    })
	});
}

function getValidatorState(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorState(addr).call(function(err, state) {
	    	cb(i, state);
	    })
	});
}

function getValidatorLicenseExpiredAt(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorLicenseExpiredAt(addr).call(function(err, licenseExpiredAt) {
	    	cb(i, licenseExpiredAt);
	    })
	});
}

function getValidatorDisablingDate(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorDisablingDate(addr).call(function(err, disablingDate) {
	    	cb(i, disablingDate);
	    })
	});
}

function getValidatorZip(web3, addr, i, contractAddr, abi, cb) {
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorZip(addr).call(function(err, zip) {
	    	cb(i, zip);
	    })
	});
}

function getValidatorLicenseID(web3, addr, i, contractAddr, abi, cb) {
	var func = "getValidatorLicenseID(address)";
	getContractIntDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}
function callContractMethod(web3, addr, i, contractAddr, abi, cb, method) {
	let ValidatorsStorage = attachToContract(web3, abi, contractAddr)
    console.log("attach to oracles contract");
    if (!ValidatorsStorage) {
      return cb();
    }

    ValidatorsStorage.methods[method](addr).call(function(err, res) {
    	cb(i, res);
    })
}


function getValidatorFullName(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorFullName")
}

function getValidatorStreetName(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorStreetName")
}

function getValidatorState(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorState")
}

function getValidatorLicenseExpiredAt(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorLicenseExpiredAt")
}

function getValidatorDisablingDate(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorDisablingDate")
}

function getValidatorZip(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorZip")
}

function getValidatorLicenseID(web3, addr, i, contractAddr, abi, cb) {
	callContractMethod(web3, addr, i, contractAddr, abi, cb, "getValidatorLicenseID")
}
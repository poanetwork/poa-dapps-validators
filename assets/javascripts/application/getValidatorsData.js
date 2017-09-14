function getValidatorFullName(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorFullName(address)";
	getContractStringDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorStreetName(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorStreetName(address)";
	getContractStringDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorState(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorState(address)";
	getContractStringDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorLicenseExpiredAt(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorLicenseExpiredAt(address)";
	getContractIntDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorDisablingDate(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorDisablingDate(address)";
	getContractIntDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorZip(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorZip(address)";
	getContractIntDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}

function getValidatorLicenseID(web3, addr, i, contractAddr, cb) {
	var func = "getValidatorLicenseID(address)";
	getContractStringDataFromAddressKey(web3, func, addr, i, contractAddr, cb);
}
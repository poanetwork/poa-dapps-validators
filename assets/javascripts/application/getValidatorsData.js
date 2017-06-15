function getValidatorFullName(api, addr, i, contractAddr, cb) {
	var func = "getValidatorFullName(address)";
	getContractStringDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorStreetName(api, addr, i, contractAddr, cb) {
	var func = "getValidatorStreetName(address)";
	getContractStringDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorState(api, addr, i, contractAddr, cb) {
	var func = "getValidatorState(address)";
	getContractStringDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorLicenseExpiredAt(api, addr, i, contractAddr, cb) {
	var func = "getValidatorLicenseExpiredAt(address)";
	getContractIntDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorDisablingDate(api, addr, i, contractAddr, cb) {
	var func = "getValidatorDisablingDate(address)";
	getContractIntDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorZip(api, addr, i, contractAddr, cb) {
	var func = "getValidatorZip(address)";
	getContractIntDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}

function getValidatorLicenseID(api, addr, i, contractAddr, cb) {
	var func = "getValidatorLicenseID(address)";
	getContractIntDataFromAddressKey(api, func, addr, i, contractAddr, cb);
}
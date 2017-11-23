function attachToContract(web3, abi, addr) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  let contractInstance = new web3.eth.Contract(abi, addr);
  
  return contractInstance;
}

function call(web3, acc, contractAddr, data, cb) {
  let props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}
//check current network page is connected to. Alerts, if not Oracles network
async function checkNetworkVersion(web3, cb) {
  var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Oracles plugin and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
  let config = await getConfig()
  web3.eth.net.getId().then(function(connectedNetworkID) {
    console.log("connectedNetworkID: " + connectedNetworkID);
    connectedNetworkID = parseInt(connectedNetworkID);
    switch (connectedNetworkID) {
      case 1: {
        console.log('This is mainnet');
        swal("Warning", msgNotOracles, "warning"); 
        return false;
      } break;
      case 2: {
        console.log('This is the deprecated Morden test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
      case 3: {
        console.log('This is the ropsten test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      }  break;
       case config.networkID: {
         console.log('This is Oracles from Metamask');
         return true;
      }  break;
      default: {
        console.log('This is an unknown network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
    }
  })
}
function formatDate(date, format, utc) {
    //var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMMM = ["\x00", "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};
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
//gets config file with address of Oracles contract
async function getConfig(cb) {
  	let config = await $.getJSON("./assets/javascripts/config.json")
	let contractAddress = config.Ethereum[config.environment].ValidatorsStorage.addr
	let abi = config.Ethereum[config.environment].ValidatorsStorage.abi
	let networkID = config.networkID
	let configJSON = {
		contractAddress,
		networkID,
		abi
	}
	if (cb) cb(configJSON)
	return configJSON;
}
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
function getValidatorView(validatorAddress, validatorPropsObj) {
	var stateCode = validatorPropsObj["state"].toString();
	return `<div class="validators-i">
    <div class="validators-header">
      0x` + validatorAddress + `
    </div>
    <div class="validators-body">
      <div class="validators-notary left">
        <p class="validators-title">Notary</p>
        <div class="validators-table">
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Full Name
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["fullName"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Address
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["streetName"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              State
            </p>
            <p class="validators-table-td right">
              ` + stateCode + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Zip Code
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["zip"] + `
            </p>
          </div>
        </div>
      </div>
      <div class="validators-license right">
        <p class="validators-title">Notary license</p>
        <div class="validators-table">
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              License ID
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["licenseID"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              License Expiration
            </p>
            <p class="validators-table-td right">
            ` + formatDate(new Date(parseInt(validatorPropsObj["licenseExpiredAt"])*1000), "MM/dd/yyyy"/*"MM/dd/yyyy h:mmTT"*/) + `
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
//gets web3 object from MetaMask or Parity
function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Oracles Network. Please, switch on Oracles plugin and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    let isOraclesNetwork = checkNetworkVersion(myWeb3)
    callback(myWeb3, isOraclesNetwork);
  }
}
//launches main application
function startDapp(web3, isOraclesNetwork) {
	if (!isOraclesNetwork) {
		$(".loading-container").hide();
		return;
	}
		
	$(function() {
		startDappInner(web3);
	});
}

async function startDappInner(web3) {
	var validators;
  	let config = await getConfig()
  	getValidators(web3, config.contractAddress, config.abi, false, function(_validatorsArray) {
	  	$(".loading-container").hide();
		validators = _validatorsArray;
		for(var i = 0; i < _validatorsArray.length; i++) {
			var validator = _validatorsArray[i];
			var validatorAddress = Object.keys(validator)[0];
			var validatorPropsObj = validator[validatorAddress];
			$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
		}

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
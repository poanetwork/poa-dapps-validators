function SHA3Encrypt(web3, str) {
  var strEncode = web3.utils.sha3(str);
  return strEncode;
}

function attachToContract(web3, abi, addr, cb) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  var contractInstance = new web3.eth.Contract(abi, addr);
  
  if (cb) cb(null, contractInstance);
}

function call(web3, acc, contractAddr, data, cb) {
  let props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}

/*function getContractStringDataFromAddressKey(web3, func, inputVal, i, contractAddr, cb) {
  const funcParamsNumber = 1;
  const standardLength = 32;

  let parameterLocation = standardLength * funcParamsNumber;

  let funcEncode = SHA3Encrypt(web3, func);
  let funcEncodePart = funcEncode.substring(0,10);
  
  let data = funcEncodePart
  + toUnifiedLengthLeft(inputVal);

  call(web3, null, contractAddr, data, function(respHex) {
    cb(i, hex2a(respHex));
  });
}

function getContractIntDataFromAddressKey(web3, func, inputVal, i, contractAddr, cb) {
  const funcParamsNumber = 1;
  const standardLength = 32;

  let parameterLocation = standardLength * funcParamsNumber;

  let funcEncode = SHA3Encrypt(web3, func);
  let funcEncodePart = funcEncode.substring(0,10);
  
  let data = funcEncodePart
  + toUnifiedLengthLeft(inputVal);

  call(web3, null, contractAddr, data, function(respHex) {
    cb(i, parseInt(respHex, 16));
  });
}*/
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
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code != 0 && !isNaN(code)) {
        str += String.fromCharCode(code);
      }
    }
    str = str.substr(2);
    return str;
}

function toUnifiedLengthLeft(strIn) {//for numbers
  var strOut = "";
  for (var i = 0; i < 64 - strIn.length; i++) {
    strOut += "0"
  }
  strOut += strIn;
  return strOut;
}

function countRows(strIn) {
  var rowsCount = 0;
  if (strIn.length%64 > 0)
    rowsCount = parseInt(strIn.length/64) + 1;
  else
    rowsCount = parseInt(strIn.length/64);
  return rowsCount;
}

function toUnifiedLengthRight(strIn) {//for strings
  var strOut = "";
  strOut += strIn;
  var rowsCount = countRows(strIn);
  for (var i = 0; i < rowsCount*64 - strIn.length; i++) {
    strOut += "0"
  }
  return strOut;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }

    return result
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function toHexString(byteArray) {
  return byteArray.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function bytesCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
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
	let contractAddress = config.Ethereum[config.environment].contractAddress
	let abi = config.Ethereum[config.environment].abi
	let networkID = config.networkID
	let configJSON = {
		contractAddress,
		networkID,
		abi
	}
	if (cb) cb(configJSON)
	return configJSON;
}
function getValidators(web3, func, contractAddress, abi, disabled, cb) {
	let funcEncode = SHA3Encrypt(web3, func);
	var funcEncodePart = funcEncode.substring(0,10);

	var data = funcEncodePart;
	
	call(web3, null, contractAddress, data, function(validatorsResp) {
		validatorsResp = validatorsResp.substring(2, validatorsResp.length);
		var validatorsArray = [];
		var item = "";
		for (var i = 0; i < validatorsResp.length; i++) {
			item += validatorsResp[i];
			if ((i + 1) % 64 == 0) {
				item = item.substr(item.length - 40, 40);
				validatorsArray.push(item);
				item = "";
			}
		}
		validatorsArray.shift();
		validatorsArray.shift(); //number of elements

		if (validatorsArray.length == 0) {
			return cb(validatorsArray);
		}

		var validatorsArrayOut = [];
		var iasync = 0;
		var validatorDataCount = 6;
		if (disabled)
			validatorDataCount = 7;
		for (var i = 0; i < validatorsArray.length; i++) {
			getValidatorFullName(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("fullName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			getValidatorStreetName(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("streetName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			getValidatorState(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("state", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			getValidatorLicenseExpiredAt(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("licenseExpiredAt", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			getValidatorZip(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("zip", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			getValidatorLicenseID(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
				iasync++;
				validatorsArrayOut = getPropertyCallback("licenseID", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
			});

			if (disabled) {
				getValidatorDisablingDate(web3, validatorsArray[i], i, contractAddress, abi, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("disablingDate", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
					if (iasync == validatorsArray.length * validatorDataCount) {console.log(validatorsArrayOut); cb(validatorsArrayOut)};
				});
			}
		}
	});
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
	attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
	    console.log("attach to oracles contract");
	    if (err) {
	      console.log(err)
	      return cb();
	    }

	    oraclesContract.methods.getValidatorLicenseID(addr).call(function(err, licenseID) {
	    	console.log(licenseID)
	    	cb(i, licenseID);
	    })
	});
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
  	getValidators(web3, "getValidators()", config.contractAddress, config.abi, false, function(_validatorsArray) {
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
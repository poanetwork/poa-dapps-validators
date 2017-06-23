function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You are not connected to Ethereum. Please, switch on Parity or MetaMask client and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    checkNetworkVersion(myWeb3, function(isOraclesNetwork) {
    	callback(myWeb3, isOraclesNetwork);
    });
  }
}

function checkNetworkVersion(web3, cb) {
	var msgNotOracles = "You are not connected to Oracles network. Please, switch on Parity or MetaMask client and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
	web3.version.getNetwork(function(err, netId) {
		console.log(netId);
	  switch (netId) {
	    case "1": {
	      console.log('This is mainnet');
	      swal("Warning", msgNotOracles, "warning"); 
	      cb(false);
	    } break;
	    case "2": {
	      console.log('This is the deprecated Morden test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    } break;
	    case "3": {
	      console.log('This is the ropsten test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    }  break;
	     case "12648430": {
	       console.log('This is Oracles from Metamask');
	       cb(true);
	    }  break;
	    default: {
	      console.log('This is an unknown network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	  	} break;
	  }
	})
}

function startDapp(web3, isOraclesNetwork) {
	if (!isOraclesNetwork) return
		
	$(function() {
		var config;
		var validators;
	  	$.getJSON("./assets/javascripts/config.json", function(_config) {
			config = _config;

			getValidators(web3, 
				"getValidators()",
				config.Ethereum[config.environment].account,
				config.Ethereum[config.environment].contractAddress,
				false,
				function(_validatorsArray) {
					validators = _validatorsArray;
					for(var i = 0; i < _validatorsArray.length; i++) {
						var validator = _validatorsArray[i];
						var validatorAddress = Object.keys(validator)[0];
						var validatorPropsObj = validator[validatorAddress];
						$(".validators").append(getValidatorView(validatorAddress, validatorPropsObj));
					}
				}
			);
		});

		$(".search-input").on("keyup", function() {
			var searchInput = $(this).val();
			var filteredValidators = filterValidators(searchInput);
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

		function filterValidators(searchInput) {
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
			else if (formatDate(new Date(parseInt(validatorPropsObj["licenseExpiredAt"])*1000), "MM/dd/yyyy h:mmTT").toLowerCase().indexOf(searchInput) > -1)
				return true;

			var stateCode = validatorPropsObj["state"].toString();
			if (stateCode) {
				var statesList = List.getStatesList();

				if (statesList[stateCode]) {
					if (statesList[stateCode].toLowerCase().indexOf(searchInput) > -1)
						return true;
				}
			}

			return false;
		}
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});
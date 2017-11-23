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
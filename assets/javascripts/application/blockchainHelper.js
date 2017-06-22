function SHA3Encrypt(web3, str, cb) {
  var strEncode = web3.sha3(str);
  cb(strEncode);
}

function estimateGas(web3, acc, contractAddr, data, cb) {
  web3.eth.estimateGas({
      from: acc, 
      data: data,
      to: contractAddr
  }, function(err, estimatedGas) {
    console.log(err);
    console.log(estimatedGas);
    cb(estimatedGas);
  });
}

function sendTx(web3, acc, contractAddr, data, estimatedGas, cb) {
  web3.eth.sendTransaction({
    from: acc,
    data: data,
    to: contractAddr,
    gas: estimatedGas
  }, function(err, txHash) {
    cb(txHash, err);
  });
}

function call(web3, acc, contractAddr, data, cb) {
  var props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}

function getContractStringDataFromAddressKey(web3, func, inputVal, i, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, null, contractAddr, data, function(respHex) {
      cb(i, hex2a(respHex));
    });
  });
}

function getContractIntDataFromAddressKey(web3, func, inputVal, i, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, null, contractAddr, data, function(respHex) {
      cb(i, parseInt(respHex, 16));
    });
  });
}
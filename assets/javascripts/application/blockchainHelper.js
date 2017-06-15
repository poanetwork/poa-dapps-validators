function SHA3Encrypt(api, str, cb) {
  api._web3.sha3(str).then(function(strEncode) {
    cb(strEncode, null);
  }).catch(function(err) {
    console.log(err);
    cb("", err);
  });
}

function estimateGas(api, acc, contractAddr, data, cb) {
  api.eth.estimateGas({
      from: acc, 
      data: data,
      to: contractAddr
  }).then(function(res) {
    var gasWillUsed = res.c[0];
    gasWillUsed += 10000;
    cb(gasWillUsed);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}

function sendTx(api, acc, contractAddr, data, estimatedGas, cb) {
  api.eth.sendTransaction({
    from: acc,
    data: data,
    to: contractAddr,
    gas: estimatedGas
  }).then(function(txHash) {
    cb(txHash);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}

function call(api, acc, contractAddr, data, cb) {
  var props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  api.eth.call(props)
  .then(function(data) {
    cb(data);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}

function getContractStringDataFromAddressKey(api, func, inputVal, i, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(api, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(api, null, contractAddr, data, function(respHex) {
      cb(i, hex2a(respHex));
    });
  });
}

function getContractIntDataFromAddressKey(api, func, inputVal, i, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(api, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(api, null, contractAddr, data, function(respHex) {
      cb(i, parseInt(respHex, 16));
    });
  });
}
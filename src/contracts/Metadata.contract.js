import PoaConsensus from './PoaConsensus.contract'
import MetadataAbi from './metadata.abi.json'
import Web3 from 'web3';
import moment from 'moment';
var toAscii = function(hex) {
  var str = '',
      i = 0,
      l = hex.length;
  if (hex.substring(0, 2) === '0x') {
      i = 2;
  }
  for (; i < l; i+=2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) continue; // this is added
      str += String.fromCharCode(code);
  }
  return str;
};

const METADATA_ADDRESS = '0x3111c94b9243a8a99d5a867e00609900e437e2c0';
export default class Metadata {
  constructor(){
    if(window.web3.currentProvider){
      this.web3_10 = new Web3(window.web3.currentProvider);
      this.metadataInstance = new this.web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS);
    }
  }
  async createMetadata({
    firstName,
    lastName,
    licenseId,
    fullAddress,
    state,
    zipcode,
    expirationDate,
    votingKey,
    hasData
  }) {
    let methodToCall = hasData ? 'changeRequest' : 'createMetadata'
    return await this.metadataInstance.methods[methodToCall](
      this.web3_10.utils.fromAscii(firstName),
      this.web3_10.utils.fromAscii(lastName),
      this.web3_10.utils.fromAscii(licenseId),
      fullAddress,
      this.web3_10.utils.fromAscii(state),
      zipcode,
      expirationDate
    ).send({from: votingKey});
  }

  async getValidatorData({votingKey, miningKey}){
    miningKey = miningKey || await this.getMiningByVoting(votingKey);
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    let createdDate = validatorData.createdDate > 0 ? moment.unix(validatorData.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = validatorData.updatedDate > 0 ? moment.unix(validatorData.updatedDate).format('YYYY-MM-DD') : ''
    let expirationDate = validatorData.expirationDate > 0 ? moment.unix(validatorData.expirationDate).format('YYYY-MM-DD') : ''
    let postal_code = Number(validatorData.zipcode) || ''
    return {
      firstName: toAscii(validatorData.firstName),
      lastName: toAscii(validatorData.lastName),
      fullAddress: validatorData.fullAddress,
      createdDate,
      updatedDate,
      expirationDate,
      licenseId: toAscii(validatorData.licenseId),
      us_state: toAscii(validatorData.state),
      postal_code,
    }
  }

  async getMiningByVoting(votingKey){
    return await this.metadataInstance.methods.getMiningByVotingKey(votingKey).call();
  }

  async getAllValidatorsData(){
    let all = [];
    return new Promise(async(resolve, reject) => {
      const poaInstance = new PoaConsensus({web3: this.web3_10})
      const keys = await poaInstance.getValidators()
      for (let key of keys) {
        let data = await this.getValidatorData({miningKey: key})
        data.address = key
        all.push(data)
      }
      resolve(all);
    })
  }

  async getPendingChange({votingKey, miningKey}){
    miningKey = miningKey || await this.getMiningByVoting(votingKey);
    let pendingChanges = await this.metadataInstance.methods.pendingChanges(miningKey).call();
    let createdDate = pendingChanges.createdDate > 0 ? moment.unix(pendingChanges.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = pendingChanges.updatedDate > 0 ? moment.unix(pendingChanges.updatedDate).format('YYYY-MM-DD') : ''
    let expirationDate = pendingChanges.expirationDate > 0 ? moment.unix(pendingChanges.expirationDate).format('YYYY-MM-DD') : ''
    let postal_code = Number(pendingChanges.zipcode) || ''
    return {
      firstName: toAscii(pendingChanges.firstName),
      lastName: toAscii(pendingChanges.lastName),
      fullAddress: pendingChanges.fullAddress,
      createdDate,
      updatedDate,
      expirationDate,
      licenseId: toAscii(pendingChanges.licenseId),
      us_state: toAscii(pendingChanges.state),
      postal_code,
      minThreshold: pendingChanges.minThreshold
    }
  }

  async getAllPendingChanges() {
    let allChanges = await this.metadataInstance.getPastEvents('ChangeRequestInitiated', {fromBlock: 0});
    let miningKeys = allChanges.map((event) => event.returnValues.miningKey)
    let pendingChanges = []
    for (let key of miningKeys) {
      let pendingChange = await this.getPendingChange({miningKey: key})
      pendingChange.address = key;
      if(pendingChange.postal_code > 0){
        pendingChanges.push(pendingChange)
      }
    }
    return pendingChanges
  }

  async confirmPendingChange({miningKeyToConfirm, senderVotingKey}) {
    // you can't confirm your own
    // you can't confirm twice
    // 
    return await this.metadataInstance.methods.confirmPendingChange(miningKeyToConfirm).send({from: senderVotingKey});
  }

  async getConfirmations({miningKey}) {
    return await this.metadataInstance.methods.confirmations(miningKey).call();
  }

  async getMinThreshold({miningKey}) {
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    return validatorData.minThreshold;
  }

  async finalize({miningKeyToConfirm, senderVotingKey}) {
    return await this.metadataInstance.methods.finalize(miningKeyToConfirm).send({from: senderVotingKey});
  }
  
}

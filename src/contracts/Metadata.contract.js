import PoaConsensus from './PoaConsensus.contract'
import Web3 from 'web3';
import moment from 'moment';
import helpers from "./helpers";
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
export default class Metadata {
  async init({web3, netId, addresses}){
    this.web3_10 = new Web3(web3.currentProvider);
    const {METADATA_ADDRESS, MOC} = addresses;
    console.log('Metadata contract Address: ', METADATA_ADDRESS)
    const branch = helpers.getBranch(netId);

    let MetadataAbi = await helpers.getABI(branch, 'ValidatorMetadata')

    this.metadataInstance = new this.web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS);
    this.MOC_ADDRESS = MOC;
    this.addresses = addresses;
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

  getMocData() {
    // Barinov, Igor		755 Bounty Dr 202	Foster City	CA	94404 	41	2206724	07/23/2021
    return {
      firstName: 'Igor',
      lastName: 'Barinov',
      fullAddress: '755 Bounty Dr 202, Foster City',
      createdDate: '2017-12-18',
      updatedDate: '',
      expirationDate: '2021-07-23',
      licenseId: '2206724',
      us_state: 'CA',
      postal_code: 94404,
    }
  }

  async getValidatorData({votingKey, miningKey}){
    miningKey = miningKey || await this.getMiningByVoting(votingKey);
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    let createdDate = validatorData.createdDate > 0 ? moment.unix(validatorData.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = validatorData.updatedDate > 0 ? moment.unix(validatorData.updatedDate).format('YYYY-MM-DD') : ''
    let expirationDate = validatorData.expirationDate > 0 ? moment.unix(validatorData.expirationDate).format('YYYY-MM-DD') : ''
    if(validatorData.zipcode.length === 4){
      validatorData.zipcode = "0" + validatorData.zipcode;
    }
    if(validatorData.zipcode === "0"){
      validatorData.zipcode = '';
    }
    return {
      firstName: toAscii(validatorData.firstName),
      lastName: toAscii(validatorData.lastName),
      fullAddress: validatorData.fullAddress,
      createdDate,
      updatedDate,
      expirationDate,
      licenseId: toAscii(validatorData.licenseId),
      us_state: toAscii(validatorData.state),
      postal_code: validatorData.zipcode,
    }
  }

  async getMiningByVoting(votingKey){
    return await this.metadataInstance.methods.getMiningByVotingKey(votingKey).call();
  }

  async getAllValidatorsData(netId){
    let all = [];
    return new Promise(async(resolve, reject) => {
      const poaInstance = new PoaConsensus()
      await poaInstance.init({web3: this.web3_10, netId, addresses: this.addresses})
      const keys = await poaInstance.getValidators()
      console.log(keys)
      for (let key of keys) {
        let data = await this.getValidatorData({miningKey: key})
        if(key.toLowerCase() === this.MOC_ADDRESS.toLowerCase()) {
          data = this.getMocData()
        }
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
    let alreadyConfirmed = await this.metadataInstance.methods.isAddressAlreadyVoted(miningKeyToConfirm, senderVotingKey).call();
    console.log(alreadyConfirmed)
    if(alreadyConfirmed){
      throw(
        {message:
          `You already confirmed this change.`})
    }
    const miningKeySender = await this.getMiningByVoting(senderVotingKey);
    if(miningKeySender === miningKeyToConfirm){
      throw(
        {message:
          `You cannot confirm your own changes.\n
          Please ask other validators to verify your new information.`})
    }
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
    const confirmations = await this.getConfirmations({miningKey: miningKeyToConfirm});
    const getMinThreshold = await this.getMinThreshold({miningKey: miningKeyToConfirm});
    if(Number(confirmations) < Number(getMinThreshold)){
      throw(
        {message:
          `There is not enough confimations.\n
          The minimum threshold to finalize is ${getMinThreshold}.`})
    }
    return await this.metadataInstance.methods.finalize(miningKeyToConfirm).send({from: senderVotingKey});
  }
  
}

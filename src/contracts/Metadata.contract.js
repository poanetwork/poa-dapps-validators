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

const METADATA_ADDRESS = '0xcbf043db3498b5064bd62341be0c0e3fb0344b1b';
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

  async getValidatorsData(votingKey){
    const miningKey = await this.getMiningByVoting(votingKey);
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    return {
      firstName: toAscii(validatorData.firstName),
      lastName: toAscii(validatorData.lastName),
      fullAddress: validatorData.fullAddress,
      createdDate: moment.unix(validatorData.createdDate).format('YYYY-MM-DD'),
      updatedDate: moment.unix(validatorData.updatedDate).format('YYYY-MM-DD'),
      expirationDate: moment.unix(validatorData.expirationDate).format('YYYY-MM-DD'),
      licenseId: toAscii(validatorData.licenseId),
      us_state: toAscii(validatorData.state),
      postal_code: validatorData.zipcode,
    }
  }

  async getMiningByVoting(votingKey){
    return await this.metadataInstance.methods.getMiningByVotingKey(votingKey).call();
  }
  
}

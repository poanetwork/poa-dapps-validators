import Web3 from 'web3';
import helpers from "./helpers";

export default class KeysManager {
  async init({web3, netId, addresses}){
    let web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = addresses;
    console.log('Keys Manager address ', KEYS_MANAGER_ADDRESS);
    const branch = helpers.getBranch(netId);

    let KeysManagerAbi = await helpers.getABI(branch, 'KeysManager')

    this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
  }
  async isVotingActive(votingKey) {
    return await this.keysInstance.methods.isVotingActive(votingKey).call();
  }  
}
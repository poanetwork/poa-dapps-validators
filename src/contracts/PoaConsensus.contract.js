import poaConsensusAbi from './poaConsensus.abi.json'
import Web3 from 'web3';

const KEYS_MANAGER_ADDRESS = '0x8bf38d4764929064f2d4d3a56520a76ab3df415b';
export default class POAConsensus {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, KEYS_MANAGER_ADDRESS);
    }
  }
  async getValidators(){
    return await this.poaInstance.methods.getValidators().call();
  }
}
import poaConsensusAbi from './poaConsensus.abi.json'
import Web3 from 'web3';
import {POA_ADDRESS} from './addresses';

console.log('POA Address ' , POA_ADDRESS)
export default class POAConsensus {
  constructor({web3}){
    let web3_10 = new Web3(web3.currentProvider);
    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS);
  }
  async getValidators(){
    return await this.poaInstance.methods.getValidators().call();
  }
}
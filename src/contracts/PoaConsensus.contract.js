import Web3 from 'web3'
import helpers from './helpers'
import { constants } from '../constants'

export default class POAConsensus {
  async init({ web3, netId, addresses }) {
    const web3_10 = new Web3(web3.currentProvider)
    const { POA_ADDRESS } = addresses
    console.log('POA Address ', POA_ADDRESS)

    const poaConsensusAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'PoaNetworkConsensus')

    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS)
  }
  async getValidators() {
    console.log(this.poaInstance)
    return await this.poaInstance.methods.getValidators().call()
  }
  async isMasterOfCeremonyRemoved() {
    if (this.poaInstance.methods.isMasterOfCeremonyRemoved) {
      return await this.poaInstance.methods.isMasterOfCeremonyRemoved().call()
    }
    return false
  }
}

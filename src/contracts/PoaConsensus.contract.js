import helpers from './helpers'
import { constants } from '../utils/constants'

export default class PoaConsensus {
  async init({ web3, netId, addresses }) {
    const { POA_ADDRESS } = addresses
    console.log('POA Address ', POA_ADDRESS)

    const poaConsensusAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'PoaNetworkConsensus')

    this.instance = new web3.eth.Contract(poaConsensusAbi, POA_ADDRESS)
  }
  async getValidators() {
    console.log(this.instance)
    return await this.instance.methods.getValidators().call()
  }
  async isMasterOfCeremonyRemoved() {
    if (this.instance.methods.isMasterOfCeremonyRemoved) {
      return await this.instance.methods.isMasterOfCeremonyRemoved().call()
    }
    return false
  }
}

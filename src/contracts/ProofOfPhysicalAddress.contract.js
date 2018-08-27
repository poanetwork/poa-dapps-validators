import Web3 from 'web3'
import helpers from './helpers'

export default class ProofOfPhysicalAddress {
  async init({ web3, netId, addresses }) {
    let web3_10 = new Web3(web3.currentProvider)
    const { PROOF_OF_PHYSICAL_ADDRESS } = addresses
    console.log(`popa address: ${PROOF_OF_PHYSICAL_ADDRESS}`)

    const branch = helpers.getBranch(netId)
    let proofOfPhysicalAddressAbi = await helpers.getABI(branch, 'ProofOfPhysicalAddress')
    this.instance = new web3_10.eth.Contract(proofOfPhysicalAddressAbi, PROOF_OF_PHYSICAL_ADDRESS)

    this.getAddressesCount = this.getAddressesCount.bind(this)
    this.getUserConfirmedAddresses = this.getUserConfirmedAddresses.bind(this)
    this.getAddressIndexAndConfirmationStatus = this.getAddressIndexAndConfirmationStatus.bind(this)
    this.getPhysicalAddressesByIndexes = this.getPhysicalAddressesByIndexes.bind(this)
  }

  /**
   * Resolves to the number of confimed physical addresses of the given wallet address.
   * @param {String} walletAddress
   * @param {boolean} walletAddress
   * @return {Promise}
   */
  async getAddressesCount(walletAddress, getUserConfirmed) {
    const method = getUserConfirmed ? 'userConfirmedAddressesCount' : 'userSubmittedAddressesCount'
    const count = await this.instance.methods[method](walletAddress).call()
    return Number.parseInt(count, 10)
  }

  /**
   * Given a walletAddress, return a promise that resolves to an array of result
   * sets of confirmed addresses from PoBA contract.
   * @param {String} walletAddress
   * @return {Promise}
   */
  async getUserConfirmedAddresses(walletAddress) {
    try {
      const confirmedCount = await this.getAddressesCount(walletAddress, true)

      let result = []
      if (confirmedCount > 0) {
        const submittedCount = await this.getAddressesCount(walletAddress, false)
        // Get an array representing index => isConfirmed
        const addressConfirmedStatuses = await this.getAddressIndexAndConfirmationStatus(walletAddress, submittedCount)
        // Convert an array of indexes of confirmed-addresses-only (i.e. [3,7])
        const addressConfirmedIndexes = []
        addressConfirmedStatuses.forEach((isConfirmed, index) => {
          if (isConfirmed) {
            addressConfirmedIndexes.push(index)
          }
        })
        result = await this.getPhysicalAddressesByIndexes(walletAddress, addressConfirmedIndexes)
      }

      return result
    } catch (e) {
      console.error(`Error in getUserConfirmedAddresses ${walletAddress}`, e)
      throw e
    }
  }

  /**
   * Resolves to an array with the confirmed status of the address in the
   * corresponding PhysicalAddress[] index (in the contract).
   * @param {String} walletAddress
   * @param {Integer} submittedCount
   * @return {Promise}
   */
  async getAddressIndexAndConfirmationStatus(walletAddress, submittedCount) {
    try {
      const promises = []
      for (let i = 0; i < submittedCount; i++) {
        promises.push(this.instance.methods.userAddressConfirmed(walletAddress, i).call())
      }
      return await Promise.all(promises)
    } catch (e) {
      console.log(`Error getAddressIndexAndConfirmationStatus(${walletAddress}, ${submittedCount})`, e)
      throw e
    }
  }

  /**
   * Resolves to an array of PhysicalAddress representation (check the contract
   * ABI). Each PhysicalAddress is fetch by its wallet address and its
   * corresponding index.
   * @param {String} walletAddress
   * @param {[Integer]} physicalAddressIndexesArray
   * @return {Promise}
   */
  async getPhysicalAddressesByIndexes(walletAddress, physicalAddressIndexesArray) {
    try {
      const promises = physicalAddressIndexesArray.map(physicalAddressIndex =>
        this.instance.methods.userAddress(walletAddress, physicalAddressIndex).call()
      )
      return await Promise.all(promises)
    } catch (e) {
      console.log(`Error getPhysicalAddressesByIndexes(${walletAddress}, ${physicalAddressIndexesArray})`, e)
      throw e
    }
  }
}

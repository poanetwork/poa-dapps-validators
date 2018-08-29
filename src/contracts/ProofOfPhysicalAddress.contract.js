import Web3 from 'web3'
import helpers from './helpers'

const CONFIRM_ADDRESS_EVENT_NAME = 'LogAddressConfirmed'

export default class ProofOfPhysicalAddress {
  async init({ web3, netId, addresses }) {
    let web3_10 = new Web3(web3.currentProvider)
    const { PROOF_OF_PHYSICAL_ADDRESS } = addresses

    const branch = helpers.getBranch(netId)
    if (branch !== 'core') {
      throw new Error(`ProofOfPhysicalAddress contract not deployed network "${branch}"`)
    }
    let proofOfPhysicalAddressAbi = await helpers.getABI(branch, 'ProofOfPhysicalAddress')
    this.instance = new web3_10.eth.Contract(proofOfPhysicalAddressAbi, PROOF_OF_PHYSICAL_ADDRESS)

    this.filterValidatorsWithConfirmAddressEvent = this.filterValidatorsWithConfirmAddressEvent.bind(this)
    this.getAddressesCount = this.getAddressesCount.bind(this)
    this.getUserConfirmedAddresses = this.getUserConfirmedAddresses.bind(this)
    this.getAddressIndexAndConfirmationStatus = this.getAddressIndexAndConfirmationStatus.bind(this)
    this.getPhysicalAddressesByIndexes = this.getPhysicalAddressesByIndexes.bind(this)
    this.getAllEvents = this.getAllEvents.bind(this)
  }

  /**
   * Filter the given validators array by leaving only the elements whose wallet address generated,
   * at least, one PoPA LogAddressConfirmed event.
   * @param  {Object[]} validatorArray
   * @return {Object[]}
   */
  async filterValidatorsWithConfirmAddressEvent(validatorArray) {
    const confirmAddressEvents = await this.getAllEvents(CONFIRM_ADDRESS_EVENT_NAME)
    const validatorArrayWithConfirmedAddress = validatorArray.filter(validator => {
      const hasConfirmedAddress = confirmAddressEvents.some(
        confirmAddressEvent => confirmAddressEvent.returnValues.wallet === validator.address
      )
      return hasConfirmedAddress
    })
    return validatorArrayWithConfirmedAddress
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
    let result = []
    try {
      // Get an array representing index => isConfirmed
      const confirmedCount = await this.getAddressesCount(walletAddress, true)
      if (confirmedCount > 0) {
        const addressConfirmedStatuses = await this.getAddressIndexAndConfirmationStatus(walletAddress, confirmedCount)
        // Convert an array of indexes of confirmed-addresses-only (i.e. [3,7])
        let addressConfirmedIndexes = []
        addressConfirmedStatuses.forEach((isConfirmed, index) => {
          if (isConfirmed) {
            addressConfirmedIndexes.push(index)
          }
        })
        result = await this.getPhysicalAddressesByIndexes(walletAddress, addressConfirmedIndexes)
      }
    } catch (e) {
      console.error(`Error in getUserConfirmedAddresses ${walletAddress}`, e)
    } finally {
      return result
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
      let promises = []
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

  /**
   * Get all event objects, with the given eventName.
   * @param {String} eventName
   * @return {Promise}
   */
  async getAllEvents(eventName) {
    let result = []
    try {
      result = await this.instance.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' })
    } catch (e) {
      console.error(e)
    }
    return result
  }
}

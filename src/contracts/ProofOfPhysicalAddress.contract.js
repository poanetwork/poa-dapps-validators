import Web3 from 'web3'
import helpers from './helpers'

const REGISTER_ADDRESS_EVENT_NAME = 'LogAddressRegistered'

export default class ProofOfPhysicalAddress {
  async init({ web3, netId, addresses }) {
    let web3_10 = new Web3(web3.currentProvider)
    const { PROOF_OF_PHYSICAL_ADDRESS } = addresses

    const branch = helpers.getBranch(netId)
    if (branch !== 'core') {
      throw new Error(`ProofOfPhysicalAddress contract not deployed on network "${branch}"`)
    }
    let proofOfPhysicalAddressAbi = await helpers.getABI(branch, 'ProofOfPhysicalAddress')
    this.instance = new web3_10.eth.Contract(proofOfPhysicalAddressAbi, PROOF_OF_PHYSICAL_ADDRESS)

    this.getPhysicalAddressesOfWalletAddressArray = this.getPhysicalAddressesOfWalletAddressArray.bind(this)
    this.getAllEvents = this.getAllEvents.bind(this)
    this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray = this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray.bind(
      this
    )
  }

  /**
   * Given a wallet address array, return a promise that resolves to an array of physical addresses from
   * PoPA contract.
   * @param {String[]} walletAddressArray
   * @return {Promise}
   */
  async getPhysicalAddressesOfWalletAddressArray(walletAddressArray) {
    let result = []
    try {
      const registeredAddressEvents = await this.getAllEvents(REGISTER_ADDRESS_EVENT_NAME)
      const allPhysicalAddressesPromises = walletAddressArray.map(walletAddress => {
        let physicalAddresses = null
        let keccakIdentifiers = registeredAddressEvents
          .filter(event => event.returnValues.wallet === walletAddress)
          .map(event => event.returnValues.keccakIdentifier)

        if (keccakIdentifiers.length > 0) {
          physicalAddresses = this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray(
            walletAddress,
            keccakIdentifiers
          ).then(physicalAddresses => {
            return physicalAddresses.length > 0 ? physicalAddresses : null
          })
        }
        return Promise.resolve(physicalAddresses)
      })
      result = await Promise.all(allPhysicalAddressesPromises)
    } catch (e) {
      console.error(`Error in getPhysicalAddressesOfWalletAddressArray`, e)
    }
    return result
  }

  /**
   * Given a walletAddress and an array of keccakIdentifiers, return a promise that resolves to an array
   * of the corresponding confirmed and unconfirmed physical addresses, or an empty array (unregistered
   * addresses are not included).
   * @param  {String}  walletAddress
   * @param  {String[]}  keccakIdentifierArray
   * @return {Promise}
   */
  async getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray(walletAddress, keccakIdentifierArray) {
    let promises = keccakIdentifierArray.map(keccakIdentifier => {
      return this.instance.methods
        .userAddressByKeccakIdentifier(walletAddress, keccakIdentifier)
        .call()
        .then(async addressStatusTuple => {
          const addressFound = addressStatusTuple[0]
          const addressIndex = addressStatusTuple[1]
          const addressConfirmed = addressStatusTuple[2]
          if (addressFound === false) {
            return null
          } else {
            return {
              isConfirmed: addressConfirmed,
              data: await this.instance.methods.userAddress(walletAddress, addressIndex).call()
            }
          }
        })
        .catch(e => {
          console.error(`Error in getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray`, e)
          return null
        })
    })
    let physicalAddressArray = await Promise.all(promises)
    return physicalAddressArray.filter(address => address !== null)
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

import Web3 from 'web3'
import helpers from './helpers'
import { constants } from './constants'

const getWeb3 = (forcedNetId, onAccountChange) => {
  return new Promise(function(resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async function() {
      let web3 = null

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        console.log('Injected web3 detected.')
        try {
          await window.ethereum.enable()
        } catch (e) {
          reject({ message: 'You have denied access to your accounts' })
          return
        }
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider)
        console.log('Injected web3 detected.')
      }

      let errorMsg = null
      let netIdName
      let netId
      let injectedWeb3 = web3 !== null
      let defaultAccount = null

      if (web3) {
        const accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0] || null

        if (!defaultAccount) {
          console.error('Unlock your wallet')
        }

        let currentNetwork = (await web3.eth.net.getId()).toString()
        let currentAccount = defaultAccount ? defaultAccount.toLowerCase() : ''
        web3.currentProvider.publicConfigStore.on('update', function(obj) {
          const id = obj.networkVersion
          const account = obj.selectedAddress
          if (!document.hidden && id !== 'loading' && id !== currentNetwork) {
            currentNetwork = id
            if (id in constants.NETWORKS) {
              window.localStorage.netId = id
            }
          }
          if (account && account !== currentAccount) {
            currentAccount = account
            onAccountChange(account)
          }
        })
      }

      if (!web3 && !(forcedNetId in constants.NETWORKS)) {
        forcedNetId = ''
      }

      if (web3) {
        const web3NetId = await web3.eth.net.getId()
        if (web3NetId === forcedNetId || (!forcedNetId && web3NetId in constants.NETWORKS)) {
          netId = web3NetId

          if (!(netId in constants.NETWORKS)) {
            netIdName = 'ERROR'
            errorMsg = `You aren't connected to POA Network.
                Please, switch to POA Network and refresh the page.
                Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>Wiki</a> for more info.`
            console.log('This is an unknown network.')
          } else {
            netIdName = constants.NETWORKS[netId].NAME
            console.log(`This is ${netIdName}`)
          }
        } else {
          web3 = null
        }
      }

      if (!web3) {
        if (forcedNetId && forcedNetId in constants.NETWORKS) {
          netId = forcedNetId
        } else if (window.location.host.indexOf(constants.branches.SOKOL) !== -1) {
          netId = helpers.netIdByName(constants.branches.SOKOL)
        } else if (window.location.host.indexOf(constants.branches.KOVAN) !== -1) {
          netId = helpers.netIdByName(constants.branches.KOVAN)
        } else if (window.location.host.indexOf(constants.branches.DAI) !== -1) {
          netId = helpers.netIdByName(constants.branches.DAI)
        } else {
          netId = helpers.netIdByName(constants.branches.CORE)
        }

        const network = constants.NETWORKS[netId]

        web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
        netIdName = network.NAME
      }

      document.title = `${netIdName} - POA Validators DApp`

      if (errorMsg !== null) {
        reject({ message: errorMsg })
        return
      }

      resolve({
        web3Instance: web3,
        netId,
        netIdName,
        injectedWeb3,
        defaultAccount
      })
    })
  })
}

const setWeb3 = netId => {
  window.localStorage.netId = netId
  const provider = new Web3.providers.HttpProvider(constants.NETWORKS[netId].RPC)
  return new Web3(provider)
}

export { getWeb3, setWeb3 }

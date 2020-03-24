import { constants } from '../utils/constants'

function addressesURL(branch) {
  if (branch === constants.branches.DAI) {
    branch = 'ce2c77256f0d37fc48baa9b6cab806261d034785'
  }
  const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/${
    constants.addressesSourceFile
  }`
  console.log(URL)
  return URL
}

function ABIURL(branch, contract) {
  if (branch === constants.branches.DAI) {
    branch = 'ce2c77256f0d37fc48baa9b6cab806261d034785'
  }
  const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/abis/${
    constants.ABIsSources[contract]
  }`
  console.log(URL)
  return URL
}

function getABI(branch, contract) {
  let addr = helpers.ABIURL(branch, contract)
  return fetch(addr).then(function(response) {
    return response.json()
  })
}

const helpers = {
  addressesURL,
  ABIURL,
  getABI
}

export default helpers

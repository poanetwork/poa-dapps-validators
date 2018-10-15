import { constants } from '../constants'

function addressesURL(branch) {
  const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/${
    constants.addressesSourceFile
  }`
  console.log(URL)
  return URL
}

function ABIURL(branch, contract) {
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

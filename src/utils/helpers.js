import swal from 'sweetalert'
import { constants } from './constants'

function generateAlert(icon, title, msg) {
  var content = document.createElement('div')
  content.innerHTML = `<div style="line-height: 1.6;">${msg}</div>`
  swal({
    icon: icon,
    title: title,
    content: content
  })
}

function isCompanyAllowed(netId) {
  switch (netId) {
    case netIdByName(constants.branches.DAI):
    case netIdByName(constants.branches.KOVAN):
      return true
    default:
      return false
  }
}

function netIdByName(netName) {
  const netNameLowerCase = netName.toLowerCase()
  for (let netId in constants.NETWORKS) {
    if (constants.NETWORKS[netId].NAME.toLowerCase() === netNameLowerCase) {
      return Number(netId)
    }
  }
  return null
}

const helpers = {
  generateAlert,
  isCompanyAllowed,
  netIdByName
}

export default helpers

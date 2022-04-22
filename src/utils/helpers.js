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
    case netIdByBranch(constants.branches.KOVAN):
      return true
    default:
      return false
  }
}

function netIdByBranch(branch) {
  for (const netId in constants.NETWORKS) {
    if (constants.NETWORKS[netId].BRANCH === branch) {
      return Number(netId)
    }
  }
  return null
}

const helpers = {
  generateAlert,
  isCompanyAllowed,
  netIdByBranch
}

export default helpers

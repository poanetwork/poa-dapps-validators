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

function netIdByName(netName) {
  const netNameLowerCase = netName.toLowerCase()
  for (let netId in constants.NETWORKS) {
    if (constants.NETWORKS[netId].NAME.toLowerCase() === netNameLowerCase) {
      return netId
    }
  }
  return null
}

module.exports = {
  generateAlert,
  netIdByName
}

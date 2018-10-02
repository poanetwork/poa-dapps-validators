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

function isTestnet(netId) {
  return netId === constants.NETID_SOKOL || netId === constants.NETID_DAI_TEST
}

module.exports = {
  generateAlert,
  isTestnet
}

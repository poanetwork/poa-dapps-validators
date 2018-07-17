import swal from 'sweetalert'

function generateAlert(icon, title, msg) {
  var content = document.createElement('div')
  content.innerHTML = `<div style="line-height: 1.6;">${msg}</div>`
  swal({
    icon: icon,
    title: title,
    content: content
  })
}

let helpers = {
  generateAlert
}

export default helpers

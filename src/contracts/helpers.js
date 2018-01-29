import { constants } from "../constants";
import { messages } from "../messages";
import swal from 'sweetalert';

function addressesURL(branch) {
    const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/${constants.addressesSourceFile}`;
    console.log(URL);
    return URL;
}

function ABIURL(branch, contract) {
    const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/abis/${constants.ABIsSources[contract]}`;
    console.log(URL);
    return URL;
}

function getABI(branch, contract) {
    let addr = helpers.ABIURL(branch, contract);
    return fetch(addr).then(function(response) {
        return response.json();
    })
}

function wrongRepoAlert(addr) {
    var content = document.createElement("div");
    content.innerHTML = `<div>
      Something went wrong!<br/><br/>
      ${messages.wrongRepo(addr)}
    </div>`;
    swal({
      icon: 'error',
      title: 'Error',
      content: content
    });
}

function getBranch(netId) {
    switch (netId) {
        case '77':
            return 'sokol'
        case '99':
            return 'core'
        default:
            return 'core'
    }
}

const helpers = {
    addressesURL,
    ABIURL,
    getABI,
    wrongRepoAlert,
    getBranch
}

export default helpers

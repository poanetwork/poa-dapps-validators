function getValidatorView(validatorAddress, validatorPropsObj) {
	var stateCode = validatorPropsObj["state"].toString();
	return `<div class="validators-i">
    <div class="validators-header">
      0x` + validatorAddress + `
    </div>
    <div class="validators-body">
      <div class="validators-notary left">
        <p class="validators-title">Notary</p>
        <div class="validators-table">
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Full Name
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["fullName"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Address
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["streetName"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              State
            </p>
            <p class="validators-table-td right">
              ` + stateCode + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              Zip Code
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["zip"] + `
            </p>
          </div>
        </div>
      </div>
      <div class="validators-license right">
        <p class="validators-title">Notary license</p>
        <div class="validators-table">
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              License ID
            </p>
            <p class="validators-table-td right">
              ` + validatorPropsObj["licenseID"] + `
            </p>
          </div>
          <div class="validators-table-tr">
            <p class="validators-table-td left">
              License Expiration
            </p>
            <p class="validators-table-td right">
            ` + formatDate(new Date(parseInt(validatorPropsObj["licenseExpiredAt"])*1000), "MM/dd/yyyy"/*"MM/dd/yyyy h:mmTT"*/) + `
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
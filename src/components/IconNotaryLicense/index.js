import React from 'react'

export const IconNotaryLicense = ({ networkBranch }) => {
  return (
    <svg className="sw-IconNotaryLicense" xmlns="http://www.w3.org/2000/svg" width="20" height="24">
      <path
        className={`sw-IconNotaryLicense_Path1 sw-IconNotaryLicense_Path1-${networkBranch}`}
        d="M0 2h19v8H0V2z"
        fillRule="evenodd"
      />
      <path
        className={`sw-IconNotaryLicense_Path2 sw-IconNotaryLicense_Path2-${networkBranch}`}
        d="M19 21h-2a1 1 0 0 1 0-2h1V2H2v17h7a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v19a1 1 0 0 1-1 1zm-4-10h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2zM5 5h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0 8h3a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0-4h3a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm8 4a3 3 0 0 1 3 3 2.99 2.99 0 0 1-2 2.816V23a1 1 0 0 1-2 0v-4.184A2.99 2.99 0 0 1 10 16a3 3 0 0 1 3-3zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        fillRule="evenodd"
      />
    </svg>
  )
}

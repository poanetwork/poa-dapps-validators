import React from 'react'

export const IconConfirm = ({ networkBranch }) => {
  return (
    <svg className="sw-IconConfirm" xmlns="http://www.w3.org/2000/svg" width="19" height="14">
      <path
        className={`sw-IconConfirm_Path sw-IconConfirm_Path-${networkBranch}`}
        d="M17.711 7.767L11.8 13.678a1.045 1.045 0 0 1-1.478-1.478l4.2-4.2H1a1 1 0 0 1 0-2h13.522l-4.233-4.233A1.045 1.045 0 0 1 11.767.289L17.678 6.2c.107.108.17.238.22.371.192.391.138.871-.187 1.196z"
        fillRule="evenodd"
      />
    </svg>
  )
}

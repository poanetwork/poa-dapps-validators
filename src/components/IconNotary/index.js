import React from 'react'

export const IconNotary = ({ networkBranch }) => {
  return (
    <svg className="sw-IconNotary" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path
        className={`sw-IconNotary_Path1 sw-IconNotary_Path1-${networkBranch}`}
        d="M22 24H2a2 2 0 0 1-2-2v-2a8.002 8.002 0 0 1 6.416-7.842C7.285 14.402 9.45 16 12 16c2.551 0 4.715-1.598 5.584-3.842A8.002 8.002 0 0 1 24 20v2a2 2 0 0 1-2 2z"
        fillRule="evenodd"
        opacity=".2"
      />
      <path
        className={`sw-IconNotary_Path2 sw-IconNotary_Path2-${networkBranch}`}
        d="M22 24H2a2 2 0 0 1-2-2v-2a8.002 8.002 0 0 1 6.416-7.842A5.975 5.975 0 0 1 6 10V6a6 6 0 1 1 12 0v4c0 .763-.157 1.487-.416 2.158A8.002 8.002 0 0 1 24 20v2a2 2 0 0 1-2 2zM16 7.143C16 4.303 14.209 2 12 2S8 4.303 8 7.143v1.714C8 11.697 9.791 14 12 14s4-2.303 4-5.143V7.143zM22 20c0-3.174-2.472-5.745-5.591-5.959C15.312 15.237 13.751 16 12 16s-3.312-.763-4.409-1.959C4.472 14.255 2 16.826 2 20v1a1 1 0 0 0 1 1h3v-2a1 1 0 0 1 2 0v2h8v-2a1 1 0 0 1 2 0v2h3a1 1 0 0 0 1-1v-1z"
        fillRule="evenodd"
      />
    </svg>
  )
}

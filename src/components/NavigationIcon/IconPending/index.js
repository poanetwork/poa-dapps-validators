import React from 'react'

export const IconPending = ({ networkBranch }) => {
  return (
    <svg className={`nl-IconPending`} xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path
        className={`nl-IconPending_Path nl-IconPending_Path-${networkBranch}`}
        d="M17 18H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h6a1 1 0 0 1 0 2H2v14h14v-5a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1zm-.579-15.027l-1.425-1.426L16.26.283a1.008 1.008 0 1 1 1.426 1.425l-1.265 1.265zm-8.713 8.713a1.009 1.009 0 0 1-1.425-1.426l7.265-7.264 1.425 1.425-7.265 7.265z"
        fillRule="evenodd"
      />
    </svg>
  )
}

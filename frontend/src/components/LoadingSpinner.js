import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

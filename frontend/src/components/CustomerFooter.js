import React from 'react'

export default function CustomerFooter() {
  return (
    <div className="brief-footer no-print">
      <div className="container-brief">
        <div className="site-info text-center py-4">
          <a href="http://thebluered.co.uk/" title="TheBlueRed" className="text-decoration-none small">
            Proudly powered by theBlueRed
          </a>
          <span style={{ display: "none" }}>
            dev by
            <a href="https://hhgsun.wordpress.com">HHGsun</a>.
          </span>
        </div>
      </div>
    </div>
  )
}

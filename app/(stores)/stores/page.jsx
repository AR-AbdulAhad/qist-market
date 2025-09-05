import Header4 from '@/components/headers/Header4'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
    <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Stores</span>
            </li>
          </ul>
        </div>
      </div>

      Stores
    </>
  )
}

export default page
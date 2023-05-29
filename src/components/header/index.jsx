import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const Header = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    isRoot && (
      <h1 className="home-header">
        <img width={270} src='https://refrigerator-image.s3.ap-northeast-2.amazonaws.com/icon/%E1%84%8C%E1%85%A6%E1%84%86%E1%85%A9%E1%86%A8+6.png'/>
        <Link to={`/`} className="link">
          {title} | 기술블로그
        </Link>
      </h1>
    )
  )
}

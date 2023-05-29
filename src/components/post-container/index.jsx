// import React from 'react'

// export const PostContainer = ({ html }) => (
//   <div dangerouslySetInnerHTML={{ __html: html }} />
// )


import React, { useEffect, useRef } from 'react'

export const PostContainer = ({ html }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const paragraphElements = containerRef.current.querySelectorAll('p')
    paragraphElements.forEach((element) => {
      element.style.marginBottom = '15px' // 원하는 스타일 변경을 여기에 적용하세요
    })
  }, [])

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
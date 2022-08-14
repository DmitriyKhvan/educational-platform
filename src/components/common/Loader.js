import React from 'react'
import * as ReactLoader from 'react-loader-spinner'

const Loader = () => {
  return (
    <ReactLoader
      color='#00BFFF'
      className='align-center'
      type='TailSpin'
      height={80}
      width={80}
    />
  )
}

export default Loader

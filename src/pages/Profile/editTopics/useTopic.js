import React from 'react'

const useTopic = () => {
  const [topic, setTopic] = React.useState([])

  return {
    state: {
      topic,
      setTopic
    }
  }
}

export default useTopic

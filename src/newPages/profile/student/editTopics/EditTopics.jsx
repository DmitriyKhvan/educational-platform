

import React from 'react'
import { Link } from 'react-router-dom';
import Layout from '../../../../components/Layout'

import "./EditTopics.scss";
import Topics from './Topics';

const topicData = [
  {
    id:1231,
    title:"BasketBall",
    isTopic: false
  },
  {
    id:4123,
    title:"K-pop",
    isTopic: false
  },
  {
    id:3123,
    title:"Topic 5",
    isTopic: false
  },
  {
    id:434,
    title:"Topic 3",
    isTopic: false
  },
  {
    id:1123,
    title:"Topic 1",
    isTopic: true
  },
  {
    id:234234,
    title:"Tennis",
    isTopic: false
  },
  {
    id:23523,
    title:"Topic 2",
    isTopic: true
  },
  {
    id:4542,
    title:"Topic 4",
    isTopic: false
  },
]

const EditTopics = () => {
  const [addTopic , setAddTopic] = React.useState(topicData)

  const handleTopic = (id) => {
    setAddTopic(topicData.map(item => {
      if(item.id === id) {
        item.isTopic = !item.isTopic;
        return item
      } else {
        return item
      }
    }))
  }

  return (
    <Layout>
      <div className='edit_topics'>
        <div>
          <h2>Select your interests</h2>
          <p>You can select as many interests as you like.</p>
        </div>

        <div className='topics_inline'>
          {
            addTopic.map(item => <Topics item={item} onHandle={handleTopic}/>)
          }
        </div>

        <div className='topics_footer'>
          <Link to={"/student/profile"}>
            Cancel
          </Link>
          <Link to={"/student/profile"}>
            Save Changes
          </Link>
        </div>

      </div>
    </Layout>
  )
}

export default EditTopics;

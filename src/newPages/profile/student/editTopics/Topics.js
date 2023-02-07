import React from 'react'
import Check from '../../../../assets/images/Checkmark.png';
import AddTopic from '../../../../assets/images/Vector (1).png';

const Topics = ({item, onHandle}) => {
  return (
   <button 
      onClick={() => onHandle(item.id)} 
      className={item.isTopic ?  'topic_button activeTopic' : 'topic_button'}
    >
    {item.title} 

    <img src={!item.isTopic ? AddTopic : Check} alt=''/>
  </button>
  )
}

export default Topics;



import React from 'react'
import { Route, Switch} from 'react-router-dom'
import Layout from '../../components/Layout'
import MessageChat from './Message-chat'
import MessageSidebar from './Message-sidebar'

import './Messaner.scss'

const Messanger = () => {
  return (
    <Layout>
      <div className='message_layout'>
        <MessageSidebar />

        <Switch>
          <Route path={"/messages/chat/:name"} component={MessageChat}/>
        </Switch>
      </div>
    </Layout>
  )
}

export default Messanger

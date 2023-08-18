import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../components/Layout';
import MessageChat from './Message-chat';
import MessageSidebar from './Message-sidebar';

import './Messaner.scss';

const Messanger = () => {
  return (
    <Layout>
      <div className="message_layout">
        <div className="message_sidebar_fixed">
          <MessageSidebar />
        </div>

        <Switch>
          <Route path={'/messages/:chatId'} component={MessageChat} />
        </Switch>
      </div>
    </Layout>
  );
};

export default Messanger;

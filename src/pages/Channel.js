import React from 'react';
import { connect } from 'react-redux';

import { channelMarkRead } from '../redux/actions';

import MessageList from '../components/MessageList';
import Compose from '../components/Compose';

import './Channel.css';

function Channel({ match, channels, markRead }) {
  const channelId = match.params.id;
  const channel = channels.get(channelId);

  // Current channel gets read automatically
  if (channel.messagesRead !== channel.messageCount) {
    markRead({ channelId });
  }

  return <div className='channel-container'>
    <header className='channel-info'>
      <div className='channel-info-container'>
        <div className='channel-name'>#{channel.name}</div>
      </div>
    </header>
    <MessageList channelId={channelId}/>
    <footer className='channel-compose'>
      <Compose channelId={channelId}/>
    </footer>
  </div>;
}

const mapStateToProps = (state) => {
  return {
    channels: state.channels,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    markRead: (...args) => dispatch(channelMarkRead(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);

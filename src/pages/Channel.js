import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  channelMarkRead, loadMessages, toggleSilence, channelUpdateReadHeight,
} from '../redux/actions';

import MessageList from '../components/MessageList';
import Compose from '../components/Compose';

import './Channel.css';

function Channel(props) {
  const {
    match, channels, markRead, loadMessages,
    toggleSilence, updateReadHeight,
  } = props;
  const [ lastChannelId, setLastChannelId ] = useState(null);
  const [ isSticky, setIsSticky ] = useState(false);

  const channelId = match.params.id;
  const channel = channels.get(channelId);
  if (!channel) {
    return null;
  }

  if (lastChannelId !== channelId) {
    if (lastChannelId) {
      markRead({ channelId: lastChannelId });
      updateReadHeight({ channelId: lastChannelId });
    }

    setLastChannelId(channelId);

    // Load only once per channel
    if (channel.messages.length === 0) {
      loadMessages({ channelId });
    }

    // Stick to the bottom on channel change
    setIsSticky(true);
  }

  // Current channel gets read automatically
  markRead({ channelId });

  const onBeforePost = () => {
    // Move view to the bottom when posting
    setIsSticky(true);
  };

  const onToggleSilence = (e) => {
    e.preventDefault();
    toggleSilence({ channelId });
  };

  let silenceTitle;
  let silenceContent;

  if (channel.metadata.isSilenced) {
    silenceTitle = 'Desilence notifications';
    silenceContent = 'desilence';
  } else {
    silenceTitle = 'Silence notifications';
    silenceContent = 'silence';
  }

  return <div className='channel-container'>
    <header className='channel-info'>
      <div className='channel-info-container'>
        <div className='channel-name-container'>
          <div className='channel-name'>#{channel.name}</div>
        </div>
        <div className='channel-silence-container'>
          <button
            title={silenceTitle}
            className='channel-silence button'
            onClick={onToggleSilence}>
            {silenceContent}
          </button>
        </div>
        <div className='channel-delete-container'>
          <Link
            to={`/channel/${channelId}/delete`}
            className='channel-delete button button-danger'>
            delete channel
          </Link>
        </div>
      </div>
    </header>
    <MessageList
      channelName={channel.name}
      readHeight={channel.readHeight}
      messages={channel.messages}
      isSticky={isSticky}
      setIsSticky={setIsSticky}/>
    <footer className='channel-compose'>
      <Compose channelId={channelId} onBeforePost={onBeforePost}/>
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
    loadMessages: (...args) => dispatch(loadMessages(...args)),
    toggleSilence: (...args) => dispatch(toggleSilence(...args)),
    updateReadHeight: (...args) => dispatch(channelUpdateReadHeight(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);

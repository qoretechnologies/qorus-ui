import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';


import { fetchJson } from 'store/api/utils';
import settings from 'settings';
import { pureRender } from 'components/utils';


const MAX_TRIES = 10;


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };


  constructor(props) {
    super(props);

    this._token = null;
    this._socket = null;
    this._scroll = null;

    this.toggleAutoscroll = this.toggleAutoscroll.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.checkAutoscroll = this.checkAutoscroll.bind(this);
  }


  componentWillMount() {
    this.setState({
      log: '',
      autoscroll: true,
      pause: false,
      error: null
    });
    this.connect();
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.workflow.workflowid === nextProps.workflow.workflowid) {
      return;
    }

    this.disconnect();

    this.setState({
      log: '',
      error: null
    });
    this.connect();
  }


  componentDidUpdate() {
    if (this.state.autoscroll) {
      this._scroll.scrollTop =
        this._scroll.scrollHeight - this._scroll.clientHeight;
    }
  }


  componentWillUnmount() {
    this.disconnect();
  }


  async connect(tries = 0) {
    if (tries >= MAX_TRIES) {
      this.setState({ error: 'Connection dropped.' });
      this.disconnect();
      return;
    }

    if (!this._token) {
      try {
        this._token = await fetchJson(
          'GET',
          `${settings.REST_API_PREFIX}/system?action=wstoken`
        );
      } catch (e) {
        this._token = null;
        this.setState({ error: e });
        return;
      }
    }

    if (this._socket) this.disconnect();
    this._socket = new WebSocket(
      settings.WS_API_PREFIX +
      `/log/workflows/${this.props.workflow.workflowid}` +
      `?token=${this._token}`
    );
    this._socket.onmessage = this.chunkReceived.bind(this);
    this._socket.onclose = this.connect.bind(this, tries + 1);
    this._socket.onerror = this.socketError.bind(this);
  }


  disconnect() {
    if (!this._socket) return;

    this._socket.onerror = null;
    this._socket.onclose = null;
    this._socket.close();
    this._socket = null;
    this._token = null;
  }


  socketError(ev) {
    this.setState({ error: ev });
    this.disconnect();
  }


  chunkReceived(ev) {
    if (this.state.pause) return;

    this.setState({ log: this.state.log + ev.data + '\n' });
  }


  toggleAutoscroll() {
    this.setState({ autoscroll: !this.state.autoscroll });
  }


  checkAutoscroll() {
    if (!this.state.autoscroll) return;

    if (this._scroll.scrollTop <
        this._scroll.scrollHeight - this._scroll.clientHeight) {
      this.setState({ autoscroll: false });
    }
  }


  togglePause() {
    if (!this.state.pause) {
      this.setState({
        log: `${this.state.log}-- Paused --\n`,
        pause: true
      });
    } else {
      this.setState({
        log: `${this.state.log}-- Continue --\n`,
        pause: false
      });
    }
  }


  render() {
    const refScroll = c => this._scroll = c;

    return (
      <div>
        <Controls>
          <Control
            label='Autoscroll'
            btnStyle={this.state.autoscroll ? 'success' : null}
            icon='check'
            action={this.toggleAutoscroll}
          />
          <Control
            label='Pause'
            btnStyle={this.state.pause ? 'success' : null}
            icon='pause'
            action={this.togglePause}
          />
        </Controls>
        {this.state.error && (
          <div className='alert alert-danger' role='alert'>
            {'' + this.state.error}
          </div>
        )}
        <div className='log-area'>
          <pre
            className='language-log'
            ref={refScroll}
            onScroll={this.checkAutoscroll}
          >
            <code className='language-log'>{this.state.log}</code>
          </pre>
        </div>
      </div>
    );
  }
}

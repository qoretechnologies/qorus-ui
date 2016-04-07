import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';
import CollectionSearch from 'components/collection_search';


import { fetchJson } from 'store/api/utils';
import settings from 'settings';
import classNames from 'classnames';
import { pureRender } from 'components/utils';


/**
 * Maximum of reconnect tries to log Web Socket.
 */
const WEBSOCKET_RECONNECT_TRIES = 10;


/**
 * Number of lines to keep in memory.
 *
 * OS X Terminal has a default of 10000 lines, but those lines 80
 * characters long. Therefore, it is kept lower here as Qorus log
 * lines are usually longer.
 */
const SCROLLBACK_LIMIT = 5000;


/**
 * Log buffer and controls to manipulate it.
 *
 * This tab has following key features:
 *
 * - autoscroll which keeps buffer scroll position at the bottom
 * - pause which stops receiving new log entries
 * - filter which greps log entries and highlights matches
 * - download of currently visible log buffer (with filter applied)
 *
 * Download is provided via data URI scheme. Browsers supported by
 * Qorus have virtually no limit for data URIs therefore there no such
 * limit implemented here.
 */
// TODO refactor Web Sockets code to store.
@pureRender
export default class LogTab extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
  };


  /**
   * Prepares internal state.
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._token = null;
    this._socket = null;
    this._scroll = null;
    this._addingEntries = false;
  }


  /**
   * Initializes default state and connects to log Web Socket.
   *
   * @see connect
   */
  componentWillMount() {
    this.setState({
      lines: 0,
      entries: [],
      filteredEntries: [],
      filter: new RegExp('', 'g'),
      autoscroll: true,
      pause: false,
    });
    this.connect(this.props.model, this.props.resource);
  }


  /**
   * Resets log and connects to different log Web Socket.
   *
   * This happens only if workflow changes.
   *
   * @param {object} nextProps
   * @see connect
   * @see disconnect
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.model.id === nextProps.model.id) {
      return;
    }

    this.disconnect();

    this.setState({
      lines: 0,
      entries: [],
      filteredEntries: [],
    });
    this.connect(nextProps.model, nextProps.resource);
  }


  /**
   * Keeps log buffer scroll position at the bottom.
   *
   * This happens only if autoscroll is enabled.
   */
  componentDidUpdate() {
    if (this.state.autoscroll) {
      this._scroll.scrollTop =
        this._scroll.scrollHeight - this._scroll.clientHeight;
    }
  }


  /**
   * Disconnects from log Web Socket.
   *
   * @see disconnect
   */
  componentWillUnmount() {
    this.disconnect();
  }


  /**
   * Toggles autoscroll.
   */
  onAutoscrollToggle() {
    this.setState({ autoscroll: !this.state.autoscroll });
  }


  /**
   * Toggle pause and adds a status message to the buffer.
   */
  onPauseToggle() {
    if (!this.state.pause) {
      this.setState({ pause: true });
      this.addEntries('-- Paused --', 'comment');
    } else {
      this.setState({ pause: false });
      this.addEntries('-- Continue --', 'comment');
    }
  }


  /**
   * Changes filter.
   *
   * The filter is also applied on the buffer.
   *
   * @param {RegExp} filter
   */
  onFilterChange(filter) {
    const filteredEntries = this.state.entries.filter(
      this.filterEntry.bind(this, filter)
    );

    this.setState({ filter, filteredEntries });
  }


  /**
   * Disables autoscroll if scroll to the top is detected.
   *
   * It checks internal state flag whether the scroll is triggered by
   * new entries comming in. If so, it prevents from losing autoscroll
   * flag and resets that flag.
   *
   * @param {Event} ev
   */
  onBufferScroll(ev) {
    if (this._addingEntries || !this.state.autoscroll) {
      this._addingEntries = false;
      return;
    }

    if (ev.currentTarget.scrollTop <
        ev.currentTarget.scrollHeight - ev.currentTarget.clientHeight) {
      this.setState({ autoscroll: false });
    }
  }


  /**
   * Appends newly received log entries if not paused.
   *
   * @param {Event} ev
   * @see addEntries
   */
  onSocketMessage(ev) {
    if (this.state.pause) return;

    this.addEntries(ev.data);
  }


  /**
   * Stores Web Socket error and disconnects.
   *
   * An event fired by error on Web Socket does not have any
   * diagnostic information so generic error message is used.
   *
   * @see disconnect
   */
  onSocketError() {
    this.addErrorEntry('Connection error');
    this.disconnect();
  }


  /**
   * Returns log filename based on workflow name (or ID).
   *
   * @return {string}
   */
  getLogName() {
    const basename = this.props.model.name ?
      this.props.model.name.toLowerCase() :
      `${this.props.resource}-${this.props.model.id}`;

    return `${basename}.log`;
  }


  /**
   * Returns log buffer as a data URI.
   *
   * @return {string}
   */
  getLogUri() {
    return `data:text/plain;base64,${window.btoa(
      this.state.filteredEntries.
        map(({ entry }) => entry).
        join('\n')
    )}`;
  }


  /**
   * Limits number of entries for the log buffer.
   *
   * If new number of entries (after appending new entries to current
   * ones) is greater than scrollback limit, it throws away entries
   * from the beginning.
   *
   * An entry is considered a line.
   *
   * It returns at least one entry to show something.
   *
   * @param {Array<{ entry: string, no: number, type: string? }>} newEntries
   * @return {Array<{ entry: string, no: number, type: string? }>}
   * @see SCROLLBACK_LIMIT
   */
  limitEntries(newEntries) {
    return this.state.entries.concat(newEntries).slice(
      Math.max(0, Math.min(
        this.state.entries.length + newEntries.length - 1,
        this.state.entries.length + newEntries.length - SCROLLBACK_LIMIT
      ))
    );
  }


  /**
   * Appends new log entries to the buffer.
   *
   * It sets internal state flag to prevent the buffer from losing
   * autoscroll due to event race conditions.
   *
   * @param {string} chunk
   * @param {string?} type
   * @see limitEntries
   */
  addEntries(chunk, type = null) {
    this._addingEntries = true;

    const newEntries = chunk.
      split(/\n/).
      map((entry, delta) => ({
        entry: `${entry}\n`,
        no: this.state.lines + delta,
        type,
      }));
    if (newEntries[newEntries.length - 1].entry === '\n') {
      newEntries.splice(newEntries.length - 1, 1);
    }

    const entries = this.limitEntries(newEntries);

    this.setState({
      lines: this.state.lines + newEntries.length,
      entries,
      filteredEntries: entries.filter(
        this.filterEntry.bind(this, this.state.filter)
      ),
    });
  }


  /**
   * Adds special error entry to log buffer.
   *
   * @param {(Error|string)} reason
   * @see addEntries
   */
  addErrorEntry(reason) {
    this.addEntries(`-- Error: ${reason} --`, 'deleted bold');
  }


  /**
   * Checks if log entry complies with current filter.
   *
   * @param {RegExp} filter
   * @param {string} entry
   * @return {boolean}
   */
  filterEntry(filter, { entry }) {
    return (new RegExp(filter)).test(entry);
  }


  /**
   * Connects to log Web Socket for given workflow.
   *
   * Opened Web Socket tries to reconnect on sudden connection
   * close. It does so by calling this method with number of tries
   * increased. If number of tries is higher then {@link
   * WEBSOCKET_RECONNECT_TRIES}, it stops.
   *
   * @param {{ workflowid: string }} workflow
   * @param {number=} tries
   * @see disconnect
   * @see onSocketMessage
   * @see onSocketError
   */
  async connect(model, resource, tries = 0) {
    if (tries >= WEBSOCKET_RECONNECT_TRIES) {
      this.addErrorEntry('Cannot establish connection');
      this.disconnect();
      return;
    }

    if (!this._token) {
      try {
        this._token = await fetchJson(
          'GET',
          `${settings.REST_BASE_URL}/system?action=wstoken`
        );
      } catch (e) {
        this._token = null;
        this.addErrorEntry(e);
        return;
      }
    }

    if (this._socket) this.disconnect();
    this._socket = new WebSocket(
      `${settings.WS_BASE_URL}` +
      `/log/${resource}/${model.id}` +
      `?token=${this._token}`
    );
    this._socket.onmessage = ::this.onSocketMessage;
    this._socket.onclose = this.connect.bind(this, model, tries + 1);
    this._socket.onerror = ::this.onSocketError;
  }


  /**
   * Removes event handlers and closes current log Web Socket.
   */
  disconnect() {
    if (!this._socket) return;

    this._socket.onerror = null;
    this._socket.onclose = null;
    this._socket.close();
    this._socket = null;
    this._token = null;
  }


  /**
   * Stores reference to scrollable container for later.
   *
   * @param {HTMLElement} el
   */
  refScroll(el) {
    this._scroll = el;
  }


  /**
   * Returns element for given log entry.
   *
   * It finds and highlights matches for current filter.
   *
   * @param {string} entry
   * @param {number} no
   * @param {string?} type
   * @return {ReactElement}
   */
  renderEntry({ entry, no, type }) {
    const filter = new RegExp(this.state.filter);
    const parts = [];

    let prevIndex = filter.lastIndex;
    for (let match = filter.exec(entry);
         match !== null && match.index !== filter.lastIndex;
         match = filter.exec(entry)) {
      if (prevIndex < match.index) {
        parts.push({
          start: prevIndex,
          end: match.index,
          highlight: false,
        });
      }

      parts.push({
        start: match.index,
        end: filter.lastIndex,
        highlight: true,
      });

      prevIndex = filter.lastIndex;
    }

    if (prevIndex < entry.length) {
      parts.push({
        start: prevIndex,
        end: entry.length,
        highlight: false,
      });
    }

    return (
      <div key={no} className={classNames(['token', type])}>
        {parts.map(({ start, end, highlight }) => (
          highlight ? (
            <b key={`${start}.${end}`} className="highlight">
              {entry.substring(start, end)}
            </b>
          ) : (
            <span key={`${start}.${end}`}>
              {entry.substring(start, end)}
            </span>
          )
        ))}
      </div>
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <Controls>
              <Control
                label="Autoscroll"
                btnStyle={this.state.autoscroll ? 'success' : null}
                icon="check"
                action={::this.onAutoscrollToggle}
              />
              <Control
                label="Pause"
                btnStyle={this.state.pause ? 'success' : null}
                icon="pause"
                action={::this.onPauseToggle}
              />
            </Controls>
          </div>
          <div className="col-sm-8">
            <CollectionSearch regexp onChange={::this.onFilterChange}>
              <a
                href={this.getLogUri()}
                download={this.getLogName()}
                className="btn btn-default btn-xs"
                role="button"
              >
                <i className="fa fa-download" />
              </a>
            </CollectionSearch>
          </div>
        </div>
        <div className="log-area">
          <pre
            className="language-log"
            ref={::this.refScroll}
            onScroll={::this.onBufferScroll}
          >
            <code className="language-log">
              {this.state.filteredEntries.map(::this.renderEntry)}
            </code>
          </pre>
        </div>
      </div>
    );
  }
}

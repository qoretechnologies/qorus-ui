import React, { Component, PropTypes } from 'react'

class Navigation extends Component {
  render () {
    return (
      <aside className="affix navigation">
        <nav id="nav-main">
          <ul className="nav nav-list main">
            { this.props.mainItems }
          </ul>
          <ul className="extra">
            { this.props.extraItems }
          </ul>
        </nav>
      </aside>
    )
  }
}

class Root extends Component {
  render () {
    return (
      <div>
        <Navigation mainItems="hello" extraItems="world" />
        <div id="wrap">
          <header id="header" className="navbar navbar-fixed-top navbar-inverse"></header>
          <section className="section container-fluid">
            <div className="row-fluid">
              <section className="span12 page">
                <article id="content">
                  { this.props.children }
                </article>
                <div className="push"></div>
              </section>
            </div>
            <div className="push"></div>
          </section>
        </div>
        <ul id="msg" className="messenger messenger-fixed messenger-on-bottom messenger-on-right messenger-theme-block"></ul>
        <footer id="footer" className="footer">
        <div className="container-fluid">
          <p className="credit muted pull-right">Qorus Integration Engine <small>(Schema: <span id="schema">Unknown</span>)</small>
                    <small>(Version: <span id="build">Unknown</span>)</small> &copy; <a href="http://qoretechnologies.com">Qore Technologies</a> |
                    <a href="http://bugs.qoretechnologies.com/projects/webapp-interface/issues/new">Report Bug</a></p>
        </div>
        </footer>
        <div id="notifications-list"></div>
      </div>
    )
  }
}

export default Root

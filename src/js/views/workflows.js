import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pureRender from 'pure-render-decorator';
import clNs from 'classnames';
import { get, compose, curry } from 'lodash';
import { compare } from '../utils';

// data
import { fetchWorkflows, setAutostart } from '../store/workflows/actions';
import { ORDER_STATES } from '../constants/orders';

// components
import Toolbar from '../components/toolbar';
import Table, { Col } from '../components/table';
import Badge from '../components/badge';
import AutoStart from '../components/autostart';
import Loader from '../components/loader';


class Dummy extends Component {
  render() {
    return null;
  }
}

const DateFilterView = Dummy;
const SearchFormView = Dummy;
const Filters = Dummy;

class WorkflowsToolbar extends Component {
  render() {
    const btnCls = clNs('btn', 'btn-default', 'btn-sm');

    return (
      <Toolbar>
        <div className='workflows-toolbar btn-toolbar sticky toolbar'>
          <div className='btn-group'>
            <button
              className={ clNs(btnCls, 'dropdown-toggle') }
              data-toggle='dropdown'>
              <i className='fa fa-square-o check-all checker'></i>&nbsp;
              <span className='caret'></span>
            </button>
            <ul className='dropdown-menu above'>
              <li><a href='#' className='check-all'>All</a></li>
              <li><a href='#' className='uncheck-all'>None</a></li>
              <li><a href='#' className='invert'>Invert</a></li>
              <li><a href='#' className='running'>Running</a></li>
              <li><a href='#' className='stopped'>Stopped</a></li>
            </ul>
          </div>
          <div className={ clNs('btn-group') }>
            <button className={ btnCls }>
              <i className='fa fa-off'></i> Enable
            </button>
            <button className={ btnCls }>
              <i className='fa fa-ban-circle'></i> Disable
            </button>
            <button className={ btnCls }>
              <i className='fa fa-refresh'></i> Reset
            </button>
            <button className={ btnCls }>
              <i className='fa fa-flag-alt'></i> Hide
            </button>
            <button className={ btnCls }>
              <i className='fa fa-flag'></i> Show
            </button>
          </div>
          <DateFilterView
            filters={ null }
            handleSubmitData={ null }
            setDate={ null } />
          <Filters
            setDeprecated={ null }
            filters={ null }/>
          <div className='pull-right'>
            <SearchFormView
              filterText={ null }
              filterChange={ null } />
          </div>
        </div>
        <div className='datepicker-container'></div>
      </Toolbar>
    );
  }
}

const filterSearch = curry((search, workflows) =>
  workflows.filter(w =>
    search === undefined || w.name.toLowerCase().indexOf(search) > -1 ||
    w.id.toString().indexOf(search) > -1)
);

const filterDeprecated = curry((hide, workflows) =>
  workflows.filter(w =>
    !hide || get(w, 'deprecated') === hide
  )
);

const sortWorkflows = (workflows) =>
  workflows.slice().sort(compare('exec_count', ['name'], 'des'));

const workflowsSelector = state => state.api.workflows;
const searchSelector = (state, props) => props.location.query.q;
const infoSelector = (state) => { return {}; };
const deprecatedSelector = (state, props) => props.params.filter === 'hide';

const collectionSelector = createSelector(
  [
    searchSelector,
    workflowsSelector,
    deprecatedSelector
  ],
  (search, workflows, deprecated) => compose(
    sortWorkflows,
    filterDeprecated(deprecated),
    filterSearch(search)
  )(workflows.data)
);

const viewSelector = createSelector(
  [
    workflowsSelector,
    infoSelector,
    collectionSelector
  ],
  (workflows, info, collection) => {
    return {
      sync: workflows.sync,
      loading: workflows.loading,
      workflows: collection,
      info: {}
    };
  }
);

@pureRender
@connect(viewSelector)
class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    workflows: PropTypes.array,
    info: PropTypes.object,
    sync: PropTypes.bool,
    loading: PropTypes.bool
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(fetchWorkflows());
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate() {
    this.setTitle();
  }

  setTitle() {
    const { info } = this.props;

    const inst = info['instance-key'] ? info['instance-key'] : 'Qorus';

    document.title = `Workflows | ${inst}`;
  }

  renderTable() {
    const { workflows, dispatch } = this.props;
    const cls = clNs([
      'table', 'table-striped', 'table-condensed',
      'table-hover', 'table-fixed'
    ]);

    return (
      <Table collection={ workflows } className={ cls }>
        <Col name='' className='narrow'>
          <i className='fa fa-square-o' />
        </Col>
        <Col name='Actions' className='narrow'>
          <a className='label label-warning'>
            <i className='fa fa-power-off' />
            </a>
          <a className='label label-success'><i className='fa fa-refresh' /></a>
        </Col>
        <Col name='Autostart'
          transMap={{ autostart: 'autostart', exec_count: 'execCount'}}
          className='narrow'>
          <AutoStart
            inc={ (id, value) => dispatch(setAutostart(id, value)) }
            dec={ (id, value) => dispatch(setAutostart(id, value)) } />
        </Col>
        <Col name='Execs' dataKey='exec_count' className='narrow' />
        <Col name='ID' dataKey='id' className='narrow' />
        <Col name='Name' dataKey='name' className='name' cellClassName='name' />
        <Col name='Version' dataKey='version' className='narrow' />
        {
          ORDER_STATES.map(state => {
            let transMap;
            const { name, short, label } = state;

            transMap = {};
            transMap[name] = 'val';

            return (
              <Col name={ short }
                className='narrow'
                cellClassName='narrow'
                transMap={ transMap }
                key={ name }>
                <Badge label={ label } />
              </Col>
            );
          })
        }
        <Col name='Total' dataKey='TOTAL' className='narrow' />
      </Table>
    );
  }

  render() {
    const { sync, loading  } = this.props;

    if (!sync || loading) {
      return <Loader />;
    }

    return (
      <div>
        <WorkflowsToolbar />
        { this.renderTable() }
      </div>
    );
  }
}

export default Workflows;

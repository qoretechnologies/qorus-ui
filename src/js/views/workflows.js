import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { pureRender } from '../components/utils';
import clNs from 'classnames';
import { get, compose, curry, omit } from 'lodash';
import { compare, makeUrl } from 'utils';
import history from 'history';

// data
// import { fetchWorkflows, setAutostart } from 'store/api/workflows/actions';
import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';

// components
import Toolbar from 'components/toolbar';
import Table, { Col } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';
import Loader from 'components/loader';
import { PaneView } from 'components/pane';

const workflowsActions = actions.workflows;

class Dummy extends Component {
  render() {
    return null;
  }
}

const setAutostart = (id, value) => {
  const params = {
    body: JSON.stringify({
      action: 'setAutostart',
      autostart: value
    })
  };

  return workflowsActions.action(params, id);
};

const DateFilterView = Dummy;
const SearchFormView = Dummy;
const Filters = Dummy;

const defaultRouteParams = {
  date: '24h',
  filter: 'all',
  detailId: '',
  tabId: ''
};

// @pureRender
class WorkflowsTable extends Component {
  static propTypes = {
    workflows: PropTypes.array,
    detId: PropTypes.number
  }

  static contextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
    params: PropTypes.object
  }

  render() {
    const { workflows } = this.props;
    const { dispatch, route } = this.context;
    const cls = clNs([
      'table', 'table-striped', 'table-condensed',
      'table-hover', 'table-fixed'
    ]);

    const rowClick = (id) => {
      let detailId;
      const params = this.context.params;
      const currentParams = omit(params, p => p);

      if (params.detailId && parseInt(params.detailId, 10) === id) {
        detailId = null;
      } else {
        detailId = id;
      }

      const newParams = Object.assign(
        {},
        defaultRouteParams,
        {
          currentParams,
          detailId: detailId
        }
      );
      const url = makeUrl(route.path, newParams);
      history.pushState(null, `/${url}`);
    };

    return (
      <Table collection={ workflows } className={ cls } rowClick={ rowClick }>
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
}

@pureRender
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
const infoSelector = () => { return {}; };
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
    loading: PropTypes.bool,
    params: PropTypes.object,
    route: PropTypes.object
  }

  static childContextTypes = {
    params: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(workflowsActions.fetch());
  }

  getChildContext() {
    return {
      params: this.props.params,
      route: this.props.route,
      dispatch: this.props.dispatch
    };
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

  renderPane() {
    // console.log(this.props.params.detailId);
    const { params, route, workflows } = this.props;

    if (params.detailId) {
      const workflow = workflows.find(w => {
        return w.id === parseInt(params.detailId, 10);
      });

      return (
        <PaneView width={ 500 } onClose={ () => {
          const url = makeUrl(route.path, omit(params, 'detailId'));
          history.pushState(null, `/${url}`);
        }}>
        <h3>{ workflow.normalizedName }</h3>
        </PaneView>
      );
    }

    return null;
  }

  render() {
    const { sync, loading, workflows } = this.props;

    if (!sync || loading) {
      return <Loader />;
    }

    return (
      <div>
        <WorkflowsToolbar />
      <WorkflowsTable workflows={ workflows } />
        { this.renderPane() }
      </div>
    );
  }
}

export default Workflows;

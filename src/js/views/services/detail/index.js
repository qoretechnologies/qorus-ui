import React, { Component, PropTypes } from 'react';
// import Tabs, { Pane } from 'components/tabs';
import ServicesHeader from './header';


import { pureRender } from 'components/utils';


import goTo from 'routes';
import actions from 'store/api/actions';


@pureRender
export default class ServicesDetail extends Component {
  /* TODO: get if errors are applicable for Services */
  static propTypes = {
    service: PropTypes.object.isRequired,
    // errors: PropTypes.array.isRequired,
    systemOptions: PropTypes.array.isRequired,
    // globalErrors: PropTypes.array.isRequired,
    tabId: PropTypes.string,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
    router: PropTypes.object,
    route: PropTypes.object,
    params: PropTypes.object,
  };


  componentWillMount() {
    this.setState({ lastModelId: null });
    this.loadDetailedDataIfChanged(this.props);
  }


  componentWillReceiveProps(nextProps) {
    this.loadDetailedDataIfChanged(nextProps);
  }


  loadDetailedDataIfChanged(props) {
    if (this.state && this.state.lastWorkflowId === props.service.id) {
      return;
    }

    this.setState({ lastModelId: props.service.id });

    // this.context.dispatch(
    //   actions.errors.fetch(`service/${props.service.id}`)
    // );

    // this.context.dispatch(
    //   actions.services.fetchLibSources(props.service)
    // );
  }


  changeTab(tabId) {
    goTo(
      this.context.router,
      'services',
      this.context.route.path,
      this.context.params,
      { tabId }
    );
  }


  render() {
    const { service } = this.props;

    if (!service) return null;

    return (
      <article className="svc">
        <ServicesHeader service={service} />
        {/* <Tabs
          className="svc"
          active={tabId}
          tabChange={::this.changeTab}
        >
          <Pane name="Detail">
            <DetailTab workflow={workflow} systemOptions={systemOptions} />
          </Pane>
          <Pane name="Library">
            <LibraryTab workflow={workflow} />
          </Pane>
          <Pane name="Steps">
            <StepsTab workflow={workflow} />
          </Pane>
          <Pane name="Log">
            <LogTab workflow={workflow} />
          </Pane>
          <Pane name="Errors">
            <ErrorsTab
              workflow={workflow}
              errors={errors}
              globalErrors={globalErrors}
            />
          </Pane>
          <Pane name="Mappers" />
          <Pane name="Info">
            <InfoTab workflow={workflow} />
          </Pane>
        </Tabs> */}
      </article>
    );
  }
}

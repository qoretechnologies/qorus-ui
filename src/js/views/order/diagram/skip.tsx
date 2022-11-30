import { ReqoreMessage, ReqoreModal, ReqoreSpacer } from '@qoretechnologies/reqore';
import { Component } from 'react';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message

export default class extends Component {
  props: any = this.props;

  componentWillMount() {
    this.setState({
      value: this.props.ind,
      error: false,
    });
  }

  handleSkipClick = () => {
    this.skipStep(true);
  };

  handleSkipRetryClick = () => {
    this.skipStep(false);
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
  };

  skipStep = (type) => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    this.props.onSubmit(this.state.value, type);
    this.props.onClose();
  };

  render() {
    return (
      <ReqoreModal
        isOpen
        blur={3}
        width="400px"
        label="Skip step index"
        onClose={this.props.onClose}
        bottomActions={[
          {
            label: 'Skip',
            onClick: this.handleSkipClick,
            icon: 'CheckFill',
            position: 'right',
            intent: 'success',
            minimal: false,
          },
          {
            label: 'Skip and Retry',
            onClick: this.handleSkipClick,
            icon: 'CheckDoubleFill',
            position: 'right',
            intent: 'success',
            minimal: false,
          },
        ]}
      >
        <ReqoreMessage intent="info" inverted>
          You are about to skip step index {this.props.ind}
        </ReqoreMessage>
        <ReqoreSpacer height={10} />
      </ReqoreModal>
    );
  }
}

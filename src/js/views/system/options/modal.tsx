/* @flow */
import {
  ReqoreDropdown,
  ReqoreH4,
  ReqoreInput,
  ReqoreMessage,
  ReqoreModal,
  ReqorePanel,
  ReqoreSpacer,
  ReqoreTag,
  ReqoreTagGroup,
  ReqoreTextarea,
} from '@qoretechnologies/reqore';
import { Component } from 'react';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

@withDispatch()
export default class OptionModal extends Component {
  props: any = this.props;

  state: {
    value: any;
    listValue?: any;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
    value: this.props.model.value,
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleInputChange: Function = (event: EventHandler): void => {
    this.setState({
      value: event.target.value,
    });
  };

  handleDropdownItemClick: Function = (value: any): void => {
    this.setState({
      value,
    });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit = (event?: any): void => {
    this.props.dispatchAction(
      actions.systemOptions.setOption,
      this.props.model.name,
      this.state.value,
      this.props.onClose
    );
  };

  renderValue() {
    const { model } = this.props;
    let min;
    let max;

    // if (model.expects === 'list') {
    //   return (
    //     <>
    //       <ReqoreTagGroup>
    //         {((this.state.value as Array<string>) || []).map((item: any) => (
    //           <ReqoreTag
    //             key={item}
    //             label={item}
    //             onRemoveClick={() =>
    //               this.setState({ value: this.state.value.filter((val) => val !== item) })
    //             }
    //           />
    //         ))}
    //       </ReqoreTagGroup>
    //       <ReqoreControlGroup fluid>
    //         <ReqoreInput
    //           placeholder="Add new value"
    //           onChange={(e: any) => this.setState({ listValue: e.target.value })}
    //           value={this.state.listValue}
    //         />
    //         <ReqoreButton
    //           fixed
    //           onClick={() =>
    //             this.setState({
    //               value: [...((this.state.value as Array<string>) || []), this.state.listValue],
    //               listValue: '',
    //             })
    //           }
    //           intent="info"
    //         >
    //           Add
    //         </ReqoreButton>
    //       </ReqoreControlGroup>
    //     </>
    //   );
    // }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'expects' does not exist on type 'Object'... Remove this comment to see the full error message
    switch (this.props.model.expects) {
      case 'bool':
        return (
          <ReqoreDropdown
            items={[
              {
                label: 'true',
                value: 'true',
                icon: 'CheckLine',
                onClick: () => this.handleDropdownItemClick('true'),
                selected: this.state.value?.toString() === 'true',
              },
              {
                label: 'false',
                value: 'false',
                icon: 'CloseLine',
                onClick: () => this.handleDropdownItemClick('false'),
                selected: this.state.value?.toString() === 'false',
              },
            ]}
            label={this.state?.value?.toString() || 'Nothing'}
          />
        );
      case 'integer':
        // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
        if (model.interval) {
          min =
            // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
            model.interval[0] > model.interval[1]
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[1]
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[0];
          max =
            // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
            model.interval[1] === 'UNLIMITED'
              ? Number.MAX_SAFE_INTEGER
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
              model.interval[1] > model.interval[0]
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[1]
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[0];
        }

        return (
          <ReqoreInput
            type="number"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
            onChange={this.handleInputChange}
            value={this.state.value}
            min={min}
            max={max}
          />
        );
      default:
        return (
          <ReqoreTextarea
            type="text"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
            onChange={this.handleInputChange}
            scaleWithContent
            value={this.state.value?.toString()}
          />
        );
    }
  }

  render() {
    const { model, onClose } = this.props;

    return (
      <ReqoreModal
        isOpen
        label={model.name}
        onClose={onClose}
        flat
        width="500px"
        blur={3}
        bottomActions={[
          {
            label: 'Save',
            onClick: this.handleFormSubmit,
            intent: 'success',
            icon: 'CheckFill',
            position: 'right',
            minimal: false,
          },
        ]}
      >
        <ReqoreMessage intent="info" inverted>
          {model.desc}
        </ReqoreMessage>
        <ReqoreSpacer height={10} />
        <ReqoreTagGroup>
          <ReqoreTag labelKey="Expects:" label={model.expects} icon="CodeBoxLine" />
          {model.interval && (
            <ReqoreTag
              labelKey="Interval:"
              label={JSON.stringify(model.interval)}
              icon="TimeFill"
            />
          )}
        </ReqoreTagGroup>
        <ReqoreSpacer height={20} />
        <ReqoreH4>Default Value</ReqoreH4>
        <ReqoreSpacer height={10} />
        <ReqorePanel contentSize="small">
          {model.default ? model.default.toString() : 'null'}
        </ReqorePanel>
        <ReqoreSpacer height={20} />
        <ReqoreH4>Current Value</ReqoreH4>
        <ReqoreSpacer height={10} />
        {this.renderValue()}
      </ReqoreModal>
    );
  }
}

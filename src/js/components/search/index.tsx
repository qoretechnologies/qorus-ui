/* @flow */
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreDropdown,
  ReqoreInput,
} from '@qoretechnologies/reqore';
import { IReqoreDropdownItem } from '@qoretechnologies/reqore/dist/components/Dropdown/list';
import { debounce, includes } from 'lodash';
import { Component } from 'react';
import { injectIntl } from 'react-intl';

class Search extends Component<any, any> {
  props: any = this.props;

  state: {
    query: string;
    history: boolean;
  } = {
    query: this.props.defaultValue || '',
    history: false,
  };

  _input: any;

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'defaultValue' does not exist on type 'Ob... Remove this comment to see the full error message
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'defaultValue' does not exist on type 'Ob... Remove this comment to see the full error message
        query: nextProps.defaultValue || '',
      });
    }
  }

  delayedSearch: Function = debounce((value: string): void => {
    this.props.onSearchUpdate(value, false);
  }, 1000);

  /**
   * Handles input changes, event is persisted
   * and the search is performed after a debounce
   * timeout
   *
   * @see componentWillMount
   * @param {Event} event
   */
  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleInputChange = (event: EventHandler): void => {
    event.persist();

    const { value } = event.target;
    const hit = this.props.searches
      ? this.props.searches.filter((qry: string): boolean => includes(qry, value) && value !== qry)
      : false;

    this.setState({
      query: value,
      history: value && value.length >= 2 && hit && hit.length > 0,
    });

    this.delayedSearch(value);
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.setState({
      history: false,
    });

    this.props.onSearchUpdate(this.state.query, true);
  };

  handleClearClick: Function = (): void => {
    this.setState({
      query: '',
    });

    this.props.onSearchUpdate('');
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleHistoryClick = (query: string): void => {
    this.setState({
      query,
      history: false,
    });

    this.delayedSearch(query);
  };

  renderHistoryItems = (): IReqoreDropdownItem[] => {
    if (!this.props.searches) return null;

    const searches: Array<string> = this.props.searches.filter(
      (qry: string): boolean => includes(qry, this.state.query) && this.state.query !== qry
    );

    return searches.map((qry: string, index: number) => ({
      value: qry,
      onClick: () => this.handleHistoryClick(qry),
    }));
  };

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._input = ref;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'focusOnMount' does not exist on type '{ ... Remove this comment to see the full error message
      if (this.props.focusOnMount) {
        this._input.focus();
      }
    }
  };

  render() {
    const { searches } = this.props;

    return (
      <form
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onSubmit={this.handleFormSubmit}
        className={`${this.props.pullLeft ? '' : 'pull-right'}`}
      >
        <ReqoreControlGroup stack>
          {searches && searches.length !== 0 ? (
            <ReqoreDropdown icon="HistoryLine" items={this.renderHistoryItems()} filterable flat />
          ) : null}
          <ReqoreInput
            onClearClick={() => this.handleClearClick()}
            id="search"
            onChange={this.handleInputChange}
            value={this.state.query}
            placeholder={this.props.intl.formatMessage({ id: 'component.search' })}
          />
          {/* @ts-expect-error */}
          <ReqoreButton flat type="submit" icon="SearchLine" />
        </ReqoreControlGroup>
      </form>
    );
  }
}

export default injectIntl(Search as any) as any;

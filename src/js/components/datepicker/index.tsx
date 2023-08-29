import { ReqoreControlGroup, ReqoreInput, ReqorePopover } from '@qoretechnologies/reqore';
import { IReqoreIconName } from '@qoretechnologies/reqore/dist/types/icons';
import moment from 'moment';
import { memo, useEffect, useMemo, useState } from 'react';
import { injectIntl } from 'react-intl';
import { useMount } from 'react-use';
import compose from 'recompose/compose';
import { DATES, DATE_FORMATS } from '../../constants/dates';
import { formatDate } from '../../helpers/workflows';
import Button from '../controls/control';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from '../dropdown';
import Calendar from './calendar';
import Picker from './picker';

type Props = {
  date: string;
  onApplyDate: (date: string) => void;
  futureOnly?: boolean;
  noButtons?: boolean;
  applyOnBlur?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  small?: boolean;
  icon?: IReqoreIconName;
  disabled?: boolean;
};

const DatePicker = memo((props: Props) => {
  const [state, setState] = useState<any>({
    date: moment(),
    inputDate: moment().format(DATE_FORMATS.DISPLAY),
    activeDate: moment(),
    hours: undefined,
    defaultHours: undefined,
    minutes: undefined,
    defaultMinutes: undefined,
    popoverData: undefined,
  });
  useMount(() => {
    console.log('mounted');
    setupDate(props);
  });

  useEffect(() => {
    console.log('DATE HAS CHANGED', props.date);
    setupDate(props);
  }, [props.date]);

  const setupDate = (props: Props): void => {
    const date: any = props.date ? formatDate(props.date) : moment();
    const inputDate: string = props.date
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'.
        date.format(DATE_FORMATS.DISPLAY)
      : '';

    setState({
      ...state,
      date,
      inputDate,
      activeDate: date,
      hours: date.hours(),
      defaultHours: date.hours(),
      minutes: date.minutes(),
      defaultMinutes: date.minutes(),
    });
  };

  const setDate = (date: any): void => {
    console.log('DATE', date);
    setState({
      ...state,
      date,
    });
  };

  const setActiveDate = (activeDate: any): void => {
    console.log('ACTIVE DATE', activeDate);
    const { hours, minutes } = state;
    const { futureOnly } = props;
    const potentialDate = activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
    potentialDate.minutes(minutes);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
    potentialDate.hours(hours);

    if (!futureOnly || moment().isSameOrBefore(potentialDate)) {
      console.log('SETTING ACTIVE DATE ACTUALLY LOL', activeDate);
      setState({
        ...state,
        activeDate,
      });
    }
  };

  const applyDate = (date: string): void => {
    props.onApplyDate(date);
    //state.popoverData?.close();
  };

  const handleHoursChange = (event: any): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    const hours: string = event.target.value;
    const activeDate: any = state.activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
    activeDate.hours(hours);

    setState({
      ...state,
      activeDate,
      hours,
    });
  };

  const handleMinutesChange = (event: any): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    const minutes: string = event.target.value;
    const activeDate: any = state.activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
    activeDate.minutes(minutes);

    setState({
      ...state,
      activeDate,
      minutes,
    });
  };

  const handleResetClick = (): void => {
    setState({
      ...state,
      hours: state.defaultHours,
      minutes: state.defaultMinutes,
    });
  };

  const handleApplyClick = (): void => {
    const date: string = state.activeDate.format(DATE_FORMATS.URL_FORMAT);

    applyDate(date);
  };

  const handleAllClick = (): void => {
    applyDate(DATES.ALL);
  };

  const handleWeekClick = (): void => {
    applyDate(DATES.WEEK);
  };

  const handleMonthClick = (): void => {
    applyDate(DATES.MONTH);
  };

  const handleThirtyClick = (): void => {
    applyDate(DATES.THIRTY);
  };

  const handleNowClick = (): void => {
    applyDate(DATES.NOW);
  };

  const handle24hClick = (): void => {
    applyDate(DATES.PREV_DAY);
  };

  const handleTodayClick = (): void => {
    applyDate(DATES.TODAY);
  };

  const handleInputChange = (event: any): void => {
    setState({
      ...state,
      inputDate: event.target.value,
    });
  };

  const handleApplyDate = (): void => {
    if (state.inputDate === '') {
      applyDate('');
    } else {
      const date: any = new Date(state.inputDate);

      if (moment(date).isValid()) {
        applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
      }
    }
  };

  const { futureOnly, noButtons, small, className, icon, disabled } = props;
  const activeDate = useMemo(
    () => moment(new Date(state.activeDate)).format(DATE_FORMATS.URL_FORMAT),
    [state.activeDate]
  );

  console.log('THE ACTIVE DATE FROM NEW RERENDER STATE', activeDate);

  return (
    <ReqoreControlGroup stack rounded={false} fluid>
      <ReqorePopover
        component={ReqoreInput}
        componentProps={{
          onBlur: props.applyOnBlur ? handleApplyDate : null,
          value: state.inputDate,
          onChange: handleInputChange,
          placeholder: props.placeholder,
          disabled: props.disabled,
          icon: icon || 'CalendarLine',
          rounded: false,
          fluid: true,
        }}
        isReqoreComponent
        handler="focus"
        content={
          <Picker
            minutes={state.minutes}
            hours={state.hours}
            onAllClick={handleAllClick}
            on24hClick={handle24hClick}
            onApplyClick={handleApplyClick}
            onResetClick={handleResetClick}
            onMinutesChange={handleMinutesChange}
            onHoursChange={handleHoursChange}
            futureOnly={props.futureOnly}
          >
            <Calendar
              futureOnly={props.futureOnly}
              date={state.date}
              setDate={setDate}
              activeDate={state.activeDate}
              setActiveDate={setActiveDate}
            />
          </Picker>
        }
      />

      {!futureOnly && !noButtons && (
        <Button
          // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
          text={props.intl.formatMessage({ id: 'datetime.all' })}
          onClick={handleAllClick}
          big={!small}
          disabled={disabled}
        />
      )}
      {!futureOnly && !noButtons && (
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        <Dropdown disabled={disabled}>
          {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ small: boolean; }' is missing the followin... Remove this comment to see the full error message */}
          <DropdownControl small={small} />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({ id: 'datetime.now' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleNowClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({ id: 'datetime.today' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleTodayClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({ id: 'datetime.24h' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handle24hClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({ id: 'datetime.week' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleWeekClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({
              id: 'datetime.this-month',
            })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleMonthClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={props.intl.formatMessage({ id: 'datetime.30-days' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onClick={handleThirtyClick}
          />
        </Dropdown>
      )}
    </ReqoreControlGroup>
  );
});

export default compose(injectIntl)(DatePicker);

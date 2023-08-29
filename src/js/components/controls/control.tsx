/* @flow */
import { ReqoreButton, ReqoreIntents } from '@qoretechnologies/reqore';
import classNames from 'classnames';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

const intentTransform = {
  success: ReqoreIntents.SUCCESS,
  danger: ReqoreIntents.DANGER,
  info: ReqoreIntents.INFO,
  primary: undefined,
  default: null,
  warning: ReqoreIntents.WARNING,
};

type Props = {
  title?: string;
  label?: string;
  btnStyle: string;
  icon?: string;
  iconName?: string;
  action?: () => void;
  handleClick?: () => void;
  onClick?: () => void;
  stopPropagation?: boolean;
  disabled?: boolean;
  big?: boolean;
  type?: string;
  css?: any;
  id?: string;
  className?: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children?: any;
  intent?: string;
  text?: any;
  isTablet?: boolean;
  loading?: boolean;
};

const Control: Function = ({
  id,
  className,
  title,
  handleClick,
  disabled,
  type,
  css,
  iconName,
  text,
  intent,
  isTablet,
  loading,
  big,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ReqoreButton
    id={id}
    className={className}
    title={isTablet ? text : title}
    onClick={handleClick}
    disabled={disabled}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type '"submit" ... Remove this comment to see the full error message
    type={type}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
    icon={iconName}
    label={isTablet ? (iconName ? undefined : text) : text}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
    intent={intent}
    style={{
      ...css,
    }}
    size={big ? 'normal' : 'small'}
    loading={loading}
  />
);

export default compose(
  mapProps(
    ({
      className,
      big,
      icon,
      iconName,
      text,
      label,
      children,
      intent,
      btnStyle,
      ...rest
    }: Props): Props => ({
      className: classNames(className, {
        'bp3-small': !big,
      }),
      big,
      iconName: icon || iconName,
      text: text || label || children,
      // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
      intent: intent || intent === 0 ? intent : intentTransform[btnStyle],
      btnStyle,
      ...rest,
    })
  ),
  withHandlers({
    handleClick:
      ({ action, onClick, stopPropagation }: Props): Function =>
      (event: any): void => {
        const act: Function = action || onClick;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
        if (!stopPropagation) event.stopPropagation();

        if (act) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
          event.preventDefault();
          act(event);
        }
      },
  }),
  pure([
    'className',
    'title',
    'disabled',
    'type',
    'style',
    'icon',
    'label',
    'children',
    'big',
    'btnStyle',
    'intent',
    'iconName',
    'isTablet',
    'text',
    'loading',
  ])
)(Control as any) as any;

// @flow

type FlexProps = {
  children: any;
  display?: string;
  flexFlow?: string;
  flex?: string;
  height?: any;
  className?: string;
  style?: any;
  scrollX?: boolean;
  scrollY?: boolean;
  flexRef?: Function;
  id?: string;
};

const Flex: Function = ({
  children,
  display = 'flex',
  flexFlow = 'column',
  flex = '1 1 auto',
  height,
  style,
  className,
  scrollX,
  scrollY,
  flexRef,
  id,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'FlexProps... Remove this comment to see the full error message
  title,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
FlexProps) => (
  <div
    title={title}
    style={{
      display,
      flexFlow,
      flex,
      height,
      overflowX: scrollX ? 'auto' : 'hidden',
      overflowY: scrollY ? 'auto' : 'hidden',
      ...style,
    }}
    id={id || undefined}
    ref={(ref) => flexRef && flexRef(ref)}
    className={className}
  >
    {children}
  </div>
);

export default Flex;

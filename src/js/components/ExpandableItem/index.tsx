import { setupPreviews } from '@previewjs/plugin-react/setup';
import { ReqorePanel } from '@qoretechnologies/reqore';
import { IReqorePanelAction } from '@qoretechnologies/reqore/dist/components/Panel';
import Spacer from '../Spacer';

type Props = {
  children: any;
  title?: string;
  show?: boolean;
  label?: IReqorePanelAction[];
};

const ExpandableItem = ({ children, show, title, label }: Props) => (
  <>
    <ReqorePanel
      label={title}
      isCollapsed={!show}
      rounded
      padded
      flat
      collapsible={true}
      actions={label ? label : undefined}
      style={{ flex: '0 auto', minHeight: '40px', flexShrink: 0 }}
    >
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {typeof children === 'function' ? children() : children}
      </div>
    </ReqorePanel>
    <Spacer size={10} />
  </>
);

setupPreviews(ExpandableItem, () => ({
  Basic: {
    children: <p>Hello</p>,
  },
}));

export default ExpandableItem;

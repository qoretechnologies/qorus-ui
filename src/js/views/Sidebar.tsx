import { setupPreviews } from '@previewjs/plugin-react/setup';
import { ReqoreSidebar } from '@qoretechnologies/reqore';
import { IQorusSidebarProps } from '@qoretechnologies/reqore/dist/components/Sidebar';
import { defaultMenu } from '../store/ui/menu/reducers';

export interface ISidebarProps extends IQorusSidebarProps {}

export const Sidebar = (props: ISidebarProps) => {
  return <ReqoreSidebar {...props} />;
};

setupPreviews(Sidebar, {
  Basic: {
    items: defaultMenu.data,
    path: '/',
    useNativeTitle: true,
  },
});

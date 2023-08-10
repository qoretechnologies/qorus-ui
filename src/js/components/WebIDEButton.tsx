import { ReqoreButton, ReqoreControlGroup } from '@qoretechnologies/reqore';
import { WEB_IDE_URL } from '../../server_config';
import { isFeatureEnabled } from '../helpers/functions';

export interface IWebIDEButtonProps {
  big?: boolean;
  id: string | number;
  type: string;
}

export const WebIDEButton = ({ big, id, type }: IWebIDEButtonProps) => {
  if (!isFeatureEnabled('WEB_IDE')) {
    return null;
  }

  return (
    <ReqoreControlGroup>
      <ReqoreButton
        tooltip="Edit in Web IDE"
        size={big ? undefined : 'small'}
        icon="CodeLine"
        onClick={() => {
          window.location.href = `${WEB_IDE_URL}new/${type}/${id}?origin=${window.location.href}`;
        }}
      />
    </ReqoreControlGroup>
  );
};

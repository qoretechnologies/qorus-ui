import { WEB_IDE_URL } from '../../server_config';
import { isFeatureEnabled } from '../helpers/functions';
import { Control as Button, Controls as ButtonGroup } from './controls';

export const WebIDEButton = ({ big, id, type }) => {
  console.log(process.env, process.env.REACT_APP_WEB_IDE, isFeatureEnabled('WEB_IDE'));

  if (!isFeatureEnabled('WEB_IDE')) {
    return null;
  }

  return (
    <ButtonGroup>
      <Button
        title="Edit in Web IDE"
        icon="code-block"
        big={big}
        onClick={() => {
          window.location.href = `${WEB_IDE_URL}new/${type}/${id}?origin=${window.location.href}`;
        }}
      />
    </ButtonGroup>
  );
};

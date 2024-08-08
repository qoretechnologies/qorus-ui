// @flow
import { ReqoreModal, ReqoreTextarea, useReqoreProperty } from '@qoretechnologies/reqore';
import React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { generateCSV } from '../helpers/table';
import modal from './modal';

export default (collection: string, name: string): Function =>
  (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    Component
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ) => {
    const CSVWrapper = (props) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const addNotification = useReqoreProperty('addNotification');

      const handleCSVClick = (): void => {
        setIsOpen(true);
      };

      const handleCopy = async (): Promise<void> => {
        try {
          await navigator.clipboard.writeText(`${generateCSV(props[collection], name)}`);
          addNotification({
            intent: 'success',
            title: 'Copied to clipboard',
            content: 'The CSV data has been copied to your clipboard',
            duration: 2000,
            opaque: true,
          });
        } catch (e) {
          addNotification({
            intent: 'danger',
            title: 'Failed to copy to clipboard',
            content: 'The CSV data could not be copied to your clipboard',
            opaque: true,
            duration: 4000,
          });
        }
      };

      return (
        <>
          {isOpen && (
            <ReqoreModal
              isOpen
              label="Export data as CSV"
              onClose={() => setIsOpen(false)}
              fill
              height='400px'
              bottomActions={[
                {
                  label: 'Copy',
                  position: 'right',
                  intent: 'info',
                  icon: 'ClipboardLine',
                  onClick: async () => {
                    handleCopy();
                  },
                },
                {
                  label: 'Copy and close',
                  position: 'right',
                  intent: 'success',
                  icon: 'ClipboardFill',
                  onClick: async () => {
                    handleCopy();
                    setIsOpen(false);
                  },
                },
              ]}
            >
              <ReqoreTextarea
                fluid
                style={{ height: '100%', resize: 'none' }}
                wrapperStyle={{ height: '100%' }}
                readOnly
                id="CSV-modal-text"
                value={`${generateCSV(props[collection], name)}`}
              />
            </ReqoreModal>
          )}
          <Component onCSVClick={handleCSVClick} {...props} />
        </>
      );
    };

    return compose(modal(), injectIntl)(CSVWrapper);
  };

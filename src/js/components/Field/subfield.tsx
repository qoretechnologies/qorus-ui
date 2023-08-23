import { ReqoreMessage, ReqorePanel } from '@qoretechnologies/reqore';
import { IReqorePanelAction } from '@qoretechnologies/reqore/dist/components/Panel';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Spacer from '../Spacer';

export interface ISubFieldProps {
  title?: string;
  desc?: string;
  children: any;
  subtle?: boolean;
  onRemove?: () => any;
  detail?: string;
  isValid?: boolean;
}

export const StyledSubFieldMarkdown: any = styled.div`
  display: 'inline-block';

  p:last-child {
    margin-bottom: 0;
  }

  p:first-child {
    margin-top: 0;
  }
`;

const SubField: React.FC<any> = ({
  title,
  desc,
  children,
  subtle,
  onRemove,
  detail,
  isValid,
  defaultShowInfo,
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(defaultShowInfo);

  let actions: IReqorePanelAction[] = onRemove
    ? [{ onClick: onRemove, icon: 'DeleteBin6Line' }]
    : [];

  if (desc || detail) {
    actions.unshift({
      onClick: () => setShowInfo(!showInfo),
      icon: showInfo ? 'InformationFill' : 'InformationLine',
      intent: showInfo ? 'info' : undefined,
    });
  }

  return (
    <>
      {title && (
        <ReqorePanel
          flat
          padded
          rounded
          minimal
          label={title}
          actions={actions}
          headerSize={4}
          collapsible
          icon={!isValid ? 'AlertLine' : undefined}
          unMountContentOnCollapse={false}
        >
          {showInfo && (desc || detail) ? (
            <>
              <ReqorePanel flat rounded padded>
                <ReqoreMessage
                  intent="muted"
                  size="small"
                  flat
                  title={detail ? `<${detail} />` : undefined}
                >
                  <StyledSubFieldMarkdown>
                    <ReactMarkdown>{desc}</ReactMarkdown>
                  </StyledSubFieldMarkdown>
                </ReqoreMessage>
              </ReqorePanel>
              <Spacer size={10} />
            </>
          ) : null}
          {children}
        </ReqorePanel>
      )}
    </>
  );
};

export default SubField;

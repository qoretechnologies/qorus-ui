import { IDialogProps } from '@blueprintjs/core';
import { ReqoreModal, ReqoreModalContent } from '@qoretechnologies/reqore';
import { IReqoreModalProps } from '@qoretechnologies/reqore/dist/components/Modal';
import React from 'react';

export interface ICustomDialogProps extends IDialogProps {
  children: any;
  noBottomPad?: boolean;
}

const CustomDialog: React.FC<IReqoreModalProps> = ({ children, ...rest }) => {
  return (
    <ReqoreModal {...rest}>
      <ReqoreModalContent>{children}</ReqoreModalContent>
    </ReqoreModal>
  );
};

export default CustomDialog;

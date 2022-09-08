import { IDialogProps } from '@blueprintjs/core';
import { ReqoreModal } from '@qoretechnologies/reqore';
import { IReqoreModalProps } from '@qoretechnologies/reqore/dist/components/Modal';
import React from 'react';

export interface ICustomDialogProps extends IDialogProps {
  children: any;
  noBottomPad?: boolean;
}

const CustomDialog: React.FC<IReqoreModalProps> = ({ children, ...rest }) => {
  return <ReqoreModal {...rest}>{children}</ReqoreModal>;
};

export default CustomDialog;

import { setupPreviews } from '@previewjs/plugin-react/setup';
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreH2,
  ReqorePanel,
  ReqoreTag,
  ReqoreTree,
} from '@qoretechnologies/reqore';
import size from 'lodash/size';
import Spacer from '../../../components/Spacer';

export type IQorusType =
  | 'string'
  | 'int'
  | 'list'
  | 'bool'
  | 'float'
  | 'binary'
  | 'hash'
  | 'date'
  | 'any'
  | 'auto'
  | 'mapper'
  | 'workflow'
  | 'service'
  | 'job'
  | 'select-string'
  | 'data-provider'
  | 'file-as-string'
  | 'number';

export type TOperatorValue = string | string[] | undefined | null;

export type TOption = {
  type: IQorusType;
  value: any;
  op?: TOperatorValue;
};

export type IOptions =
  | {
      [optionName: string]: TOption;
    }
  | undefined;

export type TApiManagerFactory = 'swagger' | 'soap';
export type TApiManagerEndpointType = 'fsm' | 'method';
export type TApiManagerOptions = IOptions;
export type TApiManagerEndpoint = {
  endpoint: string;
  type?: TApiManagerEndpointType;
  value?: string;
};

export interface IApiManager {
  factory: TApiManagerFactory;
  'provider-options'?: TApiManagerOptions;
  endpoints?: TApiManagerEndpoint[];
}

export interface IApiManagerProps extends IApiManager {
  onEndpointClick: (codeItem: string) => any;
}

export const ApiManager = ({
  endpoints,
  factory,
  'provider-options': providerOptions,
  onEndpointClick,
}: IApiManagerProps) => {
  return (
    <div>
      <ReqoreH2>
        API Manager <ReqoreTag label={factory.toUpperCase()} size="small" />
      </ReqoreH2>
      <Spacer size={15} />
      <ReqorePanel rounded flat padded label={`Endpoints (${endpoints.length})`}>
        {endpoints.map((endpoint: TApiManagerEndpoint, index: number) => (
          <>
            <ReqoreControlGroup key={index}>
              <ReqoreTag label={(index + 1).toString()} />
              <ReqoreTag label={endpoint.endpoint} intent="success" />
              <ReqoreTag label={endpoint.type} intent="warning" />
              <ReqoreButton
                icon="ShareBoxLine"
                intent="info"
                onClick={() => onEndpointClick(endpoint.value)}
              >
                {endpoint.value}
              </ReqoreButton>
            </ReqoreControlGroup>
            {index !== size(endpoints) - 1 && <Spacer size={15} />}
          </>
        ))}
      </ReqorePanel>
      <Spacer size={15} />
      <ReqorePanel rounded flat padded label={`Options (${size(providerOptions)})`}>
        <ReqoreTree data={providerOptions} />
      </ReqorePanel>
    </div>
  );
};

setupPreviews(ApiManager, {
  Basic: {
    factory: 'swagger',
    endpoints: [
      {
        endpoint: '*/api/v1/swagger/',
        type: 'fsm',
        value: 'http://localhost:8080/api/v1/swagger/',
      },
      {
        endpoint: '*/api/v1/swagger/',
        type: 'method',
        value: 'http://localhost:8080/api/v1/swagger/',
      },
    ],
    'provider-options': {
      schema: {
        type: 'file-as-string',
        value: 'resource://swagger_schema.yaml',
      },
      'root-uri': {
        type: 'string',
        value: 'test',
      },
    },
  },
});

import { setupPreviews } from '@previewjs/plugin-react/setup';
import {
  ReqoreControlGroup,
  ReqoreMessage,
  ReqoreTabs,
  ReqoreTabsContent,
  ReqoreTag,
} from '@qoretechnologies/reqore';
import { AnyARecord } from 'dns';
import { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import Spacer from '../Spacer';
import AutoField from './auto';
import Select from './select';
import { default as String, default as StringField } from './string';

const templatesList = [
  'local',
  'timestamp',
  'rest',
  'qore-expr',
  'static',
  'dynamic',
  'sensitive',
  'sensitive-alias',
  'temp',
  'step',
  'keys',
  'transient',
  'config',
  'info',
  'parse-value',
  'pstate',
  'state',
  'qore-expr-value',
];

/**
 * It checks if a string starts with a dollar sign, contains a colon, and if the text between the
 * dollar sign and the colon matches a template from the list
 * @param {string} value - The string to check if it's a template
 * @returns A function that takes a string and returns a boolean.
 */
export const isValueTemplate = (value?: any) => {
  if (typeof value !== 'string' || !value?.startsWith('$') || !value?.includes(':')) {
    return false;
  }
  // Get everything between first $ and first colon
  const template = value.substring(value.indexOf('$') + 1, value.indexOf(':'));
  // Check if the template matches a template from the list
  return templatesList.includes(template);
};

/**
 * It returns the key of a template string, or null if the string is not a template
 * @param {string} [value] - The value to check.
 * @returns The key of the template.
 */
export const getTemplateKey = (value?: string) => {
  if (value && isValueTemplate(value)) {
    return value.substring(value.indexOf('$') + 1, value.indexOf(':'));
  }

  return null;
};

/**
 * It returns the value of a template string, or null if the value is not a template string
 * @param {string} [value] - The value to check.
 * @returns The value of the template.
 */
export const getTemplateValue = (value?: string) => {
  if (value && isValueTemplate(value)) {
    return value.substring(value.indexOf(':') + 1);
  }
  return null;
};

export const TemplateField = ({ value, name, onChange, component: Comp, readOnly, ...rest }) => {
  const [isTemplate, setIsTemplate] = useState<boolean>(isValueTemplate(value));
  const [templateKey, setTemplateKey] = useState<string | null>(getTemplateKey(value));
  const [templateValue, setTemplateValue] = useState<string | null>(getTemplateValue(value));

  // When template key or template value change run the onChange function
  useUpdateEffect(() => {
    if (templateKey && templateValue) {
      onChange?.(name, `$${templateKey}:${templateValue}`);
    }
  }, [templateKey, templateValue]);

  if (readOnly) {
    if (isTemplate) {
      return <StringField value={value} name={name} onChange={onChange} disabled />;
    } else {
      return <Comp value={value} onChange={onChange} name={name} {...rest} readOnly />;
    }
  }

  return (
    <ReqoreTabs
      size="small"
      activeTab={isTemplate ? 'template' : 'custom'}
      tabs={[
        {
          id: 'custom',
          label: 'Custom',
        },
        {
          id: 'template',
          label: 'Template',
          icon: 'QuestionLine',
          tooltip: 'Use template instead of a literal value',
        },
      ]}
      onTabChange={(newTabId: any): void => {
        const currentTab = isTemplate ? 'template' : 'custom';

        if (newTabId === 'custom') {
          setIsTemplate(false);
          setTemplateKey(null);
          setTemplateValue(null);
        } else {
          setIsTemplate(true);
        }

        if (currentTab !== newTabId) {
          onChange(name, null);
        }
      }}
    >
      <ReqoreTabsContent tabId="custom">
        <Comp value={value} onChange={onChange} name={name} {...rest} />
      </ReqoreTabsContent>
      <ReqoreTabsContent tabId={'template'}>
        <ReqoreMessage
          size="small"
          intent="info"
          inverted
        >{`${'Templates are in format: '} $<type>:<key>`}</ReqoreMessage>
        <Spacer size={5} />
        <ReqoreControlGroup fluid stack>
          <ReqoreTag
            label="$"
            color="#d7d7d7"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <Select
            defaultItems={templatesList.map((template) => ({ name: template }))}
            onChange={(_n, val) => setTemplateKey(val)}
            value={templateKey}
            icon="dollar"
          />
          <ReqoreTag label=":" color="#d7d7d7" style={{ borderRadius: 0 }} />
          <String
            fill
            type="string"
            name="templateVal"
            value={templateValue}
            onChange={(_n, val) => setTemplateValue(val)}
          />
        </ReqoreControlGroup>
      </ReqoreTabsContent>
    </ReqoreTabs>
  );
};

const PreviewTemplate = (props: any) => {
  const [value, setValue] = useState<AnyARecord>(props.value);

  return (
    <TemplateField
      component={AutoField}
      {...props}
      value={value}
      onChange={(_name, val) => setValue(val)}
    />
  );
};

setupPreviews(PreviewTemplate, {
  Default: {
    name: 'Default',
    value: undefined,
  },
});

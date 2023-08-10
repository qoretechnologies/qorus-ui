import { Callout } from '@blueprintjs/core';
import { ReqoreButton, ReqoreControlGroup } from '@qoretechnologies/reqore';
import { FunctionComponent, useEffect, useState } from 'react';
import useMount from 'react-use/lib/useMount';
import ConnectorField from '../DataproviderSelector';
import BooleanField from './boolean';
import DateField from './date';
import LongStringField from './longString';
import NumberField from './number';
import OptionHashField from './optionHash';
import SelectField from './select';
import StringField from './string';
import { getTypeFromValue, getValueOrDefaultValue, maybeParseYaml } from './validations';

const AutoField: FunctionComponent<any> = ({
  name,
  onChange,
  value,
  default_value,
  defaultType,
  defaultInternalType,
  requestFieldData,
  type,
  noSoft,
  readOnly,
  ...rest
}) => {
  const [currentType, setType] = useState<string>(defaultInternalType || null);
  const [currentInternalType, setInternalType] = useState<string>(defaultInternalType || 'any');
  const [isSetToNull, setIsSetToNull] = useState<boolean>(false);

  useMount(() => {
    let defType = defaultType && defaultType.replace(/"/g, '').trim();
    defType = defType || 'any';
    // If value already exists, but the type is auto or any
    // set the type based on the value
    if (value && (defType === 'auto' || defType === 'any') && !defaultInternalType) {
      setInternalType(getTypeFromValue(maybeParseYaml(value)));
    } else {
      setInternalType(defaultInternalType || defType);
    }

    setType(defType);
    // If the value is null and can be null, set the null flag
    if (
      (getValueOrDefaultValue(value, default_value, canBeNull(defType)) === 'null' ||
        getValueOrDefaultValue(value, default_value, canBeNull(defType)) === null) &&
      canBeNull(defType)
    ) {
      setIsSetToNull(true);
    }

    // Set the default value
    handleChange(name, getValueOrDefaultValue(value, default_value, canBeNull(defType)));
  });

  useEffect(() => {
    // Auto field type depends on other fields' value
    // which will be used as a type
    if (rest['type-depends-on']) {
      // Get the requested type
      const typeValue: string = requestFieldData(rest['type-depends-on'], 'value');
      // Check if the field has the value set yet
      if (typeValue && typeValue !== currentType) {
        // If this is auto / any field
        // set the internal type
        if (typeValue === 'auto' || typeValue === 'any') {
          setInternalType(value ? getTypeFromValue(maybeParseYaml(value)) : 'any');
        } else {
          setInternalType(typeValue);
        }
        // Set the new type
        setType(typeValue);
        if (!currentType) {
          handleChange(name, value === undefined ? undefined : value);
        } else if (typeValue !== 'any') {
          const typeFromValue = value ? getTypeFromValue(maybeParseYaml(value)) : 'any';

          handleChange(
            name,
            value === null ? null : typeValue === typeFromValue ? value : undefined
          );
        }
      }
    }
    // If can be undefined was toggled off, but the value right now is null
    // we need to set the ability to be null to false and remove
    if (!canBeNull() && isSetToNull) {
      setIsSetToNull(false);
      handleChange(name, null);
    }
  });

  const canBeNull = (type = currentType) => {
    if (type === 'any' || type === 'Any') {
      return true;
    }

    if (requestFieldData) {
      return requestFieldData('can_be_undefined', 'value');
    }

    return false;
  };

  const handleChange: (name: string, value: any) => void = (name, value) => {
    // Run the onchange
    if (onChange && currentInternalType) {
      onChange(name, value, currentInternalType, canBeNull());
    }
  };

  const handleNullToggle = () => {
    setType(defaultType || 'any');
    setInternalType(defaultType || 'any');
    setIsSetToNull((current) => {
      return !current;
    });

    // Handle change
    handleChange(name, isSetToNull ? undefined : null);
  };

  const renderField = (currentType: string) => {
    // If this field is set to null
    if (isSetToNull) {
      // Render a readonly field with null
      return (
        <StringField name={name} value={null} onChange={handleChange as any} read_only canBeNull />
      );
    }
    if (!currentType) {
      return null;
    }
    // Check if there is a `<` in the type
    const pos: number = currentType.indexOf('<');

    if (pos > 0) {
      // Get the type from start to the position of the `<`
      currentType = currentType.slice(0, pos);
    }

    // Render the field based on the type
    switch (currentType) {
      case 'string':
      case 'softstring':
      case 'data':
      case 'binary':
      case 'file-as-string':
        return (
          <StringField
            fill
            {...rest}
            name={name}
            onChange={handleChange}
            value={value}
            type={currentType}
            disabled={readOnly}
          />
        );
      case 'bool':
      case 'softbool':
        return (
          <BooleanField
            fill
            {...rest}
            name={name}
            onChange={handleChange}
            value={value}
            type={currentType}
            disabled={readOnly}
          />
        );
      case 'date':
        return (
          <DateField
            fill
            {...rest}
            name={name}
            onChange={handleChange}
            value={value}
            type={currentType}
            disabled={readOnly}
          />
        );
      case 'hash':
      case 'hash<auto>':
      case 'list':
      case 'softlist<string>':
      case 'softlist':
      case 'list<auto>':
        return (
          <LongStringField
            {...rest}
            name={name}
            onChange={handleChange}
            value={value}
            fill
            type={currentType}
            noWrap
            placeholder={'Yaml'}
            disabled={readOnly}
          />
        );
      case 'int':
      case 'integer':
      case 'softint':
      case 'float':
      case 'softfloat':
      case 'number':
        return (
          <NumberField
            {...rest}
            name={name}
            onChange={handleChange}
            value={value}
            fill
            type={currentType}
            disabled={readOnly}
          />
        );
      case 'option_hash':
        return (
          <OptionHashField
            {...rest}
            name={name}
            onChange={handleChange}
            value={value || undefined}
            fill
            type={currentType}
            readOnly={readOnly}
          />
        );
      // case 'byte-size':
      //   return (
      //     <ByteSizeField
      //       {...rest}
      //       name={name}
      //       onChange={handleChange}
      //       value={value}
      //       type={currentType}
      //     />
      //   );
      case 'select-string': {
        return (
          <SelectField
            defaultItems={rest.allowed_values}
            value={value}
            name={name}
            onChange={handleChange}
            type={currentType}
            disabled={readOnly}
          />
        );
      }
      // case 'mapper':
      // case 'workflow':
      // case 'service':
      // case 'job':
      // case 'value-map':
      // case 'connection': {
      //   return (
      //     <InterfaceSelector type={currentType} name={name} value={value} onChange={handleChange} />
      //   );
      // }
      case 'data-provider': {
        return (
          <ConnectorField
            value={value}
            name={name}
            inline
            minimal
            isConfigItem
            onChange={handleChange}
            readOnly={readOnly}
          />
        );
      }
      // case 'file-as-string': {
      //   return (
      //     <div>
      //       <FileField
      //         name={name}
      //         value={value}
      //         onChange={handleChange}
      //         type={currentType}
      //         get_message={{
      //           action: 'creator-get-resources',
      //           object_type: 'files',
      //         }}
      //         return_message={{
      //           action: 'creator-return-resources',
      //           object_type: 'files',
      //           return_value: 'resources',
      //         }}
      //       />
      //     </div>
      //   );
      // }
      case 'any':
        return null;
      case 'auto':
        return <Callout>Please select data type</Callout>;
      default:
        return <Callout intent="danger">{'Unknown Data Type'}</Callout>;
    }
  };

  const showPicker =
    !isSetToNull &&
    (defaultType === 'auto' ||
      defaultType === 'any' ||
      currentType === 'auto' ||
      currentType === 'any');

  const types = !noSoft
    ? [
        { name: 'bool' },
        { name: 'softbool' },
        { name: 'date' },
        { name: 'string' },
        { name: 'softstring' },
        { name: 'binary' },
        { name: 'float' },
        { name: 'softfloat' },
        { name: 'list' },
        { name: 'softlist' },
        { name: 'hash' },
        { name: 'int' },
        { name: 'softint' },
        { name: 'number' },
      ]
    : [
        { name: 'bool' },
        { name: 'date' },
        { name: 'string' },
        { name: 'binary' },
        { name: 'float' },
        { name: 'list' },
        { name: 'hash' },
        { name: 'int' },
        { name: 'number' },
      ];

  // Render type picker if the type is auto or any
  return (
    <>
      <ReqoreControlGroup fluid>
        {showPicker && !readOnly ? (
          <SelectField
            name="type"
            defaultItems={types}
            value={currentInternalType}
            onChange={(_name, value) => {
              handleChange(name, null);
              setInternalType(value);
            }}
          />
        ) : null}

        {renderField(currentInternalType)}
        {canBeNull() && !readOnly ? (
          <ReqoreButton
            flat
            fixed
            intent={isSetToNull ? 'warning' : undefined}
            icon={isSetToNull ? 'CloseLine' : undefined}
            onClick={handleNullToggle}
          >
            {isSetToNull ? 'Unset null' : 'Set as null'}
          </ReqoreButton>
        ) : null}
      </ReqoreControlGroup>
    </>
  );
};

export default AutoField;

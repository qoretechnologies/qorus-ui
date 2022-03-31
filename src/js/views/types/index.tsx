/* @flow */
import { Callout } from '@blueprintjs/core';
import { map, size } from 'lodash';
import React, { memo } from 'react';
import { useAsyncRetry } from 'react-use';
import TinyGrid from '../../../img/tiny_grid.png';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Suggest from '../../components/Field/suggest';
import Flex from '../../components/Flex';
import Headbar from '../../components/Headbar';
import Modal from '../../components/modal';
import Tree from '../../components/tree';
import {
  StyledFieldsWrapper,
  StyledMapperWrapper,
} from '../../containers/mappers/new_diagram';
import MapperInput from '../../containers/mappers/new_diagram/input';
import { flattenFields, getLastChildIndex } from '../../helpers/mapper';
import modal from '../../hocomponents/modal';
import { get } from '../../store/api/utils';

type Props = {
  sync: boolean,
  loading: boolean,
  collection: Object,
  dispatch: Function,
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type '{ chi... Remove this comment to see the full error message
const DataProviderTypes = memo(({ openModal, closeModal }) => {
  const [val, setVal] = React.useState('');
  // Save the field detail
  const [type, setType] = React.useState(null);

  const { loading, value, error, retry } = useAsyncRetry(async () => {
    return get('api/latest/dataprovider/types/listAll');
  }, []);

  const fieldsData = useAsyncRetry(async () => {
    if (type) {
      return get(`api/latest/dataprovider/types${type}?action=type`);
    }
  }, [type]);

  if (loading) {
    return <p>Loading ...</p>;
  }

  const renderTypeFields = () => {
    if (!type) {
      return null;
    }

    if (fieldsData.loading) {
      return <p>Loading ...</p>;
    }

    const flattenedFields = flattenFields(fieldsData.value?.fields);

    return (
      <div
        style={{
          width: '100%',
          marginTop: '15px',
          padding: 10,
          flex: 1,
          overflow: 'auto',
          background: `url(${`${TinyGrid}`}`,
        }}
      >
        <StyledMapperWrapper
          style={{ justifyContent: 'center', paddingTop: '10px' }}
        >
          <StyledFieldsWrapper style={{ flex: '0 1 auto' }}>
            {size(flattenedFields) !== 0 ? (
              map(flattenedFields, (input, index) => (
                <MapperInput
                  key={input.path}
                  name={input.name}
                  types={input.type.types_returned}
                  {...input}
                  field={input}
                  id={index + 1}
                  lastChildIndex={
                    getLastChildIndex(input, flattenedFields) - index
                  }
                  onClick={() => {
                    openModal(
                      <Modal width="600px">
                        <Modal.Header onClose={() => closeModal()}>
                          Type Field Detail
                        </Modal.Header>
                        <Modal.Body>
                          <Box top>
                            <h4>Field description</h4>
                            {input.desc}
                            <br />
                            <br />

                            <h4>Field data</h4>
                            { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
                            <Tree data={input} />
                          </Box>
                        </Modal.Body>
                      </Modal>
                    );
                  }}
                  hasAvailableOutput={true}
                />
              ))
            ) : (
              <Callout intent="warning">
                {' '}
                There are no fields for this type{' '}
              </Callout>
            )}
          </StyledFieldsWrapper>
        </StyledMapperWrapper>
      </div>
    );
  };

  return (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb active>Dataprovider Types</Crumb>
        </Breadcrumbs>
      </Headbar>
      <Box top fill>
        <Suggest
          defaultItems={value}
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ defaultItems: any; value: any; selected: a... Remove this comment to see the full error message
          value={type || val}
          selected={type}
          name="path"
          onChange={(_name, value) => setVal(value)}
          onSelect={(value) => setType(value)}
        />
        {renderTypeFields()}
      </Box>
    </Flex>
  );
});

export default modal()(DataProviderTypes);

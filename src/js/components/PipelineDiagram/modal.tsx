import reduce from 'lodash/reduce';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { rebuildConfigHash } from '../../helpers/interfaces';
import Box from '../box';
import ConfigItemsTable from '../ConfigItemsTable';
import Modal from '../modal';
import Tabs, { Pane } from '../tabs';
import Tree from '../tree';

const PipeElementModal = ({ onClose, intl, pipelineId, elementId, elementName, pipeline }) => {
  const getConfigItemsForState = (element) => {
    element.config = reduce(
      pipeline.config,
      (newConfig, configItem, name) => {
        // Split the config item name
        const [elementId] = name.split(':');
        // Check if the name matches the state name
        if (elementId === element.pid) {
          return {
            ...newConfig,
            [name]: configItem,
          };
        }

        return newConfig;
      },
      {}
    );

    return element;
  };

  const flattenPipeline = (data) => {
    return data.reduce((newData, item) => {
      if (item.children) {
        return [...newData, item, ...flattenPipeline(item.children)];
      }

      return [...newData, item];
    }, []);
  };

  const elements = flattenPipeline(pipeline.children);
  const element = elements.find((el) => (el.pid ? el.pid === elementId : el.name === elementName));

  return (
    <Modal width="40vw" height="500">
      <Modal.Header onClose={onClose}>
        {intl.formatMessage({ id: 'global.view-element-detail' })} {element.name}
      </Modal.Header>
      <Modal.Body>
        <Box top fill>
          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
          <Tabs active={element.type === 'processor' ? 'config' : 'info'}>
            {element.type === 'processor' && (
              // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
              <Pane name="Config">
                <ConfigItemsTable
                  items={rebuildConfigHash(getConfigItemsForState(element))}
                  intrf="pipelines"
                  intrfId={pipelineId}
                />
              </Pane>
            )}
            {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
            <Pane name="Info">
              {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
              <Tree data={element} />
            </Pane>
          </Tabs>
        </Box>
      </Modal.Body>
    </Modal>
  );
};

export default compose(
  connect((state, props) => ({
    pipeline: state.api.pipelines.data.find((pipe) => pipe.id === props.pipelineId),
  })),
  injectIntl
)(PipeElementModal);

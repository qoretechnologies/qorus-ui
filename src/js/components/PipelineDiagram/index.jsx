import React, {
  useEffect, useRef
} from 'react';

import Tree from 'react-d3-tree';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import styled from 'styled-components';

import { Classes } from '@blueprintjs/core';

import TinyGrid from '../../../img/tiny_grid.png';
import modal from '../../hocomponents/modal';
import actions from '../../store/api/actions';
import Loader from '../loader';
import PipeElementModal from './modal';

const StyledDiagramWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${`url(${`${TinyGrid}`})`};
`;

const StyledNodeLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  span {
    text-align: center;
  }
`;

const calculateFontSize = (name, isAction?: boolean) => {
  if (!name) {
    return undefined;
  }

  const len = name.length;

  if (len > 20) {
    return isAction ? '10px' : '12px';
  }

  return undefined;
};

const NodeLabel = ({ nodeData, openModal, closeModal, id }) => {
  return (
    <>
      <StyledNodeLabel
        onClick={() => {
          openModal(
            <PipeElementModal
              onClose={closeModal}
              pipelineId={id}
              elementId={nodeData.pid}
              elementName={nodeData.name}
            />
          );
        }}
      >
        <span style={{ fontSize: calculateFontSize(nodeData.name) }}>
          {nodeData.name}
        </span>
        {nodeData.type !== 'start' && (
          <span
            style={{ fontSize: calculateFontSize(nodeData.name, true) }}
            className={Classes.TEXT_MUTED}
          >
            {nodeData.type}
          </span>
        )}
      </StyledNodeLabel>
    </>
  );
};

const PipelineDiagram = ({
  load,
  pipeline,
  pipeName,
  openModal,
  closeModal,
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    load(pipeName);
  }, [pipeName]);

  if (!pipeline) {
    return <Loader />;
  }

  const getNodeShapeData = (type: string, children: any[]) => {
    switch (type) {
      case 'mapper':
      case 'processor':
        return {
          shape: 'rect',
          shapeProps: {
            width: '200px',
            height: '60px',
            x: -100,
            y: -30,
            fill: '#fff',
            stroke: '#a9a9a9',
          },
        };
      case 'queue':
        return {
          shape: 'ellipse',
          shapeProps: {
            rx: 100,
            ry: 30,
            fill: children.length === 0 ? '#fddcd4' : '#fff',
            stroke: children?.length === 0 ? '#d13913' : '#a9a9a9',
          },
        };
      case 'start':
        return {
          shape: 'circle',
          shapeProps: {
            r: 25,
            fill: '#d7d7d7',
            stroke: '#a9a9a9',
            id: 'pipeline-start',
          },
        };
    }
  };

  const transformNodeData = (data, path) => {
    return data.reduce((newData, item, index) => {
      const newItem = { ...item };

      newItem.nodeSvgShape = getNodeShapeData(item.type, item.children);
      newItem.path = `${path}[${index}]`;

      if (item.children) {
        newItem.children = transformNodeData(
          newItem.children,
          `${newItem.path}.children`
        );
      }

      return [...newData, newItem];
    }, []);
  };

  const elements = transformNodeData(
    [
      {
        type: 'start',
        children: pipeline?.children || [],
      },
    ],
    ''
  );

  return (
    <StyledDiagramWrapper ref={wrapperRef} id="pipeline-diagram">
      {wrapperRef.current && (
        <Tree
          data={elements}
          orientation="vertical"
          pathFunc="straight"
          translate={{
            x: wrapperRef.current.getBoundingClientRect().width / 2,
            y: 100,
          }}
          nodeSize={{ x: 250, y: 250 }}
          transitionDuration={0}
          textLayout={{
            textAnchor: 'middle',
          }}
          allowForeignObjects
          nodeLabelComponent={{
            render: (
              <NodeLabel
                openModal={openModal}
                closeModal={closeModal}
                id={pipeline.id}
              />
            ),
            foreignObjectWrapper: {
              width: '200px',
              height: '60px',
              y: -30,
              x: -100,
            },
          }}
          collapsible={false}
          styles={{
            links: {
              stroke: '#a9a9a9',
              strokeWidth: 2,
            },
            nodes: {
              node: {
                ellipse: {
                  stroke: '#a9a9a9',
                },
                rect: {
                  stroke: '#a9a9a9',
                  rx: 25,
                },
                name: {
                  stroke: '#333',
                  strokeWidth: 0.8,
                },
              },
              leafNode: {
                ellipse: {
                  stroke: '#a9a9a9',
                },
                rect: {
                  stroke: '#a9a9a9',
                  rx: 25,
                },
                name: {
                  stroke: '#333',
                  strokeWidth: 0.8,
                },
              },
            },
          }}
        />
      )}
    </StyledDiagramWrapper>
  );
};

const pipelineSelector: Function = (state: Object, props: Object): Object =>
  state.api.pipelines.data.find((pipe: Object) => pipe.name === props.pipeName);

const selector = createSelector([pipelineSelector], (pipeline) => ({
  pipeline,
}));

export default compose(
  connect(selector, {
    load: actions.pipelines.fetch,
  }),
  modal(),
  injectIntl
)(PipelineDiagram);
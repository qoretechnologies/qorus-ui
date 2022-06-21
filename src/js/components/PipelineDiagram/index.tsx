import { Classes } from '@blueprintjs/core';
import { useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import TinyGrid from '../../../img/tiny_grid.png';
import { providers } from '../../containers/mappers/info';
import modal from '../../hocomponents/modal';
import actions from '../../store/api/actions';
import Loader from '../loader';
import PipeElementModal from './modal';

const StyledDiagramWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${`url(${`${TinyGrid}`})`};
  flex: 1;
  display: flex;
  flex-flow: column;

  > div {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: column;

    > svg {
      height: 100%;
      flex: 1;
    }
  }
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

const StyledProviderUrl = styled.div`
  background-color: #eee;
  border-radius: 3px;
  padding: 5px;
  margin: 5px 0;
  display: inline-block;
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

const getProviderUrl = (pipeline) => {
  if (!pipeline.options || !pipeline.options['input-provider']) {
    return 'None';
  }
  // Get the mapper options data
  const { type, name, path = '', subtype } = pipeline.options['input-provider'];
  // Get the rules for the given provider
  const { url, suffix, recordSuffix } = providers[type];
  // Build the URL based on the provider type
  return `${url}/${name}${suffix}${path}${recordSuffix && !subtype ? recordSuffix : ''}`;
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
        <span style={{ fontSize: calculateFontSize(nodeData.name) }}>{nodeData.name}</span>
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

const PipelineDiagram = ({ load, pipeline, pipeName, openModal, closeModal }) => {
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
        newItem.children = transformNodeData(newItem.children, `${newItem.path}.children`);
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
    <>
      <StyledProviderUrl>Provider: {getProviderUrl(pipeline)}</StyledProviderUrl>
      <StyledDiagramWrapper ref={wrapperRef} id="pipeline-diagram">
        {wrapperRef.current && (
          // @ts-expect-error
          <Tree
            // @ts-ignore ts-migrate(2322) FIXME: Type '{ style: { height: string; }; data: any; ori... Remove this comment to see the full error message
            style={{ height: '100%' }}
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
                // @ts-ignore ts-migrate(2741) FIXME: Property 'nodeData' is missing in type '{ openModa... Remove this comment to see the full error message
                <NodeLabel openModal={openModal} closeModal={closeModal} id={pipeline.id} />
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
    </>
  );
};

const pipelineSelector: Function = (state: any, props: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.pipelines.data.find((pipe: any) => pipe.name === props.pipeName);

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
const selector = createSelector([pipelineSelector], (pipeline) => ({
  pipeline,
}));

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'pipelines' does not exist on type '{}'.
    load: actions.pipelines.fetch,
  }),
  modal(),
  injectIntl
)(PipelineDiagram);

import React, { PropTypes } from 'react';
import ChartView from './chart';

export default function Performance(props) {
  return (
    <div>
      <ChartView
        workflow={props.workflow}
        days={1}
      />
      <ChartView
        workflow={props.workflow}
        days={7}
      />
      <ChartView
        workflow={props.workflow}
        days={30}
      />
    </div>
  );
}

Performance.propTypes = {
  workflow: PropTypes.object,
};

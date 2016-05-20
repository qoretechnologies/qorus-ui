import React, { PropTypes } from 'react';


export default function PerformanceCharts(props) {
  return (
    <div className={ props.className }>
      <h4>Performance Charts</h4>
      <div className="performance-charts">
        <p>Not implemented yet</p>
      </div>
    </div>
  );
}

PerformanceCharts.propTypes = {
  className: PropTypes.string,
};

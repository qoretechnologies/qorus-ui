import { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Column specification component.
 *
 * This is a meta component to specify how table or table section data
 * will be rendered. It renders nothing itself.
 *
 * By default, it suggests rendering no heading cell and no data
 * cell. It is expected, though not required, to specify either props
 * prop or childProps prop and a child element.
 *
 * Props and childProps props received three parameters: record,
 * record index in data and column index in table section. It should
 * an object suitable to be used as a React element props object.
 */
@pureRender
export default class Col extends Component {
  static propTypes = {
    heading: PropTypes.string,
    comp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    props: PropTypes.func,
    childProps: PropTypes.func
  }

  static defaultProps = {
    heading: '',
    comp: 'td',
    props: () => ({}),
    childProps: () => ({})
  }

  render() {
    return null;
  }
}

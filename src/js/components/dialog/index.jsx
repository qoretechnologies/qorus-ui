/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import shortid from 'shortid';

type coord = {
  top: string,
  left: string,
};

class Dialog extends React.Component {
  props: {
    children?: ReactClass<*>,
    className?: string;
    mainElement: React.Element<*>,
    position?: 'top' | 'bottom' | 'left' | 'right',
  }

  state: {
    id: string,
    isOpen: boolean,
  }

  componentWillMount() {
    this.setState({ id: shortid.generate() });
  }

  componentDidUpdate() {
    const { isOpen } = this.state;

    if (isOpen) {
      window.addEventListener('resize', this.setDialogPosition);
      window.addEventListener('click', this.handleOutsideClick);
      this.setDialogPosition();
    } else {
      window.removeEventListener('resize', this.setDialogPosition);
      window.removeEventListener('click', this.handleOutsideClick);
    }
  }

  setBottomPosition = (element: HTMLElement): coord => {
    const top = (element.offsetTop + element.offsetHeight).toString();
    const left = (element.offsetLeft + element.offsetWidth / 2).toString();

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  setTopPosition = (element: HTMLElement): coord => {
    const top = (element.offsetTop).toString();
    const left = (element.offsetLeft + element.offsetWidth / 2).toString();

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  setRightPosition = (element: HTMLElement): coord => {
    const top = (element.offsetTop + element.offsetHeight / 2).toString();
    const left = (element.offsetLeft + element.offsetWidth).toString();

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  setLeftPosition = (element: HTMLElement): coord => {
    const top = (element.offsetTop + element.offsetHeight / 2).toString();
    const left = (element.offsetLeft).toString();

    return {
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  setDialogPosition = () => {
    const element = ReactDOM.findDOMNode(this.refs.mainElement);
    const dialogWrapper = ReactDOM.findDOMNode(this.refs.dialogWrapper);

    const map = {
      bottom: this.setBottomPosition,
      top: this.setTopPosition,
      left: this.setLeftPosition,
      right: this.setRightPosition,
    };

    const { position = 'bottom' } = this.props;
    const { top, left }: coord = map[position](element);
    dialogWrapper.style.left = left;
    dialogWrapper.style.top = top;
  }

  handleClick = () => {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen });
  }

  handleOutsideClick = (event: Object): void => {
    const el: Object = ReactDOM.findDOMNode(this.refs.dialog);

    if (el && !el.contains(event.target)) {
      this.setState({
        isOpen: false,
      });
    }
  };


  renderDialog() {
    const { children, position = 'bottom' } = this.props;
    return (
      <div
        className="dialog-wrapper"
        ref="dialogWrapper"
      >
        <div className={`popover ${position}`}>
          <div className="arrow"></div>
          <div className="popover-content">
            {children}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { mainElement, className } = this.props;
    return (
      <div
        ref="dialog"
        className={className}
      >
        {React.cloneElement(
          mainElement,
          {
            ref: 'mainElement',
            onClick: this.handleClick,
          }
        )}
        { this.state.isOpen ? this.renderDialog() : null }
      </div>
    );
  }
}

export default Dialog;

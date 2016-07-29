/* @flow */
import React from 'react';
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

  getElementId() {
    return this.state.id;
  }

  getDialogId() {
    return `dialog-${this.getElementId()}`;
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
    const elementId = this.getElementId();
    const element = document.getElementById(elementId);
    const dialogId = this.getDialogId();
    const dialog = document.getElementById(dialogId);

    const map = {
      bottom: this.setBottomPosition,
      top: this.setTopPosition,
      left: this.setLeftPosition,
      right: this.setRightPosition,
    };

    const { position = 'bottom' } = this.props;
    const { top, left }: coord = map[position](element);
    dialog.style.left = left;
    dialog.style.top = top;
  }

  handleClick = () => {
    const isOpen = !this.state.isOpen;
    if (isOpen) {
      window.addEventListener('resize', this.setDialogPosition);
      this.setDialogPosition();
    } else {
      window.removeEventListener('resize', this.setDialogPosition);
    }
    this.setState({ isOpen });
  }

  render() {
    const { children, mainElement, className, position = 'bottom' } = this.props;
    return (
      <div className={className}>
        {React.cloneElement(
          mainElement,
          {
            id: this.getElementId(),
            onClick: this.handleClick,
          }
        )}
        <div
          className="dialog-wrapper"
          style={{
            display: 'block',
            visibility: this.state.isOpen ? 'visible' : 'hidden',
          }}
          id={this.getDialogId()}
        >
          <div className={`popover ${position}`}>
            <div className="arrow"></div>
            <div className="popover-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;

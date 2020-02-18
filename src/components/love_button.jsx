import React from 'react';

export default class LoveButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loved: false
    };
  }

  render() {
    if (this.state.loved) {
      return 'You loved this.';
    }

    return (
      <button onClick={() => this.setState({ loved: true })}>
        Love
      </button>
    );
  }
}
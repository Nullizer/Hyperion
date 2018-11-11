import * as React from 'react'

export class Toggle extends React.Component<{}, {isToggleOn: boolean}> {
  constructor (props: {}) {
    super(props)
    this.state = { isToggleOn: true }
  }

  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render () {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    )
  }
}

export default Toggle

import * as React from 'react'
import { PureComponent } from 'react'

export class Toggle extends PureComponent<{}, {isToggleOn: boolean}> {
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

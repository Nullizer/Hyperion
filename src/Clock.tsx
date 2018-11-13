import * as React from 'react'
import { PureComponent } from 'react'

interface ClockState {
  date: Date
}

export class Clock extends PureComponent<{}, ClockState> {
  timer?: number
  constructor (props: {}) {
    super(props)
    this.state = { date: new Date() }
  }
  componentDidMount () {
    this.timer = window.setInterval(this.tick, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.timer as number)
  }
  tick = () => {
    this.setState({
      date: new Date()
    })
  }
  render () {
    return (
      <div>
        <h1>Clock Panel</h1>
        <FormattedDate date={new Date()} />
      </div>
    )
  }
}

interface FormattedDateProps {
  date: Date
}

function FormattedDate (props: FormattedDateProps) {
  return <h2>Now is {props.date.toLocaleTimeString()}.</h2>
}

export default Clock

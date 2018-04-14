import * as React from 'react'
import { render } from 'react-dom'
import styles from './article.scss'
import Clock from './Clock'
import Toggle from './Toggle'

const root = document.createElement('div')
document.body.insertBefore(root, document.body.firstElementChild)

const Heading = () =>
  <React.Fragment>
    <h1>Hello, world!</h1>
    <h2>Long Live JSX!</h2>
  </React.Fragment>

render(
  <React.Fragment>
    <Heading />
    <p className={styles.paragraphTheme}>Hyperion 796</p>
    <Clock />
    <Toggle />
  </React.Fragment>,
  root
)

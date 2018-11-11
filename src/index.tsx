import * as React from 'react'
import { Fragment, lazy, Suspense } from 'react'
import { render } from 'react-dom'
import styles from './article.scss'
import Clock from './Clock'

const Toggle = lazy(() => import('./Toggle'))

const root = document.createElement('div')
document.body.insertBefore(root, document.body.firstElementChild)

const Heading = () =>
  <Fragment>
    <h1>Hello, world!</h1>
    <h2>Long Live JSX!</h2>
  </Fragment>

render(
  <Fragment>
    <Heading />
    <p className={styles.paragraphTheme}>Hyperion 796</p>
    <Clock />
    <Suspense fallback={<div>Loading...</div>}>
      <Toggle />
    </Suspense>
  </Fragment>,
  root
)

;(async function () {
  const resp = await fetch('https://api.github.com/users/nullizer').then(r => r.json())
  console.log(resp, 42)
})()

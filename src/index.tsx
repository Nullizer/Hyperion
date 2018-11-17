import * as React from 'react'
import { Fragment, lazy, Suspense, StrictMode, memo } from 'react'
import { render } from 'react-dom'
import './global.scss'
import styles from './article.scss'
import exampleStyles from './example.scss'
import Clock from './Clock'

const Toggle = lazy(() => import('./Toggle'))

const root = document.createElement('div')
document.body.insertBefore(root, document.body.firstElementChild)

const Heading = memo((props: {name: string}) =>
  <Fragment>
    <h1>Hello, world!</h1>
    <h2>Long Live {props.name}!</h2>
  </Fragment>)

render(
  <StrictMode>
    <Heading name='JSX' />
    <p className={styles.paragraphTheme}>Hyperion 796</p>
    <Clock />
    <Suspense fallback={<div>Loading...</div>}>
      <Toggle />
    </Suspense>

    <div className={exampleStyles.container}>
      <div className={exampleStyles.itemA}></div>
      <div className={exampleStyles.itemB}></div>
      <div className={exampleStyles.itemC}></div>
      <div className={exampleStyles.itemD}></div>
    </div>
  </StrictMode>,
  root
)

;(async function () {
  const resp = await fetch('https://api.github.com/users/nullizer').then(r => r.json())
  console.log(resp, 42)
  console.log('My Avatar: ' + resp.avatar_url)
})()

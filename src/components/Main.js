import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Archived from './Archived'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/archived' component={Archived}/>
    </Switch>
  </main>
)

export default Main

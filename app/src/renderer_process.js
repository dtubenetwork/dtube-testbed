import React from 'react'
import {render} from 'react-dom'
import App from './App.jsx'
import './global.css'
import {remote} from 'electron'

window.dtube = remote.getGlobal("dtube")

render(
    <App/>,
    document.getElementById('app')
)

import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

// import stylesheet
require('./index.scss');

// import components
import App from "./components/app/App"
import Main from "./components/main/Main"

// Copy the index.html file
require('file?name=[name].[ext]!./index.html');

ReactDOM.render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Main} />
        </Route>
    </Router>,
    document.getElementById('root')
)
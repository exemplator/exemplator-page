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

// Add the java hashCode function to all strings
String.prototype.hashCode = function() {
    let hash = 0
    if (this.length == 0) return hash
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

ReactDOM.render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Main} />
        </Route>
    </Router>,
    document.getElementById('root')
)
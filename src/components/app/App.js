import React, { PropTypes } from 'react'
import MuiTheme from "../app/MuiTheme"
import Footer from "./footer/Footer"
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class App extends React.Component {
    
    static propTypes = {
        children: PropTypes.element.isRequired
    }

    constructor() {
        super()
        injectTapEventPlugin();
    }

    render () {
        return (
            <MuiTheme>
                {this.props.children}
                <Footer/>
            </MuiTheme>
        )
    }
}
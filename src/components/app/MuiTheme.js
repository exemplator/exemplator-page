import React from "react"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class MuiTheme extends React.Component {
    render() {
        const muiTheme = getMuiTheme({
            palette: {
                primary1Color: "#C62828",
                primary2Color: "#C62828",
                primary3Color: "#C62828"
            }
        })

        return (
            <div>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div>
                        {this.props.children}
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }

}
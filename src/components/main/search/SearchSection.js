import React from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            codeText: "",
            typeText: "",
            errorText: ""
        }
    }

    _handleCodeTextFieldChange(e) {
        this.setState({
            codeText: e.target.value
        })
    }

    _handleTypeTextFieldChange(e) {
        this.setState({
            typeText: e.target.value
        })
    }
    
    _handleSearch() {
        let error = false
        if (this.state.codeText === "") {
            error = true
        }

        if (this.state.typeText === "") {
            error = true
        }

        if (error) {
            this.setState({
                errorText: "Please fill out all fields"
            })
            return
        }

        this.setState({
            errorText: ""
        })
    }

    _handleKeyPress(e) {
        if(e.key === 'Enter') {
            this._handleSearch()
        }
    }

    render () {
        let errorDisplay
        if (this.state.errorText === "") {
            errorDisplay = "none"
        } else {
            errorDisplay = "block"
        }

        return (
            <div className="search-section">
                <span className="search-section-text">Find examples for</span> 
                <TextField type="text"
                           value={this.state.codeText}
                           inputStyle={{
                               textAlign: "left",
                               fontFamily: "Code-Font",  
                               fontSize: "1.2em",
                               color: "#C62828"
                           }}
                           floatingLabelText={"e.g. \"inputStream.close()\""}
                           floatingLabelFixed={true}
                           floatingLabelStyle={{color: "white"}}
                           style={{marginLeft: "3%", marginRight: "3%", width: "250px"}}
                           onChange={this._handleCodeTextFieldChange.bind(this)}
                           id="codeTextField"
                           onKeyPress={this._handleKeyPress.bind(this)}
                           placeholder="code" />
                <br/>
                <span className="search-section-text">of</span> 
                <TextField type="text"
                           value={this.state.typeText}
                           inputStyle={{
                               textAlign: "left",
                               fontFamily: "Code-Font",  
                               fontSize: "1.2em",
                               color: "#C62828"
                           }}
                           floatingLabelText={"e.g. \"java.io.InputStream\""}
                           floatingLabelFixed={true}
                           floatingLabelStyle={{color: "white"}}
                           style={{marginLeft: "3%", width: "300px"}}
                           onChange={this._handleTypeTextFieldChange.bind(this)}
                           id="typeTextField"
                           onKeyPress={this._handleKeyPress.bind(this)}
                           placeholder="fully qualified type" />
                <p className="search-error-field" style={{display: errorDisplay}}>{this.state.errorText}</p>
                <RaisedButton
                    label="Search"
                    primary={true}
                    style={{
                        display: "block", 
                        width: "50px", 
                        marginLeft: "auto", 
                        marginRight: "auto",
                        marginTop: "5%"
                    }}
                    labelStyle={{textTransform: "none"}}
                    onTouchTap={this._handleSearch.bind(this)}
                />
            </div>
        )
    }
}
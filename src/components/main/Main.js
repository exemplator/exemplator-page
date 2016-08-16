import React from 'react'
import SearchSection from "./search/SearchSection"
import Result from "./result/Result"
import FetchStore from '../../stores/fetchStore'
var Immutable = require('immutable');

export default class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            codeSamples: []
        }
    }

    componentDidMount() {
        FetchStore.addChangeListener(this._updateCodeSamples.bind(this))
    }

    componentWillUnmount() {
        FetchStore.removeChangeListener(this._updateCodeSamples.bind(this))
    }
    
    _updateCodeSamples() {
        let codeSampleList = Immutable.List(FetchStore.getCodeSamples())
            .map(res => <Result title={res.title}
                                githubURL={res.userUrl}
                                rawURL={res.rawUrl}
                                codeTop={res.codeTop}
                                codeHighlighted={res.codeHighlighted}
                                codeBottom={res.codeBottom} />)

        this.setState({
            codeSamples: codeSampleList
        })
    }
    
    render () {
        return (
            <div className="main">
                <div className="main-hero">
                    <h1 className="main-title">Exemplator</h1>
                    <h4 className="main-subtitle">A <span className="primary-color">Java</span> coding assistant</h4>

                    <SearchSection/>
                </div>
                <div className="main-body">
                    {this.state.codeSamples}
                </div>
            </div>
        )
    }
}
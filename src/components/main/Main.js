import React from 'react'
import SearchSection from "./search/SearchSection"
import Result from "./result/Result"
// import Typist from 'react-typist'

export default class Home extends React.Component {
    render () {
        return (
            <div className="main">
                <div className="main-hero">
                    <h1 className="main-title">Exemplator</h1>
                    <h4 className="main-subtitle">A <span className="primary-color">Java</span> coding assistant</h4>

                    <SearchSection/>
                </div>
                <div className="main-body">
                    <Result/>
                    <Result/>
                    <Result/>
                    <Result/>
                </div>
            </div>
        )
    }
}
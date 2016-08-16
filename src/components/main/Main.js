import React from 'react'
import SearchSection from "./search/SearchSection"
import Result from "./result/Result"
// import Typist from 'react-typist'

export default class Home extends React.Component {
    render () {
        let code = "const woah = fun => fun + 1;\n" +
            "const dude = woah(2) + 3;\n" +
            "function thisIsAFunction() {\n" +
            "  return [1,2,3].map(n => n + 1).filter(n !== 3);\n" +
            "}\n" +
            "console.log('making up fake code is really hard');\n"
        
        return (
            <div className="main">
                <div className="main-hero">
                    <h1 className="main-title">Exemplator</h1>
                    <h4 className="main-subtitle">A <span className="primary-color">Java</span> coding assistant</h4>

                    <SearchSection/>
                </div>
                <div className="main-body">
                    <Result title="title" 
                            githubURL="https://www.google.com" 
                            rawURL="https://www.google.com"
                            code={code}/>
                    <Result title="title"
                            githubURL="https://www.google.com"
                            rawURL="https://www.google.com"
                            code={code}/>
                    <Result title="title"
                            githubURL="https://www.google.com"
                            rawURL="https://www.google.com"
                            code={code}/>
                    <Result title="title"
                            githubURL="https://www.google.com"
                            rawURL="https://www.google.com"
                            code={code}/>
                </div>
            </div>
        )
    }
}
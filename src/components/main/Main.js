import React from 'react'
import SearchSection from "./search/SearchSection"
import Result from "./result/Result"
// import Typist from 'react-typist'

export default class Home extends React.Component {

    _sendRequest(exemplatorPluginView, request, page = 0) {
        console.log("hi 1")
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", "http://localhost:4567/search");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");


        var dict = {}

        if (false)//request.class != null && request.class.package != null)
            dict["package"] = request.class.package.trim();
        if (request.class != null && request.class.name != null)
            dict["class"] = request.class.name.trim();
        if (request.method != null)
            dict["method"] = request.method.trim();
        if (request.token != null)
            dict["token"] = request.token.trim();
        dict["page"] = page;

        console.log("Dict to be sent: ");
        console.log(dict);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    _handleResponse(exemplatorPluginView, xmlhttp.responseText);
                }
                else if (xmlhttp.status == 400) {
                    console.log("Error 400 returned from server");
                }
                else {
                    console.log("Error returned from server",xmlhttp.status);
                }
            }
        };

        var dict = {
            'class': 'List',
            'method': 'add',
            'page': 0
        }

        xmlhttp.send(JSON.stringify(dict));
    }

    _handleResponse(exemplatorPluginView, responseText) {
        var response = JSON.parse(responseText);
        console.log("Response from server: ");
        console.log(response);

        var responseArray = response.occurrences;
        console.log(responseArray)

        var data = {
            examples: []
        }

        responseArray.forEach(item => {
            if (item.selections.length > 0) {
                start = item.selections[0].start.line
                end = item.selections[0].end.line
                if (end ==start) {
                    end = start+1
                }
                let code = splitCode(item.code, start, end);
                var element = {
                    userUrl: item.userUrl,
                    rawUrl: item.rawUrl,
                    codeTop: code[0],
                    highlightedCode: code[1],
                    codeBottom:  code[2]
                }
                data.examples.push(element)
            }
        })

        exemplatorPluginView.setData(data);
    }
    
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
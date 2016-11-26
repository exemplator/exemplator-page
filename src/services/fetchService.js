import FetchConstants from "../constants/fetchConstants"
import FetchStore from '../stores/fetchStore'
import { fetchSuccess, fetchError, nextPageSuccess } from "../actions/fetchActions"
import Formatter from "auto-format"

export var sendRequest = function(action) {
    // Update store with new request
    FetchStore.setCode(action.code)
    FetchStore.setType(action.type)
    FetchStore.setPage(0)
    FetchStore.setCounter(1)

    let typeArray = action.type.split(".")
    let pakage = action.type.substring(0, action.type.length - typeArray[typeArray.length - 1].length - 1)
    
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", FetchConstants.FETCH_URL);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                let data = handleResponseSuccess(xmlhttp.responseText)
                fetchSuccess(data.results, data.page);
            } else if (xmlhttp.status == 400) {
                fetchError("Error 400 returned from server")
            } else {
                fetchError("Server Error: " + xmlhttp.status)
            }
        }
    };

    let data = {
        'package': pakage,
        'class': typeArray[typeArray.length - 1],
        'method': action.code,
        'page': action.page
    }

    xmlhttp.send(JSON.stringify(data));
}

export var fetchNextPage = function() {
    // Get current request settings
    let code = FetchStore.getCode()
    let type = FetchStore.getType()
    let page = FetchStore.getPage()
    
    // Increment page by 1
    page += 1
    
    if (FetchStore.getCounter() <= 0) {
        return
    }

    let typeArray = type.split(".")
    let pakage = type.substring(0, type.length - typeArray[typeArray.length - 1].length - 1)

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", FetchConstants.FETCH_URL);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                let data = handleResponseSuccess(xmlhttp.responseText)
                nextPageSuccess(data.results, data.page)
            } else if (xmlhttp.status == 400) {
                fetchError("Error 400 returned from server")
            } else {
                fetchError("Server Error: " + xmlhttp.status)
            }
        }
    };

    let data = {
        'package': pakage,
        'class': typeArray[typeArray.length - 1],
        'method': code,
        'page': page
    }

    xmlhttp.send(JSON.stringify(data));
}

let handleResponseSuccess = function(responses) {
    let response = JSON.parse(responses);
    let responseArray = response.occurrences;

    let data = []
    let page = response.endPage
    let formatter = Formatter.createJavaFormatter("    ")

    responseArray.forEach(item => {
        item.selections.forEach(selection => {
            let start = selection.start.line
            let end = selection.end.line

            let title = "Example " + FetchStore.getCounter() + " (Line " + start + ")"
            if (start !== end) {
                title = "Example " + FetchStore.getCounter() + " (Line " + start + "-" + end + ")"
            }

            try {
                //let formattedCode = formatter.formatSnippet(item.code, start, end, FetchConstants.SPLIT_OFFSET);

                let fullCodeArray = item.code.split('\n')
                let formattedCode = [fullCodeArray.slice(start - 1, end), fullCodeArray.slice(start - 10 - 1, end + 10)]
                let codeSplit = splitCode(formattedCode[1], formattedCode[0])
                console.log("sdf")
                //let newStart = formattedCode[3][0]
                //let newEnd = formattedCode[3][1]
                let newStart = 0
                let newEnd = 10

                let fullCode = codeSplit[0].reduce(((acc, line) => acc + '\n' + line)) + '\n'
                        + codeSplit[1].reduce(((acc, line) => acc + '\n' + line)) + '\n'
                        + codeSplit[2].reduce(((acc, line) => acc + '\n' + line))

                fullCode = formatter.format(fullCode);
                codeSplit = splitCode(fullCode, formattedCode[0])

                if (newEnd - newStart >= FetchConstants.MIN_LINES) {
                    data.push({
                        title: title,
                        repoUrl: item.repoUrl,
                        fileUrl: item.fileUrl + "#L" + start,
                        codeTop: codeSplit[0].reduce(((acc, line) => acc + '\n' + line)),
                        codeHighlighted: codeSplit[1].reduce(((acc, line) => acc + '\n' + line)),
                        codeBottom: codeSplit[2].reduce(((acc, line) => acc + '\n' + line))
                    })

                    FetchStore.setCounter(FetchStore.getCounter() + 1)
                }
            } catch (e) {
               console.log("Unable to format code: " + e)
            }
        })
    })
    
    return {
        results: data,
        page: page
    }
}

function splitCode(codeArray, selection) {
    let startArray = []
    let selectionArray = []
    let endArray = []
    let selectionFound = false
    let selectionDone = false

    codeArray.forEach(line => {
        if (selection.length !== 0) {
            if (!selectionDone && selection.reduce((result, sLine) => result
                || line.includes(sLine.trim()), false)) {
                selectionFound = true
                selectionArray.push(line)
            } else if (selectionFound) {
                endArray.push(line)
                selectionDone = true
            } else {
                startArray.push(line)
            }
        }
    })

    return [startArray, selectionArray, endArray];
}
import FetchConstants from "../constants/fetchConstants"
import FetchStore from '../stores/fetchStore'
import { fetchSuccess, fetchError, nextPageSuccess } from "../actions/fetchActions"
import JavaFormatter from "../functions/javaFormatter"

export var sendRequest = function(action) {
    // update store with new request
    FetchStore.setCode(action.code)
    FetchStore.setType(action.type)
    FetchStore.setPage(0)
    FetchStore.setCounter(1)

    let typeArray = action.type.split(".")
    let pakage = action.type.substring(0, action.type.length - typeArray[typeArray.length - 1].length - 1)
    
    var xmlhttp = new XMLHttpRequest();
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
    // get current request settings
    let code = FetchStore.getCode()
    let type = FetchStore.getType()
    let page = FetchStore.getPage()
    
    // increment page by 1
    page += 1
    
    if (FetchStore.getCounter() <= 0) {
        return
    }

    let typeArray = type.split(".")
    let pakage = type.substring(0, type.length - typeArray[typeArray.length - 1].length - 1)

    var xmlhttp = new XMLHttpRequest();
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
    let formatter = new JavaFormatter("   ")

    responseArray.forEach(item => {
        item.selections.forEach(selection => {
            let start = selection.start.line
            let end = selection.end.line

            let code = identifySelection(item.code, start - 1, end, FetchConstants.SPLIT_OFFSET);

            let title = "Example " + FetchStore.getCounter() + " (Line " + start + ")"
            if (start !== end) {
                title = "Example " + FetchStore.getCounter() + " (Line " + start + "-" + end + ")"
            }

            if (code[1][0].includes("DatabaseConnection dbConn = new DatabaseConnection(cont);")) {
                console.log("here")
            }

            let formattedCodeArray = formatter.format(code[1])
            let formattedCode = splitSelection(formattedCodeArray, code[0]);

            data.push({
                title: title,
                repoUrl: item.repoUrl,
                fileUrl: item.fileUrl + "#L" + start,
                codeTop: formattedCode[0],
                codeHighlighted: formattedCode[1],
                codeBottom: formattedCode[2],
            })

            FetchStore.setCounter(FetchStore.getCounter() + 1)
        })
    })
    
    return {
        results: data,
        page: page
    }
}

let identifySelection = function(codeString, startRow, endRow, offset) {
    // Take string or array
    let codeArray
    if (typeof codeString === 'string') {
        codeArray = codeString.split('\n')
    } else {
        codeArray = codeString
    }

    return [codeArray.slice(startRow, endRow), codeArray.slice(startRow - offset, endRow + offset)]
}

let splitSelection = function(codeArray, selection) {
    let startArray = []
    let highlightedArray = []
    let endArray = []
    let selectionFound = false

    codeArray.forEach(line => {
        if (selection.length !== 0) {
            if (selection.reduce((result, sLine) => result || line.includes(sLine.trim()), false)) {
                selectionFound = true
                highlightedArray.push(line)
            } else if (selectionFound) {
                endArray.push(line)
            } else {
                startArray.push(line)
            }
        }
    })

    let startString = ""
    let highlightedString = ""
    let endString = ""
    if (startArray.length !== 0) {
        startString = startArray.reduce(((acc, line) => acc + "\n" + line))
    }
    if (highlightedArray.length !== 0) {
        highlightedString = highlightedArray.reduce(((acc, line) => acc + "\n" + line))
    }
    if (endArray.length !== 0) {
        endString = endArray.reduce(((acc, line) => acc + "\n" + line))
    }

    return [startString, highlightedString, endString];
}
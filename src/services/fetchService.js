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

            let code = splitCode(item.code, start - 1, end, FetchConstants.SPLIT_OFFSET);

            let title = "Example " + FetchStore.getCounter() + " (Line " + start + ")"
            if (start !== end) {
                title = "Example " + FetchStore.getCounter() + " (Line " + start + "-" + end + ")"
            }

            let formattedCodeArray = formatter.format(code[0] + '\n' + code[1] + '\n' + code[2])
            let formattedCode = splitCode(formattedCodeArray, FetchConstants.SPLIT_OFFSET,
                FetchConstants.SPLIT_OFFSET + end - start + 1, FetchConstants.SPLIT_OFFSET);

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

let splitCode = function(codeString, startRow, endRow, offset) {
    let array
    if (typeof codeString === 'string') {
        array = codeString.split('\n');
    } else {
        array = codeString
    }

    let startArray = array.slice(startRow - offset, startRow)
    let highlightedArray = array.slice(startRow, endRow)
    let endArray = array.slice(endRow, endRow + offset)

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
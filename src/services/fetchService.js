import FetchConstants from "../constants/fetchConstants"
import FetchStore from '../stores/fetchStore'
import { fetchSuccess, fetchError, nextPageSuccess } from "../actions/fetchActions"
import { format, formatPrefix, formatSuffix } from "../functions/formater"

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
    responseArray.forEach(item => {
        item.selections.forEach(selection => {
            let start = selection.start.line
            let end = selection.end.line

            let code = splitCode(item.code, start - 1, end - 1);

            let title = "Example " + FetchStore.getCounter() + " (Line " + start + ")"
            if (start !== end) {
                title = "Example " + FetchStore.getCounter() + " (Line " + start + "-" + end + ")"
            }

            let formattedCode = format(code[0] + code[1] + code[2], "    ", null, '{', '}')
            let formattedPrefix = formattedCode.slice(0, 10)
            formattedPrefix = formatPrefix(formattedPrefix.reduce(((acc, line) => acc + '\n' + line)))
            let formattedStart = FetchConstants.SPLIT_OFFSET
            let formattedEnd = formattedStart + end - start + 1
            let highlighted = formattedCode.slice(formattedStart, formattedEnd)
            let formattedSuffix = formatSuffix(formattedCode.slice(formattedEnd)
                .reduce(((acc, line) => acc + "\n" + line)))

            data.push({
                title: title,
                repoUrl: item.repoUrl,
                fileUrl: item.fileUrl + "#L" + start,
                codeTop: formattedPrefix,
                codeHighlighted: highlighted.reduce(((acc, line) => acc + "\n" + line)),
                codeBottom: formattedSuffix
            })

            FetchStore.setCounter(FetchStore.getCounter() + 1)
        })
    })
    
    return {
        results: data,
        page: page
    }
}

let splitCode = function(codeString, startRow, endRow) {
    let array = codeString.split('\n');
    
    let startString = "";
    let highlightedString = "";
    let endString = "";
    for (let i = 0; i < array.length; i++) {
        if (i >= startRow - FetchConstants.SPLIT_OFFSET && i < startRow) {
            startString += array[i] + "\n";
        } else if (i <= endRow && i >= startRow) {
            highlightedString += array[i] + "\n";
        } else if (i <= endRow + FetchConstants.SPLIT_OFFSET && i > endRow) {
            endString += array[i] + "\n";
        }
    }

    return [startString, highlightedString, endString];
}
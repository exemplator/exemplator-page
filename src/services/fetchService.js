import FetchConstants from "../constants/fetchConstants"
import { fetchSuccess, fetchError } from "../actions/fetchActions"

export var sendRequest = function(action) {
    let typeArray = action.type.split(".")
    let pakage = action.type.substring(0, action.type.length - typeArray[typeArray.length - 1].length - 1)

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", FetchConstants.FETCH_URL);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                handleResponseSuccess(xmlhttp.responseText)
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

let handleResponseSuccess = function(responses) {
    let response = JSON.parse(responses);
    let responseArray = response.occurrences;

    let data = []
    responseArray.forEach(item => {
        if (item.selections.length > 0) {
            let start = item.selections[0].start.line
            let end = item.selections[0].end.line
            if (end == start) {
                end = start + 1
            }

            let code = splitCode(item.code, start, end);

            data.push({
                title: "title",
                userUrl: item.userUrl,
                rawUrl: item.rawUrl,
                codeTop: code[0],
                codeHighlighted: code[1],
                codeBottom:  code[2]
            })
        }
    })
    
    console.log(data)

    fetchSuccess(data);
}

var splitCode = function (codeString, startRow, endRow) {
    var array = codeString.split('\n');

    var startString = "";
    var highlightedString = "";
    var endString = "";
    for (var i = 0; i < array.length; i++) {
        if (i >= startRow - 10 && i < startRow) {
            startString += array[i] + "\n";
        } else if (i <= endRow && i >= startRow) {
            highlightedString += array[i] + "\n";
        } else if (i <= endRow + 10 && i > endRow) {
            endString += array[i] + "\n";
        }
    }

    return [startString, highlightedString, endString];
}

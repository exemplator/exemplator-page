import request from 'reqwest';
import when from 'when';
import FetchConstants from "../constants/fetchConstants"
import { fetchSuccess, fetchError } from "../actions/fetchActions"
var Immutable = require('immutable');

export var sendRequest = function(action) {
    
    let typeArray = action.type.split(".")
    let pakage = action.type.substring(0, action.type.length - typeArray[typeArray.length - 1].length - 1)

    console.log("got there")
    
    return handleResponse(when(request({
        url: FetchConstants.FETCH_URL,
        method: 'POST',
        type: 'application/json',
        data: {
            package: pakage,
            class: typeArray[typeArray.length -1],
            token: action.code,
            page: action.page
        }
    })));
}

export var handleResponse = function(responsePromise) {
    return responsePromise
        .then(function(responseJSON) {
            let response = JSON.parse(responseJSON);
            var responseArray = response.occurrences;

            var data = Immutable.List(responseArray)

            responseArray.map(item => {
                if (item.selections.length > 0) {
                    let start = item.selections[0].start.line
                    let end = item.selections[0].end.line
                    if (end == start) {
                        end = start + 1
                    }

                    let code = splitCode(item.code, start, end);

                    return {
                        userUrl: item.userUrl,
                        rawUrl: item.rawUrl,
                        codeTop: code[0],
                        codeHighlighted: code[1],
                        codeBottom:  code[2]
                    }
                }
            })

            fetchSuccess(data);
            return true
        })
        .catch(function(error) {
            fetchError(error)
            return false
        })
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

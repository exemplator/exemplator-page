var sendRequest = function (exemplatorPluginView, request, page = 0) {
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
                handleResponse(exemplatorPluginView, xmlhttp.responseText);
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

var handleResponse = function (exemplatorPluginView, responseText) {
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
                codeHighlighted: code[1],
                codeBottom:  code[2]
            }
            data.examples.push(element)
        }
    })

    exemplatorPluginView.setData(data);
}

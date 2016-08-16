import AppDispatcher from '../dispatchers/appDispatcher';
import FetchConstants from '../constants/fetchConstants.js';

export var initFetch = function(code, type) {
    let action = {
        actionType: FetchConstants.FETCH_INIT,
        code: code,
        type: type
    }
    
    let results = [{
        title: "title",
        githubURL: "https://www.google.com",
        rawURL: "https://www.google.com",
        codeTop: "const woah = fun => fun + 1;\n" +
                 "const dude = woah(2) + 3;\n" +
                 "function thisIsAFunction() {\n",
        codeHighlighted: "  return [1,2,3].map(n => n + 1).filter(n !== 3);\n",
        codeBottom: "}\n" +
                    "console.log('making up fake code is really hard');\n"
    }, {
        title: "title",
        githubURL: "https://www.google.com",
        rawURL: "https://www.google.com",
        codeTop: "const woah = fun => fun + 1;\n" +
        "const dude = woah(2) + 3;\n" +
        "function thisIsAFunction() {\n",
        codeHighlighted: "  return [1,2,3].map(n => n + 1).filter(n !== 3);\n",
        codeBottom: "}\n" +
        "console.log('making up fake code is really hard');\n"
    }, {
        title: "title",
        githubURL: "https://www.google.com",
        rawURL: "https://www.google.com",
        codeTop: "const woah = fun => fun + 1;\n" +
        "const dude = woah(2) + 3;\n" +
        "function thisIsAFunction() {\n",
        codeHighlighted: "  return [1,2,3].map(n => n + 1).filter(n !== 3);\n",
        codeBottom: "}\n" +
        "console.log('making up fake code is really hard');\n"
    }, {
        title: "title",
        githubURL: "https://www.google.com",
        rawURL: "https://www.google.com",
        codeTop: "const woah = fun => fun + 1;\n" +
        "const dude = woah(2) + 3;\n" +
        "function thisIsAFunction() {\n",
        codeHighlighted: "  return [1,2,3].map(n => n + 1).filter(n !== 3);\n",
        codeBottom: "}\n" +
        "console.log('making up fake code is really hard');\n"
    }]
    
    fetchSuccess(results)
}

export var fetchSuccess = function(results) {
    AppDispatcher.dispatch({
        actionType: FetchConstants.FETCH_SUCCESS,
        results: results
    })
}

export var fetchError = function(error) {
    AppDispatcher.dispatch({
        actionType: FetchConstants.FETCH_ERROR,
        error: error
    })
}
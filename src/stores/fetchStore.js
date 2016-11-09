import AppDispatcher from '../dispatchers/appDispatcher'
import BaseStore from './baseStore';
import FetchConstants from '../constants/fetchConstants.js';
import assign from 'object-assign'

// Current settings
var _code = ""
var _type = ""
var _page = 0
var _counter = 1

// Current data
var _codeSamples = []
var _error = ""

var FetchStore = assign({}, BaseStore, {
    setCode(code) {
        _code = code
    },
    getCode() {
        return _code
    },

    setType(type) {
        _type = type
    },
    getType() {
        return _type
    },

    setPage(page) {
        _page = page
    },
    getPage() {
        return _page
    },

    setCounter(counter) {
        _counter = counter
    },
    getCounter() {
        return _counter
    },

    setCodeSamples(codeSamples) {
        _codeSamples = codeSamples
    },
    getCodeSamples() {
        return _codeSamples
    },

    setError(error) {
        _error = error
    },
    getError() {
        return _error
    }
});

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case FetchConstants.FETCH_SUCCESS:
            if (action.results.size !== 0) {
                FetchStore.setCodeSamples(action.results)
                FetchStore.setPage(action.page)
                FetchStore.setError("")
                FetchStore.emitChange()
            }
            break
        case FetchConstants.NEXT_PAGE_SUCCESS:
            if (action.results.size !== 0) {
                let results = [].concat(FetchStore.getCodeSamples(), action.results)
                FetchStore.setCodeSamples(results)
                FetchStore.setPage(action.page)
                FetchStore.setError("")
                FetchStore.emitChange()
            }
            break
        case FetchConstants.FETCH_ERROR:
            if (action.error !== "") {
                FetchStore.setError(action.error)
                FetchStore.emitChange()
            }
            break
        default:
            // no op
    }
})

export default FetchStore
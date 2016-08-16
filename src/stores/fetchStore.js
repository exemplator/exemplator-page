import AppDispatcher from '../dispatchers/appDispatcher'
import BaseStore from './baseStore';
import FetchConstants from '../constants/fetchConstants.js';
import assign from 'object-assign'

var _codeSamples = []
var _error = ""

var FetchStore = assign({}, BaseStore, {
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
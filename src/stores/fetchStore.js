import AppDispatcher from '../dispatchers/appDispatcher'
import BaseStore from './baseStore';
import FetchConstants from '../constants/fetchConstants.js';
import assign from 'object-assign'

var _codeSamples = []

var FetchStore = assign({}, BaseStore, {
    getCodeSamples() {
        return _codeSamples
    },

    setCodeSamples(codeSamples) {
        _codeSamples = codeSamples
    }
});

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case FetchConstants.FETCH_SUCCESS:
            if (action.results.size !== 0) {
                
            }
            break
        case FetchConstants.FETCH_ERROR:
            if (action.error !== "") {
                
            }
            break
        default:
            // no op
    }
})

export default FetchStore
import AppDispatcher from '../dispatchers/appDispatcher';
import FetchConstants from '../constants/fetchConstants.js';

export var initFetch = function(code, type) {
    let action = {
        actionType: FetchConstants.FETCH_INIT,
        code: code,
        type: type
    }
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
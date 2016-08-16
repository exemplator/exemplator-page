import AppDispatcher from '../dispatchers/appDispatcher';
import FetchConstants from '../constants/fetchConstants.js';
import { sendRequest, fetchNextPage } from '../services/fetchService'

export var initFetch = function(code, type, page) {
    let action = {
        actionType: FetchConstants.FETCH_INIT,
        code: code,
        type: type,
        page: page
    }
    
    sendRequest(action)
}

export var loadNextPage = function() {
    fetchNextPage()
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

export var nextPageSuccess = function(results) {
    AppDispatcher.dispatch({
        actionType: FetchConstants.NEXT_PAGE_SUCCESS,
        results: results
    })
}
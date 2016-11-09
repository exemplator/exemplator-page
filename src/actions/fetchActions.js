import AppDispatcher from '../dispatchers/appDispatcher';
import FetchConstants from '../constants/fetchConstants.js';
import { sendRequest, fetchNextPage } from '../services/fetchService'
import { startLoadingAnimation, endLoadingAnimation } from './loadAnimationActions'

export var initFetch = function(code, type, page) {
    let action = {
        actionType: FetchConstants.FETCH_INIT,
        code: code,
        type: type,
        page: page
    }
    startLoadingAnimation()
    sendRequest(action)
}

export var loadNextPage = function() {
    fetchNextPage()
}

export var fetchSuccess = function(results, page) {
    endLoadingAnimation()
    AppDispatcher.dispatch({
        actionType: FetchConstants.FETCH_SUCCESS,
        results: results,
        page: page
    })
}

export var fetchError = function(error) {
    endLoadingAnimation()
    AppDispatcher.dispatch({
        actionType: FetchConstants.FETCH_ERROR,
        error: error
    })
}

export var nextPageSuccess = function(results, page) {
    AppDispatcher.dispatch({
        actionType: FetchConstants.NEXT_PAGE_SUCCESS,
        results: results,
        page: page
    })
}
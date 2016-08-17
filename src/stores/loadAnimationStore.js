import AppDispatcher from '../dispatchers/appDispatcher'
import BaseStore from './baseStore';
import LoadingAnimationConstants from '../constants/loadAnimationConstants.js';
import assign from 'object-assign'

// Current settings
var _isLoading = false

var LoadAnimationStore = assign({}, BaseStore, {
    setLoadingState(loadingState) {
        _isLoading = loadingState
    },
    isLoading() {
        return _isLoading
    }
});

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case LoadingAnimationConstants.START_ANIMATION:
            LoadAnimationStore.setLoadingState(true)
            LoadAnimationStore.emitChange()
            break
        case LoadingAnimationConstants.END_ANIMATION:
            LoadAnimationStore.setLoadingState(false)
            LoadAnimationStore.emitChange()
            break
        default:
            // no op
    }
})

export default LoadAnimationStore
import AppDispatcher from "../dispatchers/appDispatcher";
import LoadingAnimationConstants from "../constants/loadAnimationConstants.js";

export var startLoadingAnimation = function () {
  AppDispatcher.dispatch({
    actionType: LoadingAnimationConstants.START_ANIMATION
  })
}

export var endLoadingAnimation = function () {
  AppDispatcher.dispatch({
    actionType: LoadingAnimationConstants.END_ANIMATION
  })
}
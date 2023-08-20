import axios from "axios";

export const setVoteModalStatusAction =
  (status, player) => async (dispatch) => {
    dispatch({
      type: "OPEN_VOTE_MODAL",
      payload: { status, player },
    });
  };

export const socketRefAction = (socket) => async (dispatch) => {
  dispatch({
    type: "SOCKET_REF",
    payload: socket,
  });
};

export const setSettingModalAction = (settingStatus) => async (dispatch) => {
  dispatch({
    type: "OPEN_SETTING_MODAL",
    payload: settingStatus,
  });
};

export const setPlayerDrawingAction = (playerDrawing) => async (dispatch) => {
  dispatch({
    type: "SET_PLAYER_DRAWING",
    payload: playerDrawing,
  });
};

export const setShowGameAction = (showGame) => async (dispatch) => {
  dispatch({
    type: "SET_SHOW_GAME",
    payload: showGame,
  });
};

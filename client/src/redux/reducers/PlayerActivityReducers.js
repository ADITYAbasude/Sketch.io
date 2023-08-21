export const setVoteModalStatusReducer = (
  state = {
    status: false,
    player: {
      avatar: [0, 0, 0, 0, 0, 0],
      userName: "",
      score: 0,
      rank: 0,
      socketId: "",
      wordGuessed: false,
      kickVotes: 0,
    },
  },
  action
) => {
  switch (action.type) {
    case "OPEN_VOTE_MODAL":
      return {
        ...state,
        status: action.payload.status,
        player: action.payload.player,
      };
    default:
      return {
        ...state,
        status: state.status,
        player: state.player,
      };
  }
};

export const socketRefReducer = (state = { socket: null }, action) => {
  switch (action.type) {
    case "SOCKET_REF":
      return {
        ...state,
        socket: action.payload.current,
      };
    default:
      return {
        ...state,
        socket: state.socket,
      };
  }
};
export const setSettingModalReducer = (
  state = { settingStatus: false },
  action
) => {
  switch (action.type) {
    case "OPEN_SETTING_MODAL":
      return {
        ...state,
        settingStatus: action.payload,
      };
    default:
      return {
        ...state,
        settingStatus: state.settingStatus,
      };
  }
};

export const setPlayerDrawingReducer = (
  state = { playerDrawing: false },
  action
) => {
  switch (action.type) {
    case "SET_PLAYER_DRAWING":
      return {
        ...state,
        playerDrawing: action.payload,
      };
    default:
      return {
        ...state,
        playerDrawing: state.playerDrawing,
      };
  }
};

export const setShowGameReducer = (state = { showGame: false }, action) => {
  switch (action.type) {
    case "SET_SHOW_GAME":
      return {
        ...state,
        showGame: action.payload,
      };
    default:
      return {
        ...state,
        showGame: state.showGame,
      };
  }
};

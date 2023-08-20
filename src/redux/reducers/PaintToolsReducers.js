export const brushSizeReducer = (state = { size: 1 }, action) => {
  switch (action.type) {
    case "SET_BRUSH_SIZE":
      return {
        ...state,
        size: action.payload,
      };
    default:
      return {
        ...state,
        size: state.size,
      };
  }
};

export const brushColorReducer = (state = { color: "black" }, action) => {
  switch (action.type) {
    case "SET_BRUSH_COLOR":
      return {
        ...state,
        color: action.payload,
      };
    default:
      return {
        ...state,
        color: state.color,
      };
  }
};

export const selectToolReducer = (state = { tool: 1 }, action) => {
  switch (action.type) {
    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.payload,
      };
    default:
      return {
        ...state,
        tool: state.tool,
      };
  }
};
export const setCanvasClearReducer = (state = { clear: false }, action) => {
  switch (action.type) {
    case "SET_CANVAS_CLEAR":
      return {
        ...state,
        clear: action.payload,
      };
    default:
      return {
        ...state,
        clear: state.clear,
      };
  }
};

export const setCanvasUndoReducer = (state = { undo: false }, action) => {
  switch (action.type) {
    case "SET_CANVAS_UNDO":
      return {
        ...state,
        undo: action.payload,
      };
    default:
      return {
        ...state,
        undo: state.undo,
      };
  }
};

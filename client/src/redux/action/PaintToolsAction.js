export const setBrushSize = (size) => async (dispatch) => {
  dispatch({
    type: "SET_BRUSH_SIZE",
    payload: size,
  });
};

export const setBrushColor = (color) => async (dispatch) => {
  dispatch({
    type: "SET_BRUSH_COLOR",
    payload: color,
  });
};

export const selectTool = (tool) => async (dispatch) => {
  dispatch({
    type: "SELECT_TOOL",
    payload: tool,
  });
};

export const setCanvasClear = (clear) => async (dispatch) => {
  dispatch({
    type: "SET_CANVAS_CLEAR",
    payload: clear,
  });
};

export const setCanvasUndo = (undo) => async (dispatch) => {
  dispatch({
    type: "SET_CANVAS_UNDO",
    payload: undo,
  });
};

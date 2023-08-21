import { combineReducers } from "redux";
import {
  brushColorReducer,
  brushSizeReducer,
  selectToolReducer,
  setCanvasClearReducer,
  setCanvasUndoReducer,
} from "./reducers/PaintToolsReducers";
import {
  setPlayerDrawingReducer,
  setSettingModalReducer,
  setShowGameReducer,
  setVoteModalStatusReducer,
  socketRefReducer,
} from "./reducers/PlayerActivityReducers";
export const reducers = combineReducers({
  brushSize: brushSizeReducer,
  brushColor: brushColorReducer,
  selectTool: selectToolReducer,
  setCanvasClear: setCanvasClearReducer,
  setCanvasUndo: setCanvasUndoReducer,
  setVoteModalStatus: setVoteModalStatusReducer,
  socketRef: socketRefReducer,
  setSettingModal: setSettingModalReducer,
  setPlayerDrawing: setPlayerDrawingReducer,
  setShowGame: setShowGameReducer,
});

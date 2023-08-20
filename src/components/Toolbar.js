import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTool,
  setBrushColor,
  setBrushSize,
  setCanvasClear,
  setCanvasUndo,
  setFillAction,
} from "../redux/action/PaintToolsAction";
import {
  BRUSH_SIZE_X1,
  BRUSH_SIZE_X2,
  BRUSH_SIZE_X3,
  BRUSH_SIZE_X4,
  BRUSH_SIZE_X5,
  TOOL_BRUSH,
  TOOL_FILL,
} from "../constants/Values";

export const Toolbar = () => {
  const [openBrushes, setOpenBrushes] = useState(false);

  const dispatch = useDispatch();
  const { size } = useSelector((state) => state.brushSize);
  const { color } = useSelector((state) => state.brushColor);
  const { tool } = useSelector((state) => state.selectTool);
  const { playerDrawing } = useSelector((state) => state.setPlayerDrawing);

  const topColors = [
    "rgb(255, 255, 255)",
    "rgb(193, 193, 193",
    "rgb(239, 19, 11)",
    "rgb(255, 113, 0)",
    "rgb(255, 228, 0)",
    "rgb(0, 204, 0)",
    "rgb(0, 255, 145)",
    "rgb(0, 178, 255)",
    "rgb(35, 31, 211)",
    "rgb(163, 0, 186)",
    "rgb(223, 105, 167)",
    "rgb(255, 172, 142)",
    "rgb(160, 82, 45)",
  ];
  const bottomColors = [
    "rgb(0, 0, 0)",
    "rgb(80, 80, 80)",
    "rgb(116, 11, 7)",
    "rgb(194, 56, 0)",
    "rgb(232, 162, 0)",
    "rgb(0, 70, 25)",
    "rgb(0, 120, 93)",
    "rgb(0, 86, 158)",
    "rgb(14, 8, 101)",
    "rgb(85, 0, 105)",
    "rgb(135, 53, 84)",
    "rgb(204, 119, 77)",
    "rgb(99, 48, 13)",
  ];
  const setTool = (tool) => (e) => {
    e.preventDefault();
    dispatch(selectTool(tool));
  };

  const setSizeOfBrush = (size) => (e) => {
    e.preventDefault();
    dispatch(setBrushSize(size));
  };

  const setColorOfBrush = (color) => (e) => {
    e.preventDefault();
    dispatch(setBrushColor(color));
  };

  const clearCanvas = (clearState) => (e) => {
    e.preventDefault();
    dispatch(setCanvasClear(clearState));
  };

  const undoTheLastAction = (canvasUndo) => (e) => {
    e.preventDefault();
    dispatch(setCanvasUndo(canvasUndo));
  };
  return (
    <div
      className="game-toolbar"
      style={{ display: playerDrawing ? "" : "none" }}
    >
      <div className="colors-group">
        <div
          className="preview-color"
          style={{ backgroundColor: `${color}` }}
        ></div>
        <div className="colors">
          <div className="top-colors">
            {topColors.map((color, index) => (
              <div
                key={index}
                className="color"
                style={{ backgroundColor: color }}
                onClick={setColorOfBrush(color)}
              ></div>
            ))}
          </div>
          <div className="bottom-colors">
            {bottomColors.map((color, index) => (
              <div
                key={index}
                className="color"
                style={{ backgroundColor: color }}
                onClick={setColorOfBrush(color)}
              ></div>
            ))}
          </div>
        </div>
        <div className="sizes">
          <div
            className="size-selected"
            onClick={() => {
              setOpenBrushes(!openBrushes);
            }}
          >
            <div
              className="icon"
              style={{ backgroundSize: `${size * 20}%` }}
            ></div>
          </div>
          <div
            className="size-container"
            style={{ display: `${openBrushes ? "flex" : "none"}` }}
          >
            {/* <div className="arrow"></div> */}
            <div
              className={
                size === BRUSH_SIZE_X1
                  ? `size clickable clicked selected`
                  : `size clickable`
              }
              onClick={setSizeOfBrush(1)}
            >
              <div className="icon" style={{ backgroundSize: "20%" }}></div>
            </div>
            <div
              className={
                size === BRUSH_SIZE_X2
                  ? `size clickable clicked selected`
                  : `size clickable`
              }
              onClick={setSizeOfBrush(2)}
            >
              <div className="icon" style={{ backgroundSize: "40%" }}></div>
            </div>
            <div
              className={
                size === BRUSH_SIZE_X3
                  ? `size clickable clicked selected`
                  : `size clickable`
              }
              onClick={setSizeOfBrush(3)}
            >
              <div className="icon" style={{ backgroundSize: "60%" }}></div>
            </div>
            <div
              className={
                size === BRUSH_SIZE_X4
                  ? `size clickable clicked selected`
                  : `size clickable`
              }
              onClick={setSizeOfBrush(4)}
            >
              <div className="icon" style={{ backgroundSize: "80%" }}></div>
            </div>
            <div
              className={
                size === BRUSH_SIZE_X5
                  ? `size clickable clicked selected`
                  : `size clickable`
              }
              onClick={setSizeOfBrush(5)}
            >
              <div className="icon" style={{ backgroundSize: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="tools-group">
        <div
          className={`tool clickable ${tool === TOOL_BRUSH ? "selected" : ""}`}
          onClick={setTool(TOOL_BRUSH)}
        >
          <div className="icon brush"></div>
        </div>
        <div
          className={`tool clickable ${tool === TOOL_FILL ? "selected" : ""}`}
          onClick={setTool(TOOL_FILL)}
        >
          <div
            className="icon fill"
            // onClick={() => {
            //   if (fill) dispatch(setFillAction(false));
            //   else dispatch(setFillAction(true));
            // }}
          ></div>
        </div>
      </div>
      <div className="action-group">
        <div className="action clickable" onClick={undoTheLastAction(true)}>
          <div className="icon undo"></div>
        </div>
        <div className="action clickable" onClick={clearCanvas(true)}>
          <div className="icon clear"></div>
        </div>
      </div>
    </div>
  );
};

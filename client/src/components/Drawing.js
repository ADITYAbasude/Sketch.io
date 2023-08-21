import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCanvasClear,
  setCanvasUndo,
} from "../redux/action/PaintToolsAction";
import { Overlay } from "./Overlay";
import { setPlayerDrawingAction } from "../redux/action/PlayerActivityAction";
import { TOOL_BRUSH, TOOL_FILL } from "../constants/Values";

export const Drawing = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([0, 0, 0, 0]);
  const [group, setGroup] = useState(1);
  const [stroke, setStroke] = useState([]);

  const { size } = useSelector((state) => state.brushSize);
  const { color } = useSelector((state) => state.brushColor);
  const { clear } = useSelector((state) => state.setCanvasClear);
  const { undo } = useSelector((state) => state.setCanvasUndo);
  const { playerDrawing } = useSelector((state) => state.setPlayerDrawing);
  const { tool } = useSelector((state) => state.selectTool);
  const dispatch = useDispatch();

  const { socket } = useSelector((state) => state.socketRef);

  const [words, setWords] = useState([]);

  socket.on("user", (players) => {
    if (players.length === 0) return;
    const player = players.find((player) => player.socketId === socket.id);
    if (player != null && player.drawing) {
      dispatch(setPlayerDrawingAction(true));
    } else {
      dispatch(setPlayerDrawingAction(false));
    }
  });

  useEffect(() => {
    socket.on("draw", (dataURL) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    });
  }, [socket, canvasRef]);

  useEffect(() => {
    socket.on("clear", () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }, [socket, canvasRef]);

  // Initialization when the component mount for the first time
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (playerDrawing) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 5;
      ctxRef.current = ctx;
    }
  }, [color, size, playerDrawing]);

  // Clearing the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (playerDrawing) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // canvas is cleared and all the strokes are removed
      setGroup(1);
      dispatch(setCanvasClear(false));

      socket.emit("clear");
    }
  }, [clear, playerDrawing]);

  //undoing the last stroke
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (playerDrawing) {
      ctx.strokeStyle = "#ffffff";
      for (let i = 0; i < stroke.length; i++) {
        if (stroke[stroke.length - 1].group === group - 1) {
          let temp = stroke[i];
          ctx.lineWidth = temp.size * 5;
          ctx.beginPath();
          ctx.moveTo(temp.x1, temp.y1);
          ctx.lineTo(temp.x2, temp.y2);
          ctx.stroke();
        } else {
          break;
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 5;
      dispatch(setCanvasUndo(false));
    }
  }, [undo, playerDrawing]);

  // server gives a 3 words and choose one of them
  socket.on("chooseWord", (words) => {
    setWords(words);
  });

  // starting the drawing
  const startDrawing = (e) => {
    if (!playerDrawing) return;

    if (tool === TOOL_BRUSH) {
      const arr = [...points];
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      let x1 = e.nativeEvent.offsetX;
      let y1 = e.nativeEvent.offsetY;
      arr[0] = x1;
      arr[1] = y1;
      setPoints(arr);
      setIsDrawing(true);
    }

    const dataURL = canvasRef.current.toDataURL();
    socket.emit("draw", (new Image().src = dataURL));
  };

  // ending the drawing
  const endDrawing = (e) => {
    if (!playerDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    setGroup(group + 1);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    if (!playerDrawing) return;
    if (tool === TOOL_BRUSH) {
      const arr = [...points];
      let x2 = e.nativeEvent.offsetX;
      let y2 = e.nativeEvent.offsetY;
      arr[2] = x2;
      arr[3] = y2;
      setPoints(arr);
      setStroke([
        ...stroke,

        new Stroke(points[0], points[1], x2, y2, color, size, group),
      ]);
      arr[0] = x2;
      arr[1] = y2;
      setPoints(arr);
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctxRef.current.stroke();
    }

    const dataURL = canvasRef.current.toDataURL();
    socket.emit("draw", (new Image().src = dataURL));
  };

  const clickEventInCanvas = (e) => {
    if (!playerDrawing) return;
    if (tool === TOOL_FILL) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const dataURL = canvasRef.current.toDataURL();
      socket.emit("draw", (new Image().src = dataURL));
    } else if (tool === TOOL_BRUSH) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      ctx.beginPath();
      ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      // ctx.closePath();
      const dataURL = canvasRef.current.toDataURL();
      socket.emit("draw", (new Image().src = dataURL));
    }
  };

  return (
    <div className="game-canvas">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={draw}
        onMouseOut={() => {
          if (playerDrawing) {
            ctxRef.current.closePath();
            setIsDrawing(false);
          }
        }}
        onClick={clickEventInCanvas}
        ref={canvasRef}
        height={`600px`}
        width={`800px`}
        style={{ cursor: playerDrawing ? "" : "default" }}
      ></canvas>
      <Overlay words={words} />
    </div>
  );
};

class Stroke {
  constructor(x1, y1, x2, y2, color, size, group) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.size = size;
    this.group = group;
  }
}

import "./App.css";
import { initWebGl } from "./webgl/init";
import {
  initStickyNote,
  bindStickyNote,
  drawStickyNote,
} from "./webgl/stickyNote";
import { useRef, useEffect, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [clearButton, setClearButton] = useState<any>(null);
  const [gl, setGl] = useState<any>(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    setCanvas(canvas);
    const button: any = buttonRef.current;
    setClearButton(button);
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    setGl(gl);
  }, []);

  useEffect(() => {
    console.log(gl);
    if (gl) {
      initWebGl({ gl: gl });
    }

    if (canvas) {
      canvas.addEventListener("mousedown", (e: any) => {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const stickyNoteContext = initStickyNote({ gl: gl });
        bindStickyNote({ gl: gl }, stickyNoteContext);

        drawStickyNote(
          { gl: gl },
          stickyNoteContext,
          { x, y },
          { r: 1, g: 0, b: 0 }
        );
      });
    }
  }, [gl]);

  useEffect(() => {
    if (canvas) {
      canvas.addEventListener("mousedown", (e: any) => {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const stickyNoteContext = initStickyNote({ gl: gl });
        bindStickyNote({ gl: gl }, stickyNoteContext);

        drawStickyNote(
          { gl: gl },
          stickyNoteContext,
          { x, y },
          { r: 0.78, g: 0.58, b: 0.02 }
        );
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (clearButton) {
      clearButton.addEventListener("click", (e: any) => {
        console.log("click!");
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
    }
  }, [clearButton]);

  return (
    <>
      <button ref={buttonRef} id="clearButton">
        Clear
      </button>
      <canvas ref={canvasRef} id="main" />
    </>
  );
}

export default App;

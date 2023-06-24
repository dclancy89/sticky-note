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
  const [canvas, setCanvas] = useState<any>(null);
  const [gl, setGl] = useState(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    setCanvas(canvas);
    const gl = canvas.getContext("webgl2");
    setGl(gl);
  }, []);

  useEffect(() => {
    console.log(gl);
    if (gl) {
      initWebGl({ gl: gl });

      const stickyNoteContext = initStickyNote({ gl: gl });
      bindStickyNote({ gl: gl }, stickyNoteContext);
    }
  }, [gl]);

  useEffect(() => {
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
  }, [canvas]);

  return <canvas ref={canvasRef} id="main" />;
}

export default App;

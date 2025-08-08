import "./App.css";
import { initWebGl } from "./webgl/init";
import {
  initStickyNote,
  bindStickyNote,
  drawStickyNote,
  generateStickyNoteData,
  clearCanvas,
  selectStickyNote,
  renderCanvas,
} from "./webgl/stickyNote";
import { getBMS } from "./webgl/helpers";
import { useRef, useEffect, useState } from "react";

let pixel = new Uint8Array(4);
let selected_object_id = -1;

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface StickyNote {
  zIndex: number;
  paper: {
    vertices: number[];
    color: Color;
  };
  shadow: {
    vertices: number[];
    color: Color;
  };
}

enum Mode {
  CREATE = "create",
  MOVE = "move",
}

const yellow: Color = { r: 252, g: 186, b: 3 };
const blue: Color = { r: 3, g: 173, b: 252 };
const purple: Color = { r: 119, g: 3, b: 252 };

const stickyNoteColors = {
  yellow,
  blue,
  purple,
};

function App() {
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [clearButton, setClearButton] = useState<any>(null);
  const [gl, setGl] = useState<any>(null);

  const [notesArr, setNotesArr] = useState<StickyNote[]>([]);
  const [activeColor, setActiveColor] = useState<string>("yellow");
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.CREATE);

  const colorRef = useRef(activeColor);
  const modeRef = useRef(currentMode);
  const notesArrRef = useRef(notesArr);

  // On page load, set the canvas w/ref
  // set the clear button w/ref
  // init webGL
  useEffect(() => {
    const canvas: any = canvasRef.current;
    setCanvas(canvas);
    const button: any = buttonRef.current;
    setClearButton(button);
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    setGl(gl);
  }, []);

  // If GL or the Canvas change, check for GL and
  // canvas then add event listener for mouse down
  useEffect(() => {
    if (gl) {
      initWebGl({ gl: gl });
    }

    if (canvas) {
      canvas.addEventListener("mousedown", (e: any) => {
        // Check for left click only
        if (e.button === 0) {
          let rect = canvas.getBoundingClientRect();
          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;

          // If it's create mode, create a sticky note!
          if (modeRef.current === Mode.CREATE) {
            // Figure out where the user clicked
            let rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            // Generate sticky note data and add it to the array of notes
            const note = generateStickyNoteData(
              { x, y },
              stickyNoteColors[
                colorRef.current as keyof typeof stickyNoteColors
              ]
            );
            setNotesArr((prev) => {
              return [...prev, note];
            });
          }

          // If it's Move mode, move the sticky note on drag
          if (modeRef.current === Mode.MOVE) {
            // Do stuff
            selectStickyNote({ gl: gl }, x, y, notesArrRef.current);
          }
        }
      });
    }
  }, [gl, canvas]);

  // When the notesArr changes we need to loop through
  // And re-render all the notes in the array.
  useEffect(() => {
    notesArrRef.current = notesArr;
    if (gl) {
      renderCanvas({ gl: gl }, notesArr, "view");
    }
  }, [notesArr]);

  useEffect(() => {
    if (clearButton) {
      clearButton.addEventListener("click", (e: any) => {
        setNotesArr([]);
      });
    }
  }, [clearButton]);

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    colorRef.current = color;
  };

  const handleModeChange = (mode: Mode) => {
    setCurrentMode(mode);
    modeRef.current = mode;
  };

  return (
    <>
      <div className="controls">
        <button
          id="getBMS"
          className="button"
          onClick={() => {
            getBMS(gl);
          }}
        >
          getBMS
        </button>
        <button ref={buttonRef} id="clearButton" className="button">
          Clear
        </button>
        <div className="colorButtonsContainer">
          <div
            id="yellow"
            className={activeColor === "yellow" ? "active" : ""}
            onClick={() => handleColorChange("yellow")}
          ></div>
          <div
            id="blue"
            className={activeColor === "blue" ? "active" : ""}
            onClick={() => handleColorChange("blue")}
          ></div>
          <div
            id="purple"
            className={activeColor === "purple" ? "active" : ""}
            onClick={() => handleColorChange("purple")}
          ></div>
        </div>
        <div className="modeSelect">
          <div
            id="create"
            className={currentMode === Mode.CREATE ? "currentMode" : ""}
            onClick={() => handleModeChange(Mode.CREATE)}
          >
            Create
          </div>
          <div
            id="move"
            className={currentMode === Mode.MOVE ? "currentMode" : ""}
            onClick={() => handleModeChange(Mode.MOVE)}
          >
            Move
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} id="main" />
    </>
  );
}

export default App;

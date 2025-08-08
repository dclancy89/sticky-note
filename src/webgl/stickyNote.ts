import {
  createProgram,
  createShader,
  getIDFromColor,
  IDToColor,
} from "./helpers";

import { type Color, type StickyNote } from "../App";

import { stickyNoteFragmentShaderSource } from "./shaders/StickyNote/fragmentShader";
import { stickyNoteVertexShaderSource } from "./shaders/StickyNote/vertexShader";

import { stickyNoteSelectFragmentShaderSource } from "./shaders/StickyNote/selectFragmentShader";
import { stickyNoteSelectVertexShaderSource } from "./shaders/StickyNote/selectVertexShader";

const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 200;

const rgbToDecimal = (rgb: number): number => {
  return rgb / 255;
};

export const initStickyNote = (
  glContext: any,
  isSelectMode: boolean = false
) => {
  const { gl } = glContext;

  // Shaders, program, and locations for the select layer

  if (isSelectMode) {
    const selectVertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      stickyNoteSelectVertexShaderSource
    );

    const selectFragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      stickyNoteSelectFragmentShaderSource
    );

    const selectProgram = createProgram(
      gl,
      selectVertexShader,
      selectFragmentShader
    );

    const selectPositionAttributeLocation = gl.getAttribLocation(
      selectProgram,
      "a_position"
    );
    const selectResolutionUniformLocation = gl.getUniformLocation(
      selectProgram,
      "u_resolution"
    );

    const selectColorLocation = gl.getUniformLocation(selectProgram, "u_color");

    const select = {
      program: selectProgram,
      positionAttributeLocation: selectPositionAttributeLocation,
      resolutionUniformLocation: selectResolutionUniformLocation,
      colorLocation: selectColorLocation,
    };

    return select;
  } else {
    const stickyNoteVertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      stickyNoteVertexShaderSource
    );
    const stickyNoteFragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      stickyNoteFragmentShaderSource
    );

    const stickyNoteProgram = createProgram(
      gl,
      stickyNoteVertexShader,
      stickyNoteFragmentShader
    );

    const positionAttributeLocation = gl.getAttribLocation(
      stickyNoteProgram,
      "a_position"
    );
    const resolutionUniformLocation = gl.getUniformLocation(
      stickyNoteProgram,
      "u_resolution"
    );
    const colorLocation = gl.getUniformLocation(stickyNoteProgram, "u_color");
    const stickyNote = {
      program: stickyNoteProgram,
      positionAttributeLocation,
      resolutionUniformLocation,
      colorLocation,
    };
    return stickyNote;
  }

  // Shaders, program, and locations for sticky note

  // const select = {
  //   program: selectProgram,
  //   positionAttributeLocation: selectPositionAttributeLocation,
  //   resolutionUniformLocation: selectResolutionUniformLocation,
  //   colorLocation: selectColorLocation,
  // };

  // const stickyNote = {
  //   program: stickyNoteProgram,
  //   positionAttributeLocation,
  //   resolutionUniformLocation,
  //   colorLocation,
  // };

  // return {
  //   select,
  //   stickyNote,
  // };
};

export const bindStickyNote = (glContext: any, stickyNoteContext: any) => {
  const { gl } = glContext;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // console.log(stickyNoteContext);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(stickyNoteContext.positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const pos_offset = 0;

  gl.vertexAttribPointer(
    stickyNoteContext.positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    pos_offset
  );

  gl.useProgram(stickyNoteContext.program);
  gl.uniform2f(
    stickyNoteContext.resolutionUniformLocation,
    gl.canvas.width,
    gl.canvas.height
  );
};

export const generateStickyNoteData = (
  location: any,
  color: Color
): StickyNote => {
  const bx1 = location.x + 2;
  const bx2 = bx1 + NOTE_WIDTH;

  const by1 = location.y + 2;
  const by2 = by1 + NOTE_HEIGHT;

  const shadowVerticies = [
    bx1,
    by1,
    bx2,
    by1,
    bx1,
    by2,
    bx1,
    by2,
    bx2,
    by1,
    bx2,
    by2,
  ];

  const x1 = location.x;
  const x2 = x1 + NOTE_WIDTH;

  const y1 = location.y;
  const y2 = y1 + NOTE_HEIGHT;

  const paperVerticies = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];

  return {
    zIndex: 0,
    paper: {
      vertices: paperVerticies,
      color: {
        r: rgbToDecimal(color.r),
        g: rgbToDecimal(color.g),
        b: rgbToDecimal(color.b),
      },
    },
    shadow: {
      vertices: shadowVerticies,
      color: {
        r: rgbToDecimal(0),
        g: rgbToDecimal(0),
        b: rgbToDecimal(0),
        a: 0.3,
      },
    },
  };
};

export const drawStickyNote = (
  glContext: any,
  stickyNoteContext: any,
  noteObject: { note: StickyNote; index: number },
  isSelectMode: boolean = false
) => {
  const { gl } = glContext;
  const { note, index } = noteObject;
  const { paper, shadow } = note;
  const shadowColor = shadow.color;
  const paperColor = paper.color;

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;

  if (!isSelectMode) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(shadow.vertices),
      gl.STATIC_DRAW
    );

    gl.uniform4f(
      stickyNoteContext.colorLocation,
      shadowColor.r,
      shadowColor.g,
      shadowColor.b,
      shadowColor.a
    );

    gl.drawArrays(primitiveType, offset, count);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(paper.vertices),
      gl.STATIC_DRAW
    );
    gl.uniform4f(
      stickyNoteContext.colorLocation,
      paperColor.r,
      paperColor.g,
      paperColor.b,
      1
    );

    gl.drawArrays(primitiveType, offset, count);
  } else {
    const color = IDToColor(gl, index);
    console.log("index:", index);
    console.log(color);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(paper.vertices),
      gl.STATIC_DRAW
    );
    gl.uniform4f(
      stickyNoteContext.color,
      color[0],
      color[1],
      color[2],
      color[3]
    );
    gl.drawArrays(primitiveType, offset, count);
  }
};

export const clearCanvas = (glContext: any) => {
  const { gl } = glContext;
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

export const renderCanvas = (
  glContext: any,
  notesArr: StickyNote[],
  renderMode: "select" | "view"
) => {
  const { gl } = glContext;

  if (gl) {
    if (renderMode === "select") {
      clearCanvas({ gl: gl });
      notesArr.forEach((note, index) => {
        const noteContext = initStickyNote({ gl: gl }, true);
        bindStickyNote({ gl: gl }, noteContext);
        drawStickyNote({ gl: gl }, noteContext, { note, index }, true);
      });

      // Do stuff for select
    } else {
      clearCanvas({ gl: gl });
      // console.log(notesArr);
      notesArr.forEach((note, index) => {
        const noteContext = initStickyNote({ gl: gl }, false);
        bindStickyNote({ gl: gl }, noteContext);
        drawStickyNote({ gl: gl }, noteContext, { note, index });
      });
    }
  }
};

export const selectStickyNote = (
  glContext: any,
  x: any,
  y: any,
  notesArr: any
) => {
  const { gl } = glContext;

  // console.log(notesArr);

  renderCanvas({ gl: gl }, notesArr, "select");

  let pixel = new window.Uint8Array(4);
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

  console.log(x);
  console.log(y);

  console.log(pixel);

  const selectedObject = getIDFromColor(
    gl,
    pixel[0],
    pixel[1],
    pixel[2],
    pixel[3]
  );

  console.log(selectedObject);

  // renderCanvas({ gl: gl }, notesArr, "view");
};

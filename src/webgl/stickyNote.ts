import { createProgram, createShader } from "./helpers";

import { stickyNoteFragmentShaderSource } from "./shaders/StickyNote/fragmentShader";
import { stickyNoteVertexShaderSource } from "./shaders/StickyNote/vertexShader";

const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 200;

export const initStickyNote = (glContext: any) => {
  console.log("initializing sticky note");
  const { gl } = glContext;
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

  return {
    program: stickyNoteProgram,
    positionAttributeLocation,
    resolutionUniformLocation,
    colorLocation,
  };
};

export const bindStickyNote = (glContext: any, stickyNoteContext: any) => {
  console.log("binding sticky note");
  const { gl } = glContext;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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

export const drawStickyNote = (
  glContext: any,
  stickyNoteContext: any,
  location: any,
  color: any
) => {
  console.log("drawing sticky note");
  console.log(stickyNoteContext);
  console.log(location);
  console.log(color);
  const { gl } = glContext;

  const x1 = location.x;
  const x2 = x1 + NOTE_WIDTH;

  const y1 = location.y;
  const y2 = y1 + NOTE_HEIGHT;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );

  gl.uniform4f(stickyNoteContext.colorLocation, color.r, color.g, color.b, 1);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

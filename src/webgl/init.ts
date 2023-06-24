import { resizeCanvasToDisplaySize } from "./helpers";

export const initWebGl = (glContext: any) => {
  console.log("initializing webgl2");
  const { gl } = glContext;
  resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

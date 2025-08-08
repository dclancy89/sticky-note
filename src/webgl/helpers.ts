export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
};

export const createShader = (gl: any, type: string, source: string) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

export const createProgram = (
  gl: any,
  vertexShader: string,
  fragmentShader: string
) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

export const getBMS = (gl: any) => {
  const redBits = gl.getParameter(gl.RED_BITS);
  const greenBits = gl.getParameter(gl.GREEN_BITS);
  const blueBits = gl.getParameter(gl.BLUE_BITS);
  const alphaBits = gl.getParameter(gl.ALPHA_BITS);

  const redMax = Math.pow(2, redBits) - 1;
  const greenMax = Math.pow(2, greenBits) - 1;
  const blueMax = Math.pow(2, blueBits) - 1;
  const alphaMax = Math.pow(2, alphaBits) - 1;

  const redShift = greenBits + blueBits + alphaBits;
  const greenShift = blueBits + alphaBits;
  const blueShift = alphaBits;

  return {
    max: {
      redMax,
      greenMax,
      blueMax,
      alphaMax,
    },
    shift: {
      redShift,
      greenShift,
      blueShift,
    },
  };
};

export const IDToColor = (gl: any, id: any) => {
  const bms = getBMS(gl);
  const { redMax, greenMax, blueMax, alphaMax } = bms.max;
  const { redShift, greenShift, blueShift } = bms.shift;

  let red, green, blue, alpha;

  red = ((id >> redShift) & redMax) / redMax;
  green = ((id >> greenShift) & greenMax) / greenMax;
  blue = ((id >> blueShift) & blueMax) / blueMax;
  alpha = (id & alphaMax) / alphaMax;

  return new Float32Array([red, green, blue, alpha]);
};

export const getIDFromColor = (
  gl: any,
  red: any,
  green: any,
  blue: any,
  alpha: any
) => {
  const bms = getBMS(gl);
  const { redShift, greenShift, blueShift } = bms.shift;

  return (
    (red << redShift) + (green << greenShift) + (blue << blueShift) + alpha
  );
};

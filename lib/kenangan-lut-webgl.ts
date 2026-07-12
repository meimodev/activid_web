// Client-side WebGL LUT engine, shared by the capture preview and the live
// feed thumbnail grader. The LUT texture atlas layout and trilinear sampling
// here must stay in lockstep with applyKenanganLut — covered by the parity
// test in data/kenangan-luts.test.ts.

import {
  KENANGAN_LUT_SIZE,
  buildKenanganLutTextureData,
  getKenanganLutPreset,
  type KenanganLutId,
} from "@/data/kenangan-luts";

export interface KenanganGlState {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  videoTexture: WebGLTexture;
  lutTexture: WebGLTexture;
  scaleXLocation: WebGLUniformLocation | null;
  loadedLutId: KenanganLutId | null;
}

const VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUv;
uniform float uScaleX;
void main() {
  vUv = vec2((aPos.x + 1.0) * 0.5, 1.0 - (aPos.y + 1.0) * 0.5);
  gl_Position = vec4(aPos.x * uScaleX, aPos.y, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uVideo;
uniform sampler2D uLut;
const float N = ${KENANGAN_LUT_SIZE}.0;

vec3 applyLut(vec3 c) {
  float b = clamp(c.b, 0.0, 1.0) * (N - 1.0);
  float b0 = floor(b);
  float f = b - b0;
  float b1 = min(b0 + 1.0, N - 1.0);
  float r = clamp(c.r, 0.0, 1.0) * (N - 1.0);
  float g = clamp(c.g, 0.0, 1.0) * (N - 1.0);
  float y = (g + 0.5) / N;
  vec3 s0 = texture2D(uLut, vec2((b0 * N + r + 0.5) / (N * N), y)).rgb;
  vec3 s1 = texture2D(uLut, vec2((b1 * N + r + 0.5) / (N * N), y)).rgb;
  return mix(s0, s1, f);
}

void main() {
  vec3 c = texture2D(uVideo, vUv).rgb;
  gl_FragColor = vec4(applyLut(c), 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
  return shader;
}

function setupTexture(gl: WebGLRenderingContext): WebGLTexture | null {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

export function createKenanganGl(canvas: HTMLCanvasElement): KenanganGlState | null {
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) return null;

  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  const videoTexture = setupTexture(gl);
  gl.activeTexture(gl.TEXTURE1);
  const lutTexture = setupTexture(gl);
  if (!videoTexture || !lutTexture) return null;

  gl.uniform1i(gl.getUniformLocation(program, "uVideo"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "uLut"), 1);

  return {
    gl,
    canvas,
    videoTexture,
    lutTexture,
    scaleXLocation: gl.getUniformLocation(program, "uScaleX"),
    loadedLutId: null,
  };
}

export function ensureKenanganLut(state: KenanganGlState, lutId: KenanganLutId): void {
  if (state.loadedLutId === lutId) return;
  const { gl } = state;
  const n = KENANGAN_LUT_SIZE;
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, state.lutTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    n * n,
    n,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    buildKenanganLutTextureData(getKenanganLutPreset(lutId)),
  );
  state.loadedLutId = lutId;
}

export function drawKenanganFrame(
  state: KenanganGlState,
  source: TexImageSource,
  mirror: boolean,
): void {
  const { gl } = state;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, state.videoTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  gl.uniform1f(state.scaleXLocation, mirror ? -1 : 1);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// ---------------------------------------------------------------------------
// Shared offscreen grader for feed thumbnails: one hidden GL canvas grades
// every incoming image; results are copied into small per-thumb 2D canvases.

let sharedGrader: KenanganGlState | null | undefined;

function getSharedGrader(): KenanganGlState | null {
  if (sharedGrader !== undefined) return sharedGrader;
  const canvas = document.createElement("canvas");
  sharedGrader = createKenanganGl(canvas);
  return sharedGrader;
}

/**
 * Grade a loaded (CORS-clean) image and paint the result into `target`.
 * Returns false when WebGL is unavailable — caller shows the ungraded image.
 */
export function gradeImageToCanvas(
  image: HTMLImageElement,
  lutId: KenanganLutId,
  target: HTMLCanvasElement,
): boolean {
  const state = getSharedGrader();
  if (!state) return false;
  state.canvas.width = image.naturalWidth;
  state.canvas.height = image.naturalHeight;
  ensureKenanganLut(state, lutId);
  drawKenanganFrame(state, image, false);
  target.width = image.naturalWidth;
  target.height = image.naturalHeight;
  const ctx = target.getContext("2d");
  if (!ctx) return false;
  ctx.drawImage(state.canvas, 0, 0);
  return true;
}

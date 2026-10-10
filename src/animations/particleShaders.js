export const particleVertexShader = `
uniform float uTime;
uniform float uMorph;
uniform float uPixelRatio;
uniform float uPointScale;
attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute vec3 aShape4;
attribute vec3 aShape5;
attribute float aSeed;
varying float vAlpha;

vec3 shapeAt(float index) {
  if (index < 0.5) return position;
  if (index < 1.5) return aShape1;
  if (index < 2.5) return aShape2;
  if (index < 3.5) return aShape3;
  if (index < 4.5) return aShape4;
  return aShape5;
}

void main() {
  float morph = clamp(uMorph + (aSeed - 0.5) * 0.35, 0.0, 5.0);
  float index = min(floor(morph), 4.0);
  float blend = smoothstep(0.0, 1.0, morph - index);
  vec3 point = mix(shapeAt(index), shapeAt(index + 1.0), blend);
  point *= 1.0 + sin(blend * 3.14159) * 0.3 * (aSeed - 0.3);
  point += vec3(
    sin(point.y * 3.0 + uTime * 0.9 + aSeed * 6.28318),
    sin(point.z * 3.0 + uTime * 0.7),
    sin(point.x * 3.0 + uTime * 0.8)
  ) * 0.04;

  vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = (2.6 + aSeed * 3.4) * uPointScale * uPixelRatio * (6.0 / -viewPosition.z);
  vAlpha = 0.65 + 0.35 * smoothstep(-8.0, -4.0, viewPosition.z);
}
`

export const particleFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;

void main() {
  float distanceFromCenter = length(gl_PointCoord - 0.5);
  if (distanceFromCenter > 0.5) discard;
  float softEdge = 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
  gl_FragColor = vec4(uColor, uOpacity * vAlpha * softEdge);
}
`

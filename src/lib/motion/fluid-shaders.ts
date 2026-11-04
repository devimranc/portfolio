export const fluidVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Effect-only overlay — does not re-sample the DOM image (prevents double-render ghosting). */
export const fluidFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uHover;
  uniform float uRipple;
  uniform vec2 uRippleOrigin;

  varying vec2 vUv;

  float wave(vec2 uv, vec2 origin, float strength) {
    float dist = distance(uv, origin);
    return sin(dist * 42.0 - uTime * 6.0) * exp(-dist * 9.0) * strength;
  }

  void main() {
    vec2 uv = vUv;
    vec2 pointer = uMouse / uResolution;

    float hoverDist = distance(uv, pointer);
    float hoverWave = smoothstep(0.35, 0.0, hoverDist) * uHover;
    float rippleWave = wave(uv, uRippleOrigin, uRipple);

    float liquid = sin((uv.x + uv.y) * 18.0 + uTime * 2.4) * 0.5 + 0.5;
    vec3 rim = vec3(0.45, 0.72, 1.0) * smoothstep(0.38, 0.0, hoverDist) * uHover;
    vec3 rippleColor = vec3(0.35, 0.58, 0.95) * rippleWave;

    float alpha = clamp(
      hoverWave * 0.18 + rippleWave * 0.32 + liquid * hoverWave * 0.08,
      0.0,
      0.48
    );

    gl_FragColor = vec4(rim + rippleColor, alpha);
  }
`;

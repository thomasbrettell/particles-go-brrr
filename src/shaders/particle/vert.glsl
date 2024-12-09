uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;

attribute vec3 position_2;

varying float vMorphProgress;

#include ../includes/simplexNoise3d.glsl;

float invertedSmoothStep(float progress) {
    float t = 1.0 - abs(progress - 0.5) * 2.0;
    return t * t * (3.0 - 2.0 * t);
}

void main()
{
    float noiseOriginal = simplexNoise3d(position * 0.7); 
    float noiseTarget = simplexNoise3d(position_2 * 0.7);
    float noise = mix(noiseOriginal, noiseTarget, uProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);

    vec3 mixedPosition = mix(position, position_2, progress);

    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vMorphProgress = invertedSmoothStep(progress);
}
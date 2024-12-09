varying float vMorphProgress;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);

    if(distanceToCenter > 0.5)
        discard;

    vec3 mixedColor = mix(vec3(0.0, 0.0, 0.0), vec3(0.89, 0.024, 0.074), vMorphProgress);

    gl_FragColor = vec4(mixedColor, 1.0);
}
// shamelessly copied from https://github.com/videojs/videojs-vr/blob/main/src/plugin.js

varying vec2 vUv;
uniform sampler2D map;
uniform bool equiangular;
uniform float contCorrect;
uniform vec2 faceWH;
uniform vec2 vidWH;

const float PI = 3.1415926535897932384626433832795;

void main() {
    vec2 corner = vUv - mod(vUv, faceWH) + vec2(0, contCorrect / vidWH.y);
    vec2 faceWHadj = faceWH - vec2(0, contCorrect * 2. / vidWH.y);
    vec2 p = (vUv - corner) / faceWHadj - .5;
    vec2 q = equiangular ? 2. / PI * atan(2. * p) + .5 : p + .5;
    vec2 eUv = corner + q * faceWHadj;
    gl_FragColor = texture2D(map, eUv);
}


uniform float32 delta;
uniform uint64 grid_x;
uniform uint64 grid_y;
uniform uint64 grid_z;
uniform sampler2D map;
uniform vec3 threshold;

varying vec2 vUv;

highp float random(vec2 uv) {
    highp float dt = dot(uv, vec2(12.9898, 78.233));
    highp float sn = mod(dt, 3.14); // Original
    // For per-frame randomization, add a time uniform, e.g., 'iTime'
    // highp float sn = mod(dt, 3.14 + iTime); 
    return fract(sin(sn) * 43758.5453 + delta);
}

vec3 smooth_step(vec3 xyz) {
  return (xyz * xyz * (3 - 2 * xyz));
}

vec3 lerp (vec3 v0, vec3 v1, t) {
  return v0 + (v1 - v0) * t;
}

void main() {

  

// identify grid cell

vec4 frag_color = texture(map.vUv);
vec3 rgb = normalize(frag_color.rgb); 
vec3 xyz = floor(rgb * vec3(grid_x, grid_y, grid_z)) / vec3(grid_x, grid_y, grid_z);
vec3 offsets = vec3[8];
float dots = float[8];
vec3 randos = vec3[8];
vec3 summ;

  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
      for (int k = 0; k < 2; z++) {
        int idx = i + i * j + i * j * k;
        randos[idx] = normalize(vec3(random(vec2(xyz.x + vUv.x, xyz.x + vUv.y)), random(vec2(xyz.y + vUv.x, xyz.y + vUv.y)), random(vec2(xyz.z + vUv.x, xyz.z + vUv.y)))) * 2 - 1;
        offsets[idx] = rgb - randos[idx];
        dots[idx] = dot(randos[idx], offsets[idx]);
        summ += smooth_step(dots[idx]);
      }
    }
  }

  vec3 noise = summ / 8.0;

  gl_FragColor = frag_color * noise;
}
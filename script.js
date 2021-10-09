
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';

function main() {

  // here you address your canvas
  const canvas = document.querySelector('#fullCanvas');
  // The WebGL renderer displays your beautifully crafted scenes using WebGL.
  const renderer = new THREE.WebGLRenderer({ canvas });

  // Make a new scene in three js
  const scene = new THREE.Scene();

  // create a camera and define it's position
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1);

  // add the fragement shader from shadertoys.comm
  const fragmentShader = `
      #ifdef GL_ES
      precision highp float;
      #endif

      float bump(float x) {
      	return abs(x) > 1.0 ? 1.0*x : x ;
      }

      #include <common>
        uniform vec3 iResolution;
        uniform float iTime;

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
      
        	vec2 uv = (fragCoord.xy / iResolution.xy);

        	float timeScroll = iTime* 1.0;
        	float sinusCurve = sin((uv.x*2.0+timeScroll)/0.5)*0.3;

        	uv.x = (uv.x + uv.y * 3.0 - 1.0) + sinusCurve;

        	float line = abs(0.3 * uv.x);

        	vec3 color = vec3(-0.5);

        	color.x = bump( cos(iTime)/(uv.y * 1.5));
        	color.y = bump( cos(iTime)*(uv.x - 2.5));
        	color.z = bump( cos(iTime)*(uv.x + 1.5));

        	fragColor = vec4(color, -2.9);
      }

        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
        `;

  // A class for generating plane geometries.
  const plane = new THREE.PlaneGeometry(5, 2);

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
  };

  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

  scene.add(new THREE.Mesh(plane, material));

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.002;  // convert to seconds

    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    // 2 seconds for every (full animation)
    uniforms.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

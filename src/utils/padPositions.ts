import * as THREE from "three";
import wrap from "./wrap";

const padPositions = (
  bufferAttribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  count: number
) => {
  const newArray = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const wrapped_i = wrap(i, 0, bufferAttribute.count);
    const wrapped_i3 = wrapped_i * 3;

    newArray[i3] = bufferAttribute.array[wrapped_i3];
    newArray[i3 + 1] = bufferAttribute.array[wrapped_i3 + 1];
    newArray[i3 + 2] = bufferAttribute.array[wrapped_i3 + 2];
  }

  return new THREE.Float32BufferAttribute(newArray, 3);
};

export default padPositions;

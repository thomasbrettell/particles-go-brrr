import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export const generateIsoPositions = () => {
  let geom:
    | THREE.BufferGeometry<THREE.NormalBufferAttributes>
    | THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(2, 200);
  geom.setIndex(null);
  geom.deleteAttribute("normal");
  geom.deleteAttribute("uv");
  geom = BufferGeometryUtils.mergeVertices(geom);

  return geom.getAttribute("position");
};

export const generateTorusPositions = () => {
  let geom:
    | THREE.BufferGeometry<THREE.NormalBufferAttributes>
    | THREE.IcosahedronGeometry = new THREE.TorusGeometry(1.5, 0.75, 400, 1000);
  geom.setIndex(null);
  geom.deleteAttribute("normal");
  geom.deleteAttribute("uv");
  geom = BufferGeometryUtils.mergeVertices(geom);

  return geom.getAttribute("position");
};

export const generateRingPositions = () => {
  let geom:
    | THREE.BufferGeometry<THREE.NormalBufferAttributes>
    | THREE.RingGeometry = new THREE.RingGeometry(2, 0, 800, 500);
  geom.setIndex(null);
  geom.deleteAttribute("normal");
  geom.deleteAttribute("uv");
  geom = BufferGeometryUtils.mergeVertices(geom);

  return geom.getAttribute("position");
};

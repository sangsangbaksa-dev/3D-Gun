/**
 * Headless collision audit: overlap metrics, arch/boss gate pass-through, perimeter walk, gather nodes.
 * Run: npx tsx tools/collision-audit.ts
 */
import { MAP, LANDMARKS, SCATTER_ROCKS } from '../src/data/map';
import {
  obstacles, boxObstacles, populateWorldObstacles, resolveObstacles, PLAY_HALF, BOUNDARY_INSET,
} from '../src/core/world';
import { generateLayout } from '../src/gathering/logic/nodes';
import { mulberry32 } from '../src/gathering/logic/rng';
import { blockRadius } from '../src/gathering/logic/gathering';
import type { GatherNode } from '../src/gathering/logic/nodes';
import * as THREE from 'three';

const PLAYER_R = 0.4;
const ZOMBIE_R = 0.45;

const mockScene = { add: () => mockScene } as unknown as THREE.Scene;
populateWorldObstacles(mockScene, obstacles, boxObstacles);

function distPointBox(px: number, pz: number, b: { x: number; z: number; hx: number; hz: number; rot?: number }) {
  const rot = b.rot ?? 0;
  const cos = Math.cos(rot), sin = Math.sin(rot);
  const dx = px - b.x, dz = pz - b.z;
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  const qx = Math.max(0, Math.abs(lx) - b.hx);
  const qz = Math.max(0, Math.abs(lz) - b.hz);
  return Math.hypot(qx, qz);
}

function penetrating(px: number, pz: number, r: number): boolean {
  for (const b of boxObstacles) {
    if (distPointBox(px, pz, b) < r - 0.02) return true;
  }
  for (const o of obstacles) {
    if (Math.hypot(px - o.x, pz - o.z) < o.r + r - 0.02) return true;
  }
  return false;
}

function countBoxCircleOverlapPairs(threshold = 0.55): number {
  let n = 0;
  for (const b of boxObstacles) {
    for (const o of obstacles) {
      if (Math.hypot(b.x - o.x, b.z - o.z) < threshold) n++;
    }
  }
  return n;
}

function archPassSamples(): { ok: number; total: number } {
  const arches = LANDMARKS.filter((l) => l.kind === 'arch');
  let ok = 0, total = 0;
  for (const arch of arches) {
    const cos = Math.cos(arch.yaw), sin = Math.sin(arch.yaw);
    for (let t = -0.68; t <= 0.68; t += 0.05) {
      const lx = t * 1.1;
      const x = arch.x + lx * cos;
      const z = arch.z - lx * sin;
      total++;
      const p = { x, z };
      resolveObstacles(p, PLAYER_R);
      if (!penetrating(p.x, p.z, PLAYER_R) && Math.hypot(p.x - x, p.z - z) < 0.35) ok++;
    }
  }
  return { ok, total };
}

function bossGatePass(): { ok: number; total: number } {
  let ok = 0, total = 0;
  for (let x = -4; x <= 4; x += 0.25) {
    const z = -162;
    total++;
    const p = { x, z };
    resolveObstacles(p, PLAYER_R);
    if (!penetrating(p.x, p.z, PLAYER_R)) ok++;
  }
  return { ok, total };
}

function walkPerimeter(radius: number, steps = 800): { escapes: number; stuck: number; maxInwardPush: number } {
  let escapes = 0;
  let stuck = 0;
  let maxInwardPush = 0;
  const target = PLAY_HALF - 0.15;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const sx = Math.cos(a) * (target - 2);
    const sz = Math.sin(a) * (target - 2);
    const p = { x: sx, z: sz };
    const before = Math.hypot(p.x, p.z);
    for (let s = 0; s < 12; s++) {
      const tx = Math.cos(a) * target;
      const tz = Math.sin(a) * target;
      p.x += (tx - p.x) * 0.35;
      p.z += (tz - p.z) * 0.35;
      resolveObstacles(p, radius);
    }
    const after = Math.hypot(p.x, p.z);
    if (after > PLAY_HALF + 0.05) escapes++;
    if (after < before - 3.5) stuck++;
    maxInwardPush = Math.max(maxInwardPush, before - after);
  }
  return { escapes, stuck, maxInwardPush };
}

function laneShoulderSamples(): { blocked: number; total: number } {
  let blocked = 0, total = 0;
  for (const lane of MAP.lanes) {
    for (let i = 0; i < lane.waypoints.length - 1; i++) {
      const a = lane.waypoints[i], b = lane.waypoints[i + 1];
      const dx = b.x - a.x, dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      const steps = Math.max(3, Math.floor(len / 4));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = a.x + dx * t, z = a.z + dz * t;
        const nx = -dz / len, nz = dx / len;
        for (const side of [-1, 1]) {
          for (const off of [2.2, 3.0]) {
            total++;
            const px = x + nx * side * off, pz = z + nz * side * off;
            const p = { x: px, z: pz };
            resolveObstacles(p, PLAYER_R);
            if (penetrating(p.x, p.z, PLAYER_R)) blocked++;
          }
        }
      }
    }
  }
  return { blocked, total };
}

function gatherNodeOverlaps(nodes: GatherNode[]): { hits: number; list: string[] } {
  const list: string[] = [];
  let hits = 0;
  for (const n of nodes) {
    const r = blockRadius(n);
    if (penetrating(n.x, n.z, r)) {
      hits++;
      list.push(`${n.kind}@${n.x.toFixed(1)},${n.z.toFixed(1)} r=${r.toFixed(2)} zone=${n.zone}`);
    }
  }
  return { hits, list };
}

function mountainInsidePlay(): number {
  let n = 0;
  const inner = PLAY_HALF - 8;
  for (const o of obstacles) {
    if (Math.hypot(o.x, o.z) < inner && o.r > 12) n++;
  }
  return n;
}

const layout = generateLayout(mulberry32(0x3d906e >>> 0), { ...MAP, props: MAP.props });
const overlapPairs = countBoxCircleOverlapPairs();
const arch = archPassSamples();
const boss = bossGatePass();
const perimeterPlayer = walkPerimeter(PLAYER_R);
const perimeterZombie = walkPerimeter(ZOMBIE_R);
const shoulders = laneShoulderSamples();
const gather = gatherNodeOverlaps(layout);
const mountains = mountainInsidePlay();
const maxRockR = Math.max(0, ...SCATTER_ROCKS.map((s) => s.r));

const report = {
  obstacleCounts: { circles: obstacles.length, boxes: boxObstacles.length },
  boxCircleOverlapPairs: overlapPairs,
  maxScatterRockR: maxRockR,
  archPass: arch,
  bossGatePass: boss,
  perimeterWalk: { player: perimeterPlayer, zombie: perimeterZombie, playHalf: PLAY_HALF, boundaryInset: BOUNDARY_INSET },
  laneShoulderBlocked: shoulders,
  gatherNodePenetrating: gather.hits,
  gatherSamples: gather.list.slice(0, 8),
  largeObstaclesInsidePlay: mountains,
};

console.log(JSON.stringify(report, null, 2));

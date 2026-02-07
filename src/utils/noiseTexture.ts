import * as THREE from "three";

/**
 * Generates a noise texture for the Thanos dissolve effect
 * Uses Perlin-like noise for smooth, organic dissolution patterns
 */
export function generateNoiseTexture(size: number = 256): THREE.DataTexture {
    const data = new Uint8Array(size * size);

    // Simple noise generation using multiple octaves
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const nx = x / size;
            const ny = y / size;

            // Multi-octave noise for better visual quality
            let value = 0;
            let amplitude = 1;
            let frequency = 1;
            let maxValue = 0;

            // 4 octaves of noise
            for (let i = 0; i < 4; i++) {
                value += noise2D(nx * frequency, ny * frequency) * amplitude;
                maxValue += amplitude;
                amplitude *= 0.5;
                frequency *= 2;
            }

            // Normalize to 0-255
            value = (value / maxValue) * 0.5 + 0.5;
            data[y * size + x] = Math.floor(value * 255);
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
}

/**
 * Simple 2D noise function (hash-based)
 * Not true Perlin noise but sufficient for dissolve effect
 */
function noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const a = hash(X) + Y;
    const b = hash(X + 1) + Y;

    return lerp(
        v,
        lerp(u, grad(hash(a), xf, yf), grad(hash(b), xf - 1, yf)),
        lerp(u, grad(hash(a + 1), xf, yf - 1), grad(hash(b + 1), xf - 1, yf - 1))
    );
}

function hash(n: number): number {
    n = (n << 13) ^ n;
    return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 0x7fffffff * 255;
}

function fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
}

'use strict'

console.log('Service worker is ready!');

const FILES_TO_CACHE = [
    `/db.js`,
    `/index.html`,
    `/index.js`,
    `/index.css`,
    `/manifest.webmanifest`,
    `/icons/icon-192x192.png`,
    `/icons/icon-512x512.png`
];

const STATIC_CACHE = `static-cache-v1`;
const RUNTIME_CACHE = `runtime-cache`;

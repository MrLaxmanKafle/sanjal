/**
 * @sanjal/core — the engine shared by every Sanjal client.
 *
 * Rule for this package: no React, no DOM, no React Native, no framework
 * imports of any kind. Everything here is plain TypeScript that runs equally in
 * a browser, on a phone, in a server route, or in a test. Anything that needs a
 * platform API is expressed as a port the host fills in (see vault.ts).
 *
 * That constraint is the whole point. It is what lets web and mobile ship the
 * same behaviour instead of two drifting implementations of it.
 */

export * from "./documents";
export * from "./vault";
export * from "./guides";
export * from "./cities";
export * from "./site";

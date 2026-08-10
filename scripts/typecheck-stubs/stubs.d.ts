/**
 * Offline typecheck stubs.
 *
 * The real dependencies (react, next, gsap, lenis) are installed by
 * `npm install` on the target machine. These loose stubs only exist so
 * `tsc --noEmit` can run in an offline sandbox to catch syntax errors,
 * bad references and typos. They are NOT shipped with the app and are
 * excluded from the Next.js build via tsconfig "exclude".
 */

declare namespace React {
  type ReactNode = any;
  type FC<P = any> = (props: P) => any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  type Element = any;
}

declare module "react" {
  export type ReactNode = any;
  export type FC<P = any> = (props: P) => any;
  export type RefObject<T> = { current: T | null };
  export type KeyboardEvent = globalThis.KeyboardEvent;
  export function useState<T>(
    initial: T | (() => T)
  ): [T, (v: T | ((p: T) => T)) => void];
  export function useEffect(fn: () => any, deps?: any[]): void;
  export function useLayoutEffect(fn: () => any, deps?: any[]): void;
  export function useRef<T>(initial?: T | null): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(
    fn: T,
    deps: any[]
  ): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function useContext<T = any>(ctx: any): T;
  export function createContext<T>(defaultValue: T): any;
  const ReactDefault: any;
  export default ReactDefault;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "react/jsx-dev-runtime" {
  export const jsxDEV: any;
  export const Fragment: any;
}

declare module "next" {
  export type Metadata = Record<string, any>;
  export type Viewport = Record<string, any>;
  export type NextConfig = Record<string, any>;
}

declare module "next/font/google" {
  type FontOptions = {
    subsets?: string[];
    style?: string[];
    weight?: string | string[];
    variable?: string;
    display?: string;
    axes?: string[];
  };
  type FontResult = { className: string; variable: string; style: any };
  export function Archivo(options?: FontOptions): FontResult;
  export function Newsreader(options?: FontOptions): FontResult;
}

declare module "gsap" {
  export interface GSAPUtils {
    toArray<T = any>(selector: any, scope?: any): T[];
    [key: string]: any;
  }
  export interface GSAPStatic {
    utils: GSAPUtils;
    [key: string]: any;
  }
  export const gsap: GSAPStatic;
  export default gsap;
}

declare module "gsap/ScrollTrigger" {
  export const ScrollTrigger: any;
  export default ScrollTrigger;
}

declare module "gsap/SplitText" {
  export const SplitText: any;
  export default SplitText;
}

declare module "@gsap/react" {
  export function useGSAP(
    fn: (context?: any, contextSafe?: any) => any,
    config?: { scope?: any; dependencies?: any[]; revertOnUpdate?: boolean }
  ): any;
}

declare module "lenis" {
  export default class Lenis {
    constructor(options?: Record<string, any>);
    on(event: string, cb: (...args: any[]) => void): void;
    raf(time: number): void;
    start(): void;
    stop(): void;
    destroy(): void;
    scrollTo(target: any, options?: Record<string, any>): void;
  }
}

declare module "*.css";

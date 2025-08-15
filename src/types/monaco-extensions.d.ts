declare module 'monaco-vim' {
  export function initVimMode(editor: any, statusNode?: HTMLElement | null): any
}

declare module 'monaco-emacs' {
  export class EmacsExtension {
    constructor(editor: any)
  }
}
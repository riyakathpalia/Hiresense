/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from 'react';
declare module 'react-syntax-highlighter' {
    export * from 'react-syntax-highlighter/dist/cjs';

}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
    export const atomDark: any;
    // Add other styles if needed
}

declare module 'react-syntax-highlighter/dist/esm/prism' {
    const SyntaxHighlighter: ComponentType<any>;
    export default SyntaxHighlighter
}

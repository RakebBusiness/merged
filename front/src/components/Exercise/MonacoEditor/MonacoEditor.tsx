import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor loader
loader.config({ monaco });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  theme?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  theme = 'vs-dark'
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monacoEl.current) {
      // Initialize editor
      editorRef.current = monaco.editor.create(monacoEl.current, {
        value,
        language,
        theme,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false
        },
      });

      // Add change listener
      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current?.getValue() || '');
      });

      // Cleanup on unmount
      return () => {
        editorRef.current?.dispose();
      };
    }
  }, [language, theme]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return <div ref={monacoEl} style={{ height, width: '100%', borderRadius: '8px' }} />;
};

export default CodeEditor;
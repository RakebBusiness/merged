import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface EditorProps {
  placeholder?: string;
  onSubmit: (code: string) => void;
  initialCode?: string;
}

export default function Editor({ placeholder, onSubmit, initialCode = '' }: EditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleSubmit = () => {
    onSubmit(code);
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors flex items-center space-x-1"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={placeholder || '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}'}
        className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
        spellCheck={false}
      />
    </div>
  );
}

import { useState } from 'react';
import { Copy, Check, FileCode, Bug } from 'lucide-react';

interface AnimatedCodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  highlightedLines?: number[];
  buggyLines?: number[];
}

export function AnimatedCodeBlock({
  code,
  filename = 'source.tsx',
  language = 'typescript',
  highlightedLines = [],
  buggyLines = []
}: AnimatedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, high-performance local token highlighting
  const highlightToken = (line: string) => {
    if (line.trim().startsWith('//')) {
      return <span className="text-gray-500 font-mono italic">{line}</span>;
    }

    // Token matching list
    const keywords = /\b(const|let|var|function|return|import|export|from|default|async|await|try|catch|if|else|class|extends|new|true|false|null|undefined)\b/g;
    const hooks = /\b(useState|useEffect|useContext|useMemo|useCallback|useRef)\b/g;
    const strings = /(["'`])(.*?)\1/g;
    const numeric = /\b(\d+)\b/g;
    const functionCalls = /\b([a-zA-Z0-9_]+)(?=\()/g;

    let parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Combine patterns by converting keywords to markers
    const mergedRegex = new RegExp(
      `(${keywords.source})|(${hooks.source})|(${strings.source})|(${numeric.source})|(${functionCalls.source})`,
      'g'
    );

    let match;
    let key = 0;
    while ((match = mergedRegex.exec(line)) !== null) {
      // Push text before match
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      
      if (keywords.test(matchText)) {
        parts.push(<span key={key++} className="text-neon-pink font-semibold">{matchText}</span>);
      } else if (hooks.test(matchText)) {
        parts.push(<span key={key++} className="text-neon-blue font-bold">{matchText}</span>);
      } else if (strings.test(matchText)) {
        parts.push(<span key={key++} className="text-neon-green">{matchText}</span>);
      } else if (numeric.test(matchText)) {
        parts.push(<span key={key++} className="text-orange-400">{matchText}</span>);
      } else if (functionCalls.test(matchText)) {
        parts.push(<span key={key++} className="text-neon-cyan">{matchText}</span>);
      } else {
        parts.push(matchText);
      }

      // Reset regex cursors due to test() side-effects
      keywords.lastIndex = 0;
      hooks.lastIndex = 0;
      strings.lastIndex = 0;
      numeric.lastIndex = 0;
      functionCalls.lastIndex = 0;

      lastIndex = mergedRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  const lines = code.split('\n');

  return (
    <div className="w-full border border-white/10 rounded-xl overflow-hidden glass-panel font-mono text-xs text-left shadow-2xl">
      {/* File info bar */}
      <div className="bg-cyber-bg/70 border-b border-white/5 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-neon-blue" />
          <span className="text-gray-300 font-semibold tracking-wide">{filename}</span>
          <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px] text-gray-400 uppercase">
            {language}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-neon-green text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents block */}
      <div className="bg-cyber-bg/95 py-3 overflow-x-auto select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightedLines.includes(lineNum);
              const isBuggy = buggyLines.includes(lineNum);
              
              let rowBg = '';
              let numBg = 'text-gray-600';
              if (isHighlighted) {
                rowBg = 'bg-neon-blue/5 border-l-2 border-l-neon-blue';
                numBg = 'text-neon-blue font-bold';
              } else if (isBuggy) {
                rowBg = 'bg-red-950/20 border-l-2 border-l-red-500 animate-pulse';
                numBg = 'text-red-500 font-bold';
              }

              return (
                <tr key={idx} className={`${rowBg} hover:bg-white/5 group`}>
                  {/* Line Number */}
                  <td className={`w-10 text-right pr-4 pl-3 select-none border-r border-white/5 ${numBg}`}>
                    {lineNum}
                  </td>
                  {/* Code Line */}
                  <td className="pl-4 pr-3 font-mono whitespace-pre text-gray-200">
                    <div className="flex items-center gap-2">
                      <span>{highlightToken(line)}</span>
                      {isBuggy && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-900/40 border border-red-500/20 text-[9px] text-red-400 font-semibold select-none">
                          <Bug className="w-2.5 h-2.5" />
                          BUG FOUND
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

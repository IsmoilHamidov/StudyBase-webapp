export function detectLanguage(code: string): string {
    const c = code.trim();
  
    // --- Go: check early, before JS, because Go uses := which can look like JS ---
    if (
      /\bpackage\s+\w+/.test(c) &&
      (/\bfunc\s+\w+/.test(c) || /\bfmt\./.test(c) || /^import\s*\(/m.test(c))
    ) return "go";
  
    // --- Dart: check before JS ---
    if (
      /\bStatelessWidget\b|\bStatefulWidget\b|\bScaffold\b|\bWidget\b/.test(c) ||
      (/\bvoid\s+main\s*\(\s*\)/.test(c) && /\bprint\s*\(/.test(c) && !/public/.test(c))
    ) return "dart";
  
    // --- Python ---
    if (/^\s*(def |import |from |print\(|elif |lambda )/.test(c)) return "python";
  
    // --- Rust: before C++ ---
    if (/\bfn\s+\w+\s*\(|\blet\s+mut\b|\bimpl\b|\buse\s+std::/.test(c)) return "rust";
  
    // --- C++: before C ---
    if (/#include\s*<(iostream|vector|string|algorithm)>|std::|cout\s*<<|cin\s*>>/.test(c)) return "cpp";
  
    // --- C ---
    if (/#include\s*<(stdio|stdlib|string)\.h>|printf\s*\(|scanf\s*\(/.test(c)) return "c";
  
    // --- Java ---
    if (/public\s+(static\s+)?[\w<>]+\s+\w+\s*\(|System\.out\.print/.test(c)) return "java";
  
    // --- TypeScript: before JS ---
    if (/:\s*(string|number|boolean|void|any)\b|interface\s+\w|type\s+\w+\s*=|as\s+\w|<[A-Z]\w*>/.test(c)) return "typescript";
  
    // --- JavaScript ---
    if (/\bconsole\.log\b|\bconst\b|\blet\b|\bvar\b|=>|\bdocument\./.test(c)) return "javascript";
  
    // --- SQL ---
    if (/SELECT\s+|INSERT\s+INTO|CREATE\s+TABLE/i.test(c)) return "sql";
  
    // --- Bash ---
    if (/^#!/.test(c) || /\$\{|\becho\b|\bfi\b|\bgrep\b|\bchmod\b/.test(c)) return "bash";
  
    // --- LaTeX / Math ---
    if (/\\frac|\\sum|\\int|\\alpha|\$\$/.test(c)) return "latex";
  
    return "plaintext";
  }
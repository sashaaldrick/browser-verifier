import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

interface JsCodeBlockProps {
  title?: string;
}

const fibSource = `function fibBig(n: number) {
  setLocalMsg("Calculating…");
  setTimeout(() => {
    const t0 = performance.now();
    let a = 0n;
    let b = 1n;
    for (let i = 0; i < n; i++) {
      [a, b] = [b, a + b];
    }
    const t1 = performance.now();
    setLocalMsg(\`\${n}th Fibonacci has \${a.toString().length} digits (calculated in \${(t1-t0).toFixed(2)} ms)\`);
  }, 0);
}`;

export function JsCodeBlock({ title }: JsCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const code = fibSource;
  const language = 'typescript';

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative my-4 border rounded-lg">
      {title && (
        <div className="px-4 py-2 text-sm font-medium border-b bg-muted rounded-t-lg">
          {title}
        </div>
      )}
      <div className="relative rounded-lg max-w-[420px]">
        <ScrollArea className="max-h-96 w-full">
          <Highlight
            code={code.trim()}
            language={language as any}
            theme={themes.dracula}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 text-sm`} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((tok, key) => (
                      <span key={key} {...getTokenProps({ token: tok })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Button
        onClick={handleCopy}
        size="icon"
        variant="ghost"
        className="absolute top-0 right-0"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
} 
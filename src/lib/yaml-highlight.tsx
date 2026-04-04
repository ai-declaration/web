import React from "react";

function colorValue(raw: string): React.ReactNode {
  const trimmed = raw.trimStart();
  const leadingSpace = raw.slice(0, raw.length - trimmed.length);

  if (trimmed === "" || trimmed === ">-" || trimmed === ">" || trimmed === "|") {
    return <span className="text-muted-foreground">{raw}</span>;
  }
  if (/^["']/.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-emerald-600 dark:text-emerald-400">{trimmed}</span></>;
  }
  if (/^(true|false)$/i.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-amber-600 dark:text-amber-400">{trimmed}</span></>;
  }
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-amber-600 dark:text-amber-400">{trimmed}</span></>;
  }
  if (/^https?:\/\//.test(trimmed)) {
    return <><span>{leadingSpace}</span><span className="text-violet-600 dark:text-violet-400">{trimmed}</span></>;
  }

  return <span>{raw}</span>;
}

/** Highlight a single YAML line (no trailing newline). */
function highlightLine(line: string): React.ReactNode {
  if (line.trim() === "") return null;

  if (line.trimStart().startsWith("#")) {
    return <span className="text-gray-400 dark:text-gray-500">{line}</span>;
  }

  const kv = line.match(/^(\s*(?:- )?)([\w_][\w_.-]*)(:)([ ].*|$)/);
  if (kv) {
    const [, prefix, key, colon, rest] = kv;
    return (
      <>
        <span className="text-muted-foreground">{prefix}</span>
        <span className="text-sky-600 dark:text-sky-400">{key}</span>
        <span className="text-muted-foreground">{colon}</span>
        {colorValue(rest)}
      </>
    );
  }

  const li = line.match(/^(\s*- )(.*)/);
  if (li) {
    const [, dash, val] = li;
    return (
      <>
        <span className="text-muted-foreground">{dash}</span>
        {colorValue(" " + val)}
      </>
    );
  }

  return <span className="text-emerald-600 dark:text-emerald-400">{line}</span>;
}

/** Legacy export: returns React nodes with embedded newlines. */
export function highlightYaml(yaml: string): React.ReactNode[] {
  return yaml.split("\n").map((line, i) => (
    <span key={i}>{highlightLine(line)}{"\n"}</span>
  ));
}

/**
 * Find 1-based line numbers in a YAML string where specific keys appear.
 * Each pattern is matched against the trimmed key portion of a line.
 */
export function findYamlKeyLines(yaml: string, keys: string[]): Map<string, number> {
  const result = new Map<string, number>();
  const lines = yaml.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*(?:- )?([\w_][\w_.-]*):/);
    if (m) {
      const key = m[1];
      if (keys.includes(key) && !result.has(key)) {
        result.set(key, i + 1);
      }
    }
  }
  return result;
}

interface YamlCodeProps {
  yaml: string;
  errorLines?: Set<number>;
}

/**
 * Renders syntax-highlighted YAML with line numbers.
 * Line numbers use user-select: none so they are excluded from copy.
 * Optionally highlights error lines with a tinted background.
 */
export function YamlCode({ yaml, errorLines }: YamlCodeProps) {
  const lines = yaml.split("\n");
  const gutterWidth = String(lines.length).length;

  return (
    <table className="border-collapse w-full">
      <tbody>
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isError = errorLines?.has(lineNum);
          return (
            <tr key={i} className={isError ? "bg-error/10" : ""}>
              <td
                className="select-none pr-3 text-right align-top text-muted-foreground/40 leading-relaxed"
                style={{ width: `${gutterWidth + 1}ch`, minWidth: `${gutterWidth + 1}ch` }}
              >
                {lineNum}
              </td>
              <td className="leading-relaxed">
                {highlightLine(line)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

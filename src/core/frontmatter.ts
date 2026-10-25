export interface ParsedDocument {
  readonly attributes: Readonly<Record<string, string>>;
  readonly body: string;
}

const DELIMITER = '---';
const ATTRIBUTE_LINE = /^([A-Za-z][\w-]*):\s*(.*)$/;

/**
 * Lê o frontmatter YAML de um Markdown. Suporta apenas chaves de primeiro nível com valores
 * escalares (`chave: valor`), que é tudo o que os manifestos do kit usam.
 */
export function parseFrontmatter(source: string): ParsedDocument {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  if (lines[0]?.trim() !== DELIMITER) {
    return { attributes: {}, body: source };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === DELIMITER);
  if (closingIndex === -1) {
    return { attributes: {}, body: source };
  }

  const attributes: Record<string, string> = {};
  for (const line of lines.slice(1, closingIndex)) {
    const [, key, value] = ATTRIBUTE_LINE.exec(line) ?? [];
    if (key !== undefined && value !== undefined) {
      attributes[key] = unquote(value.trim());
    }
  }

  return { attributes, body: lines.slice(closingIndex + 1).join('\n') };
}

function unquote(value: string): string {
  const quote = value[0];
  const isQuoted = value.length >= 2 && (quote === '"' || quote === "'") && value.endsWith(quote);
  return isQuoted ? value.slice(1, -1) : value;
}

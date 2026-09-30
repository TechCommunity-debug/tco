// Minimal RFC 4180 CSV reader/writer for the image log. Shared by the content config and scripts/images.mjs.

/**
 * @param {string} text
 * @returns {Record<string, string>[]}
 */
export function parseCsv(text) {
  /** @type {string[][]} */
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows.filter((r) => r.some((cell) => cell.trim() !== ''));
  if (!header) return [];
  return body.map((cells) => Object.fromEntries(header.map((name, i) => [name.trim(), (cells[i] ?? '').trim()])));
}

/**
 * @param {string[]} columns
 * @param {Record<string, string>[]} records
 */
export function stringifyCsv(columns, records) {
  /** @param {string} value */
  const escape = (value) => (/[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value);
  const lines = [columns.join(','), ...records.map((record) => columns.map((c) => escape(record[c] ?? '')).join(','))];
  return lines.join('\n') + '\n';
}

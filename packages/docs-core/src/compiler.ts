import { slugifyHeading } from "./toc";

export interface ProcessedMarkdown {
  html: string;
}

export function compileMarkdownToHtml(markdown: string): string {
  let lines = markdown.split("\n");
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeBuffer: string[] = [];
  let htmlLines: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        const codeContent = escapeHtml(codeBuffer.join("\n"));
        htmlLines.push(
          `<div class="docs-code-block" data-language="${escapeHtml(codeLanguage)}">` +
            `<div class="docs-code-header">` +
              `<span class="docs-code-lang">${escapeHtml(codeLanguage || "text")}</span>` +
              `<button class="docs-copy-btn" onclick="navigator.clipboard.writeText(this.parentNode.nextElementSibling.innerText)">Copy</button>` +
            `</div>` +
            `<pre><code class="language-${escapeHtml(codeLanguage)}">${codeContent}</code></pre>` +
          `</div>`
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Handle GitHub-style Alerts / Callouts
    if (line.trim().startsWith("> [!")) {
      const alertMatch = line.trim().match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
      if (alertMatch) {
        const type = alertMatch[1].toUpperCase();
        let body = alertMatch[2] ? processInlineMarkdown(alertMatch[2]) : "";
        
        // Collect following quote lines
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith(">")) {
          const content = lines[j].trim().replace(/^>\s*/, "");
          body += (body ? "<br/>" : "") + processInlineMarkdown(content);
          j++;
        }
        i = j - 1;

        htmlLines.push(
          `<div class="docs-callout docs-callout-${type.toLowerCase()}">` +
            `<div class="docs-callout-title">${getCalloutIcon(type)} <span>${type}</span></div>` +
            `<div class="docs-callout-content">${body}</div>` +
          `</div>`
        );
        continue;
      }
    }

    // Handle Headings (H1 to H4)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2];
      const inlineText = processInlineMarkdown(rawText);
      const plainText = rawText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").trim();
      const id = slugifyHeading(plainText);

      htmlLines.push(
        `<h${level} id="${id}" class="docs-heading docs-h${level}">` +
          `<a href="#${id}" class="docs-heading-anchor">#</a>` +
          `<span>${inlineText}</span>` +
        `</h${level}>`
      );
      continue;
    }

    // Handle Tables
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableHeaderParsed = false;
        htmlLines.push('<div class="docs-table-wrapper"><table class="docs-table">');
      }

      // Check for separator row |---|---|
      if (line.includes("---")) {
        tableHeaderParsed = true;
        continue;
      }

      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => processInlineMarkdown(c.trim()));

      if (!tableHeaderParsed) {
        htmlLines.push('<thead><tr>');
        cells.forEach((cell) => htmlLines.push(`<th>${cell}</th>`));
        htmlLines.push('</tr></thead><tbody>');
      } else {
        htmlLines.push('<tr>');
        cells.forEach((cell) => htmlLines.push(`<td>${cell}</td>`));
        htmlLines.push('</tr>');
      }
      continue;
    } else if (inTable) {
      inTable = false;
      htmlLines.push('</tbody></table></div>');
    }

    // Handle Unordered Lists
    const listMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    if (listMatch) {
      const text = processInlineMarkdown(listMatch[2]);
      htmlLines.push(`<li class="docs-list-item">${text}</li>`);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***") {
      htmlLines.push('<hr class="docs-hr" />');
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      continue;
    }

    // Standard Paragraph
    htmlLines.push(`<p class="docs-paragraph">${processInlineMarkdown(line)}</p>`);
  }

  if (inTable) {
    htmlLines.push('</tbody></table></div>');
  }

  return htmlLines.join("\n");
}

function processInlineMarkdown(text: string): string {
  return text
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="docs-inline-code">$1</code>')
    // Bold **text**
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic *text*
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="docs-link" target="_blank" rel="noopener noreferrer">$1</a>')
    // Badges / Tags e.g. [!badge text]
    .replace(/\[!badge\s+([^\]]+)\]/g, '<span class="docs-badge">$1</span>');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCalloutIcon(type: string): string {
  switch (type) {
    case "NOTE": return "ℹ️";
    case "TIP": return "💡";
    case "IMPORTANT": return "📌";
    case "WARNING": return "⚠️";
    case "CAUTION": return "🚨";
    default: return "ℹ️";
  }
}

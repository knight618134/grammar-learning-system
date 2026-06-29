import type React from "react";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

export function MarkdownBlock({ body }: { body: string }) {
  const lines = body.split("\n").filter((line) => line.trim().length > 0);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="space-y-2 pl-5">
          {listItems.map((item) => (
            <li key={item} className="list-disc text-sm leading-6 text-ink/75">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-sm leading-6 text-ink/75">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-3">{blocks}</div>;
}

import React from "react";

// Template syntax: use placeholders like ${input:gapId}
// Example: "The ${input:word1} jumped over the ${input:word2}."
export const TemplateRenderer = ({ template, questionId, answers, onChange }) => {
  if (typeof template !== 'string') return null;

  const parts = [];
  const regex = /\$\{input:([a-zA-Z0-9_-]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(template)) !== null) {
    const [placeholder, gapId] = match;
    const textBefore = template.slice(lastIndex, match.index);
    if (textBefore) parts.push(<span key={`t-${lastIndex}`}>{textBefore}</span>);
    const key = `${questionId}:${gapId}`;
    parts.push(
      <input
        key={`i-${key}`}
        type="text"
        value={answers[key] || ''}
        onChange={(e) => onChange(key, e.target.value)}
        style={{ width: 120, margin: '0 6px' }}
      />
    );
    lastIndex = match.index + placeholder.length;
  }

  const tail = template.slice(lastIndex);
  if (tail) parts.push(<span key={`t-${lastIndex}`}>{tail}</span>);

  return <div style={{ lineHeight: 1.8 }}>{parts}</div>;
};

export default TemplateRenderer;


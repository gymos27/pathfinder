'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder = 'Type a skill (e.g. React, Python) and press Enter...',
  maxTags = 25,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('');
      return;
    }
    if (tags.length >= maxTags) return;
    onChange([...tags, trimmed]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const availableSuggestions = suggestions.filter(
    (sug) => !tags.some((t) => t.toLowerCase() === sug.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Tag Container & Input */}
      <div className="min-h-[52px] p-2 rounded-xl glass-input flex flex-wrap items-center gap-2 transition-all">
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white/10 text-white border border-white/20 group transition-all"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : 'Add another skill...'}
          className="flex-1 min-w-[180px] bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none px-2 py-1"
        />

        {inputValue.trim() && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="px-3 py-1 text-xs font-bold rounded-lg glossy-btn-white flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>

      {/* Suggested Quick-Add Tags */}
      {availableSuggestions.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Recommended for your domain (click to add):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {availableSuggestions.slice(0, 10).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => addTag(sug)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/10 hover:border-white/25 transition-all flex items-center gap-1 font-mono"
              >
                <Plus className="w-2.5 h-2.5 text-neutral-400" />
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

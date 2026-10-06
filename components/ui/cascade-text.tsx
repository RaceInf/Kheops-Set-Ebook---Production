'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';

export interface CascadeTextProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  color?: string;
  hoverColor?: string;
  direction?: 'up' | 'down';
  duration?: number; // in seconds, default 0.25
  staggerDelay?: number; // in seconds, default 0.025
  easing?: Transition['ease'];
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export function CascadeText({
  text,
  as: Component = 'span',
  className = '',
  color = 'inherit',
  hoverColor = '#EEB149',
  direction = 'up',
  duration = 0.25,
  staggerDelay = 0.025,
  easing = [0.25, 1, 0.5, 1], // fluid ease-out curve
  style = {},
  'aria-label': ariaLabel,
}: CascadeTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Split into words, then characters, to preserve natural line wrapping and spaces
  const words = text.split(' ');

  // Direction offsets
  const isUp = direction === 'up';
  const initialY = isUp ? '100%' : '-100%';
  const exitY = isUp ? '-100%' : '100%';

  if (shouldReduceMotion) {
    return (
      <Component
        className={`inline-block transition-colors duration-200 ${className}`}
        style={{ color: isHovered ? hoverColor : color, ...style }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={ariaLabel || text}
      >
        {text}
      </Component>
    );
  }

  let globalCharIndex = 0;

  return (
    <Component
      className={`inline-block cursor-pointer select-none ${className}`}
      style={{ color, ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="text"
      aria-label={ariaLabel || text}
    >
      <span aria-hidden="true" className="inline">
        {words.map((word, wordIdx) => {
          const chars = Array.from(word);

          return (
            <span key={`word-${wordIdx}`} className="inline-block whitespace-nowrap">
              {chars.map((char, charIdx) => {
                const charDelay = globalCharIndex * staggerDelay;
                globalCharIndex += 1;

                return (
                  <span
                    key={`char-${wordIdx}-${charIdx}`}
                    className="relative inline-block overflow-hidden align-baseline"
                  >
                    {/* Primary character: visible by default, slides out on hover */}
                    <motion.span
                      className="inline-block"
                      initial={false}
                      animate={{
                        y: isHovered ? exitY : '0%',
                        color: isHovered ? hoverColor : color,
                      }}
                      transition={{
                        duration,
                        delay: charDelay,
                        ease: easing,
                      }}
                    >
                      {char}
                    </motion.span>

                    {/* Secondary character: incoming duplicate, slides in on hover */}
                    <motion.span
                      className="absolute inset-0 inline-block pointer-events-none"
                      initial={false}
                      animate={{
                        y: isHovered ? '0%' : initialY,
                      }}
                      transition={{
                        duration,
                        delay: charDelay,
                        ease: easing,
                      }}
                      style={{
                        color: hoverColor,
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}

              {/* Add non-breaking space between words if not the last word */}
              {wordIdx < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </span>
    </Component>
  );
}

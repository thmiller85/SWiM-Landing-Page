import React from 'react';
import { AutomationChecklist } from './AutomationChecklist';
import { ROICalculator } from './ROICalculator';

interface InteractiveContentRendererProps {
  type: string;
  props?: Record<string, any>;
  onLeadGenerated?: () => void;
}

export function InteractiveContentRenderer({ type, props, onLeadGenerated }: InteractiveContentRendererProps) {
  switch (type) {
    case 'automation-checklist':
      return <AutomationChecklist onLeadGenerated={onLeadGenerated} {...props} />;
    
    case 'roi-calculator':
      return <ROICalculator onLeadGenerated={onLeadGenerated} {...props} />;
    
    case 'workflow-assessment':
      return <div>Workflow Assessment component (to be implemented)</div>;
    
    default:
      return (
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300">Unknown interactive component: {type}</p>
        </div>
      );
  }
}

// Shortcode parser for blog content
export function parseInteractiveShortcodes(content: string, onLeadGenerated?: () => void): React.ReactNode[] {
  const shortcodeRegex = /\[interactive type="([^"]+)"([^\]]*)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // Check for any interactive shortcode patterns
  if (content.includes('[interactive')) {
    console.log('Content contains [interactive shortcode');
    console.log('Full content around shortcode:', content.slice(content.indexOf('[interactive') - 50, content.indexOf('[interactive') + 100));
  } else {
    console.log('No [interactive shortcode found in content');
  }

  while ((match = shortcodeRegex.exec(content)) !== null) {
    console.log('Found shortcode match:', match);
    // Add text before the shortcode
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const type = match[1];
    const propsString = match[2];
    
    // Parse props from shortcode attributes
    const props: Record<string, any> = {};
    const propRegex = /(\w+)="([^"]*)"/g;
    let propMatch;
    while ((propMatch = propRegex.exec(propsString)) !== null) {
      props[propMatch[1]] = propMatch[2];
    }

    // Add the interactive component
    parts.push(
      <InteractiveContentRenderer 
        key={match.index}
        type={type} 
        props={props} 
        onLeadGenerated={onLeadGenerated}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last shortcode
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Puzzle, BarChart3, Calculator, CheckSquare, Zap } from 'lucide-react';

interface InteractiveElement {
  id: string;
  name: string;
  description: string;
  shortcode: string;
  icon: React.ReactNode;
  category: 'assessment' | 'calculator' | 'workflow';
  preview?: string;
}

const interactiveElements: InteractiveElement[] = [
  {
    id: 'automation-checklist',
    name: 'Automation Readiness Checklist',
    description: 'Interactive assessment tool to evaluate business automation needs with progress tracking and personalized reports.',
    shortcode: '[interactive type="automation-checklist"]',
    icon: <CheckSquare className="h-5 w-5" />,
    category: 'assessment',
    preview: 'A comprehensive 3-phase checklist covering manual process overload, resource drain, and growth bottlenecks with scoring and recommendations.'
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Calculate return on investment for automation projects with customizable parameters.',
    shortcode: '[interactive type="roi-calculator"]',
    icon: <Calculator className="h-5 w-5" />,
    category: 'calculator',
    preview: 'Coming soon - Interactive calculator for automation ROI analysis.'
  },
  {
    id: 'workflow-assessment',
    name: 'Workflow Assessment',
    description: 'Detailed workflow analysis tool to identify optimization opportunities.',
    shortcode: '[interactive type="workflow-assessment"]',
    icon: <BarChart3 className="h-5 w-5" />,
    category: 'workflow',
    preview: 'Coming soon - Comprehensive workflow evaluation and optimization tool.'
  }
];

interface InteractiveContentPickerProps {
  onInsert: (shortcode: string) => void;
}

export function InteractiveContentPicker({ onInsert }: InteractiveContentPickerProps) {
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleInsert = (element: InteractiveElement) => {
    onInsert(element.shortcode);
    setIsOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assessment': return 'bg-blue-500/20 text-blue-300';
      case 'calculator': return 'bg-green-500/20 text-green-300';
      case 'workflow': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          <Puzzle className="h-4 w-4 mr-2" />
          Add Interactive Element
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Interactive Content Library</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interactiveElements.map((element) => (
              <Card 
                key={element.id} 
                className={`bg-gray-700/50 border-gray-600 cursor-pointer transition-all hover:bg-gray-700 ${
                  selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedElement(element)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {element.icon}
                      <CardTitle className="text-sm text-white">{element.name}</CardTitle>
                    </div>
                    <Badge className={getCategoryColor(element.category)}>
                      {element.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-300 mb-3">{element.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsert(element);
                      }}
                      className="text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Insert
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(element.shortcode);
                      }}
                      className="text-xs text-white border-gray-600"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedElement && (
            <Card className="bg-gray-700/30 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {selectedElement.icon}
                  {selectedElement.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{selectedElement.description}</p>
                
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Shortcode:</label>
                  <Textarea
                    value={selectedElement.shortcode}
                    readOnly
                    className="bg-gray-800 border-gray-600 text-gray-300 font-mono text-sm"
                    rows={2}
                  />
                </div>

                {selectedElement.preview && (
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Preview:</label>
                    <div className="bg-gray-800/50 p-4 rounded border border-gray-600">
                      <p className="text-gray-300 text-sm">{selectedElement.preview}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleInsert(selectedElement)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Insert into Content
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(selectedElement.shortcode)}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Shortcode
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="pt-6">
              <h4 className="text-white font-medium mb-2">How to Use Interactive Elements</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Click "Insert" to add the element at your cursor position</li>
                <li>• Copy shortcodes to manually place them in your content</li>
                <li>• Interactive elements will render when the blog post is published</li>
                <li>• Elements automatically track user engagement and lead generation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
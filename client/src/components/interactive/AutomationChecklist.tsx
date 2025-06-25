import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Circle, BarChart3, FileText, Download, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistState {
  overload: boolean[];
  resource: boolean[];
  growth: boolean[];
  priorities: { [key: string]: number[] };
  baselines: { [key: string]: string };
}

interface AutomationChecklistProps {
  onLeadGenerated?: () => void;
}

export function AutomationChecklist({ onLeadGenerated }: AutomationChecklistProps) {
  const [state, setState] = useState<ChecklistState>({
    overload: new Array(7).fill(false),
    resource: new Array(7).fill(false),
    growth: new Array(7).fill(false),
    priorities: {
      'data-entry': [0, 0, 0],
      'document-approvals': [0, 0, 0],
      'customer-onboarding': [0, 0, 0],
      'invoice-processing': [0, 0, 0],
      'inventory-management': [0, 0, 0]
    },
    baselines: {
      'avg-time': '',
      'monthly-cost': '',
      'error-rate': '',
      'processes-per-day': '',
      'target-time': '',
      'target-cost': '',
      'target-error': '',
      'target-processes': ''
    }
  });

  const [showReport, setShowReport] = useState(false);
  const [progress, setProgress] = useState(0);
  const [priorityLevel, setPriorityLevel] = useState('');

  const overloadItems = [
    'Employees spend 2+ hours daily on repetitive data entry',
    'Data is manually copied between spreadsheets or systems',
    'Document approvals rely on email chains or physical paperwork',
    'Manual document routing causes delays or miscommunication',
    'Frequent human errors in order processing, billing, or data entry',
    'Staff complaints about repetitive, mind-numbing tasks',
    'Time-sensitive processes often miss deadlines due to manual steps'
  ];

  const resourceItems = [
    'High operational costs relative to output',
    'Customer requests take days instead of hours to process',
    'Internal approvals create significant bottlenecks',
    'Employee burnout from repetitive tasks',
    'High turnover in roles with manual processes',
    'Overtime costs due to process inefficiencies',
    'Difficulty meeting customer service response time expectations'
  ];

  const growthItems = [
    'Cannot handle increased volume without hiring more staff',
    'Scaling operations requires proportional staff increases',
    'Customer service response times are getting slower',
    'Limited visibility into where process delays occur',
    'Cannot track process performance metrics effectively',
    'Growth is limited by operational capacity',
    'Competitors are responding faster to market opportunities'
  ];

  const processItems = [
    { key: 'data-entry', name: 'Data entry tasks' },
    { key: 'document-approvals', name: 'Document approvals' },
    { key: 'customer-onboarding', name: 'Customer onboarding' },
    { key: 'invoice-processing', name: 'Invoice processing' },
    { key: 'inventory-management', name: 'Inventory management' }
  ];

  const baselineMetrics = [
    { key: 'avg-time', name: 'Average time per process (hours)', placeholder: 'e.g., 4.5' },
    { key: 'monthly-cost', name: 'Monthly process cost ($)', placeholder: 'e.g., 5000' },
    { key: 'error-rate', name: 'Current error rate (%)', placeholder: 'e.g., 15' },
    { key: 'processes-per-day', name: 'Processes per day', placeholder: 'e.g., 50' }
  ];

  const targetMetrics = [
    { key: 'target-time', name: 'Target time per process (hours)', placeholder: 'e.g., 1.5' },
    { key: 'target-cost', name: 'Target monthly cost ($)', placeholder: 'e.g., 2000' },
    { key: 'target-error', name: 'Target error rate (%)', placeholder: 'e.g., 3' },
    { key: 'target-processes', name: 'Target processes per day', placeholder: 'e.g., 200' }
  ];

  useEffect(() => {
    const totalChecked = [...state.overload, ...state.resource, ...state.growth].filter(Boolean).length;
    const totalItems = 21;
    const progressPercent = (totalChecked / totalItems) * 100;
    setProgress(progressPercent);

    if (totalChecked <= 5) {
      setPriorityLevel('Low Priority');
    } else if (totalChecked <= 12) {
      setPriorityLevel('Moderate Priority');
    } else {
      setPriorityLevel('High Priority - Immediate Action Recommended');
    }
  }, [state]);

  const updateCheckbox = (category: keyof ChecklistState, index: number) => {
    setState(prev => ({
      ...prev,
      [category]: (prev[category] as boolean[]).map((item, i) => i === index ? !item : item)
    }));
  };

  const updatePriority = (processKey: string, fieldIndex: number, value: number) => {
    setState(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [processKey]: prev.priorities[processKey].map((item, i) => i === fieldIndex ? value : item)
      }
    }));
  };

  const updateBaseline = (key: string, value: string) => {
    setState(prev => ({
      ...prev,
      baselines: {
        ...prev.baselines,
        [key]: value
      }
    }));
  };

  const calculatePriorityScore = (scores: number[]) => {
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const generateReport = () => {
    setShowReport(true);
    if (onLeadGenerated) {
      onLeadGenerated();
    }
  };

  const saveProgress = () => {
    localStorage.setItem('automationChecklist', JSON.stringify(state));
    // You could also send this to your analytics or CRM system
  };

  const resetForm = () => {
    setState({
      overload: new Array(7).fill(false),
      resource: new Array(7).fill(false),
      growth: new Array(7).fill(false),
      priorities: {
        'data-entry': [0, 0, 0],
        'document-approvals': [0, 0, 0],
        'customer-onboarding': [0, 0, 0],
        'invoice-processing': [0, 0, 0],
        'inventory-management': [0, 0, 0]
      },
      baselines: {
        'avg-time': '',
        'monthly-cost': '',
        'error-rate': '',
        'processes-per-day': '',
        'target-time': '',
        'target-cost': '',
        'target-error': '',
        'target-processes': ''
      }
    });
    setShowReport(false);
    localStorage.removeItem('automationChecklist');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'automation-assessment.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('automationChecklist');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  const getPriorityColor = (level: string) => {
    if (level.includes('Low')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (level.includes('Moderate')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center">
            🤖 Business Workflow Automation Readiness Checklist
          </CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-gray-300">
              Assessment Progress: {Math.round(progress)}% complete
            </p>
            {priorityLevel && (
              <Badge className={`mx-auto ${getPriorityColor(priorityLevel)}`}>
                Automation Priority: {priorityLevel}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Phase 1: Assessment */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Phase 1: Automation Readiness Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Process Overload */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Manual Process Overload Indicators</h3>
            <p className="text-gray-300 mb-4">Check all that apply to your business:</p>
            <div className="space-y-3">
              {overloadItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => updateCheckbox('overload', index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {state.overload[index] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <label className="text-gray-300 cursor-pointer">{item}</label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resource Drain */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Resource Drain Indicators</h3>
            <div className="space-y-3">
              {resourceItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => updateCheckbox('resource', index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {state.resource[index] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <label className="text-gray-300 cursor-pointer">{item}</label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Growth Bottlenecks */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Growth Bottleneck Indicators</h3>
            <div className="space-y-3">
              {growthItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => updateCheckbox('growth', index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {state.growth[index] ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <label className="text-gray-300 cursor-pointer">{item}</label>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2: Process Prioritization */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Phase 2: Process Prioritization</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">High-Impact Automation Candidates</h3>
          <p className="text-gray-300 mb-6">Rate these processes by frequency, error rate, and time impact (1-5 scale):</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-3 text-left text-white">Process</th>
                  <th className="border border-gray-600 p-3 text-center text-white">Frequency</th>
                  <th className="border border-gray-600 p-3 text-center text-white">Error Rate</th>
                  <th className="border border-gray-600 p-3 text-center text-white">Time Impact</th>
                  <th className="border border-gray-600 p-3 text-center text-white">Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {processItems.map((process, index) => {
                  const score = calculatePriorityScore(state.priorities[process.key]);
                  const isHighPriority = score >= 12;
                  return (
                    <tr key={process.key} className="hover:bg-gray-700/50">
                      <td className="border border-gray-600 p-3 text-gray-300">{process.name}</td>
                      <td className="border border-gray-600 p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={state.priorities[process.key][0] || ''}
                          onChange={(e) => updatePriority(process.key, 0, parseInt(e.target.value) || 0)}
                          className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                        />
                      </td>
                      <td className="border border-gray-600 p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={state.priorities[process.key][1] || ''}
                          onChange={(e) => updatePriority(process.key, 1, parseInt(e.target.value) || 0)}
                          className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                        />
                      </td>
                      <td className="border border-gray-600 p-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={state.priorities[process.key][2] || ''}
                          onChange={(e) => updatePriority(process.key, 2, parseInt(e.target.value) || 0)}
                          className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                        />
                      </td>
                      <td className="border border-gray-600 p-3 text-center">
                        <Badge className={isHighPriority ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}>
                          {score}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Phase 3: Baseline Measurements */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Phase 3: Baseline Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Record Your Current State</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Current Metrics</h4>
              <div className="space-y-4">
                {baselineMetrics.map((metric) => (
                  <div key={metric.key}>
                    <label className="block text-gray-300 mb-2">{metric.name}</label>
                    <input
                      type="text"
                      value={state.baselines[metric.key]}
                      onChange={(e) => updateBaseline(metric.key, e.target.value)}
                      placeholder={metric.placeholder}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Target Improvements</h4>
              <div className="space-y-4">
                {targetMetrics.map((metric) => (
                  <div key={metric.key}>
                    <label className="block text-gray-300 mb-2">{metric.name}</label>
                    <input
                      type="text"
                      value={state.baselines[metric.key]}
                      onChange={(e) => updateBaseline(metric.key, e.target.value)}
                      placeholder={metric.placeholder}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={generateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Assessment Report
            </Button>
            <Button
              onClick={saveProgress}
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Progress
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="text-white border-gray-600 hover:bg-gray-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Report */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">📊 Your Automation Assessment Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">🎯 Assessment Summary</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <strong>Issues Identified:</strong> {[...state.overload, ...state.resource, ...state.growth].filter(Boolean).length} out of 21
                    </p>
                    <p className="text-gray-300">
                      <strong>Automation Priority:</strong> {priorityLevel}
                    </p>
                    <p className="text-gray-300">
                      <strong>High-Priority Processes:</strong> {Object.entries(state.priorities).filter(([key, scores]) => calculatePriorityScore(scores) >= 12).length}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">🚀 Recommended Next Steps</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>Focus on processes with priority scores of 12+</li>
                    <li>Document current workflows for top 3 priority areas</li>
                    <li>Research automation solutions for identified pain points</li>
                    <li>Calculate ROI potential for each automation opportunity</li>
                    <li>Plan pilot implementation starting with highest-impact process</li>
                    <li>Schedule consultation with automation experts</li>
                  </ol>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-accent/20 to-highlight/20 rounded-lg border border-accent/30">
                  <h4 className="text-xl font-bold text-white mb-2">Ready to Transform Your Business?</h4>
                  <p className="text-gray-300 mb-4">
                    Get a personalized automation strategy based on your assessment results.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-black font-semibold"
                    onClick={() => {
                      if (onLeadGenerated) onLeadGenerated();
                      // You could also redirect to a consultation booking page
                    }}
                  >
                    Schedule Free Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
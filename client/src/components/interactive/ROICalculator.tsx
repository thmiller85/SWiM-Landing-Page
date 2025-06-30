import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ROICalculatorProps {
  onLeadGenerated?: () => void;
}

interface CalculatorInputs {
  monthlySpend: number;
  leadVolume: number;
  conversionRate: number;
  dealSize: number;
  cacReduction: number;
  conversionImprovement: number;
  implementationCost: number;
  monthlyPlatformCost: number;
}

interface CalculatorResults {
  currentRevenue: number;
  newRevenue: number;
  revenueIncrease: number;
  revenueIncreasePercent: number;
  currentCPL: number;
  newCPL: number;
  paybackPeriod: number;
  totalRevenueGain: number;
  totalInvestment: number;
  netGain: number;
  roiPercentage: number;
}

const initialInputs: CalculatorInputs = {
  monthlySpend: 10000,
  leadVolume: 500,
  conversionRate: 10,
  dealSize: 10000,
  cacReduction: 42,
  conversionImprovement: 31,
  implementationCost: 50000,
  monthlyPlatformCost: 2000
};

export function ROICalculator({ onLeadGenerated }: ROICalculatorProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  const calculateROI = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const {
        monthlySpend,
        leadVolume,
        conversionRate,
        dealSize,
        cacReduction,
        conversionImprovement,
        implementationCost,
        monthlyPlatformCost
      } = inputs;

      // Calculate current metrics
      const currentCPL = leadVolume > 0 ? monthlySpend / leadVolume : 0;
      const currentCustomers = leadVolume * (conversionRate / 100);
      const currentRevenue = currentCustomers * dealSize;
      const currentCAC = currentCustomers > 0 ? monthlySpend / currentCustomers : 0;

      // Calculate AI-enhanced metrics
      const newConversionRate = conversionRate * (1 + conversionImprovement / 100);
      const newCAC = currentCAC * (1 - cacReduction / 100);
      const newCustomers = leadVolume * (newConversionRate / 100);
      const newRevenue = newCustomers * dealSize;
      const revenueIncrease = newRevenue - currentRevenue;
      const revenueIncreasePercent = currentRevenue > 0 ? (revenueIncrease / currentRevenue * 100) : 0;

      // Calculate new CPL
      const newMonthlySpend = newCustomers * newCAC;
      const newCPL = leadVolume > 0 ? newMonthlySpend / leadVolume : 0;

      // Calculate ROI over 12 months
      const monthlyNetGain = revenueIncrease - monthlyPlatformCost;
      const totalRevenueGain12Months = revenueIncrease * 12;
      const totalInvestment12Months = implementationCost + (monthlyPlatformCost * 12);
      const netGain12Months = totalRevenueGain12Months - totalInvestment12Months;
      const roiPercentage = totalInvestment12Months > 0 ? (netGain12Months / totalInvestment12Months * 100) : 0;

      // Calculate payback period
      const paybackPeriod = monthlyNetGain > 0 ? Math.ceil(implementationCost / monthlyNetGain) : 0;

      const calculatedResults: CalculatorResults = {
        currentRevenue,
        newRevenue,
        revenueIncrease,
        revenueIncreasePercent,
        currentCPL,
        newCPL,
        paybackPeriod,
        totalRevenueGain: totalRevenueGain12Months,
        totalInvestment: totalInvestment12Months,
        netGain: netGain12Months,
        roiPercentage
      };

      setResults(calculatedResults);
      setShowResults(true);
      setIsCalculating(false);

      // Track lead generation
      if (onLeadGenerated) {
        onLeadGenerated();
      }
    }, 500);
  };

  const updateInput = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
    
    // Auto-recalculate if results are shown
    if (showResults) {
      setTimeout(() => calculateROI(), 300);
    }
  };

  const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto my-8"
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">AI Marketing ROI Calculator</CardTitle>
              <CardDescription className="text-blue-100">
                Estimate your potential returns from implementing AI-powered marketing solutions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Input Section */}
          <div className="space-y-8">
            {/* Current Marketing Metrics */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Current Marketing Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="monthlySpend" className="text-gray-300 flex items-center gap-2">
                    Monthly Marketing Spend
                    <Tooltip content="Your total monthly budget for marketing activities">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="monthlySpend"
                      type="number"
                      value={inputs.monthlySpend}
                      onChange={(e) => updateInput('monthlySpend', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-8"
                      placeholder="10000"
                    />
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="leadVolume" className="text-gray-300 flex items-center gap-2">
                    Monthly Lead Volume
                    <Tooltip content="Average number of leads generated per month">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <Input
                    id="leadVolume"
                    type="number"
                    value={inputs.leadVolume}
                    onChange={(e) => updateInput('leadVolume', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="conversionRate" className="text-gray-300 flex items-center gap-2">
                    Current Conversion Rate
                    <Tooltip content="Percentage of leads that become customers">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="conversionRate"
                      type="number"
                      step="0.1"
                      value={inputs.conversionRate}
                      onChange={(e) => updateInput('conversionRate', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pr-8"
                      placeholder="10"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-400 text-sm">%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dealSize" className="text-gray-300 flex items-center gap-2">
                    Average Deal Size
                    <Tooltip content="Average revenue per customer">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="dealSize"
                      type="number"
                      value={inputs.dealSize}
                      onChange={(e) => updateInput('dealSize', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-8"
                      placeholder="10000"
                    />
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Implementation Parameters */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                AI Implementation Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cacReduction" className="text-gray-300 flex items-center gap-2">
                    Expected CAC Reduction
                    <Tooltip content="Industry average is 42%">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="cacReduction"
                      type="number"
                      value={inputs.cacReduction}
                      onChange={(e) => updateInput('cacReduction', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pr-8"
                      placeholder="42"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-400 text-sm">%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="conversionImprovement" className="text-gray-300 flex items-center gap-2">
                    Expected Conversion Rate Improvement
                    <Tooltip content="Industry average is 31%">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="conversionImprovement"
                      type="number"
                      value={inputs.conversionImprovement}
                      onChange={(e) => updateInput('conversionImprovement', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pr-8"
                      placeholder="31"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-400 text-sm">%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="implementationCost" className="text-gray-300 flex items-center gap-2">
                    Implementation Cost
                    <Tooltip content="One-time setup and integration costs">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="implementationCost"
                      type="number"
                      value={inputs.implementationCost}
                      onChange={(e) => updateInput('implementationCost', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-8"
                      placeholder="50000"
                    />
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthlyPlatformCost" className="text-gray-300 flex items-center gap-2">
                    Monthly AI Platform Cost
                    <Tooltip content="Ongoing software and maintenance fees">
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 cursor-help">?</div>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <Input
                      id="monthlyPlatformCost"
                      type="number"
                      value={inputs.monthlyPlatformCost}
                      onChange={(e) => updateInput('monthlyPlatformCost', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-8"
                      placeholder="2000"
                    />
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={calculateROI}
              disabled={isCalculating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
            >
              {isCalculating ? 'Calculating...' : 'Calculate AI Marketing ROI'}
            </Button>
          </div>

          {/* Results Section */}
          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-semibold text-white mb-8 text-center">
                Your AI Marketing ROI Projection
              </h3>
              
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">New Monthly Revenue</h4>
                    <div className="text-2xl font-bold text-green-400 mt-2">
                      {formatCurrency(results.newRevenue)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      vs. {formatCurrency(results.currentRevenue)} current
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Monthly Revenue Increase</h4>
                    <div className="text-2xl font-bold text-green-400 mt-2">
                      {formatCurrency(results.revenueIncrease)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {results.revenueIncreasePercent.toFixed(1)}% improvement
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">New Cost Per Lead</h4>
                    <div className="text-2xl font-bold text-blue-400 mt-2">
                      {formatCurrency(results.newCPL)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      vs. {formatCurrency(results.currentCPL)} current
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Payback Period</h4>
                    <div className="text-2xl font-bold text-purple-400 mt-2">
                      {results.paybackPeriod}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">months</div>
                  </CardContent>
                </Card>
              </div>

              {/* ROI Breakdown */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">12-Month ROI Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Total Revenue Gain</span>
                      <span className="text-white font-semibold">{formatCurrency(results.totalRevenueGain)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Total Investment</span>
                      <span className="text-white font-semibold">{formatCurrency(results.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Net Gain</span>
                      <span className={`font-semibold ${results.netGain > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(results.netGain)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 text-lg font-bold">
                      <span className="text-white">ROI Percentage</span>
                      <Badge className={`text-lg px-3 py-1 ${results.roiPercentage > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        {results.roiPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mt-8">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Achieve These Results?</h3>
                  <p className="text-gray-300 mb-6">
                    Get a personalized AI marketing strategy tailored to your business goals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      asChild
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      <a href="/contact" target="_blank" rel="noopener noreferrer">
                        Get Your Free Assessment
                      </a>
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3"
                    >
                      <a href="/services" target="_blank" rel="noopener noreferrer">
                        Learn More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
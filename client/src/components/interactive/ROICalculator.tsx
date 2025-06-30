import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm';
import { apiRequest } from '@/lib/queryClient';

interface ROICalculatorProps {
  postSlug?: string;
}

interface CalculationResults {
  monthlySavings: number;
  annualSavings: number;
  implementationCost: number;
  roiPercentage: number;
  paybackPeriod: number;
  productivityGain: number;
  timeToValue: number;
}

export function ROICalculator({ postSlug }: ROICalculatorProps) {
  // Form state
  const [currentRevenue, setCurrentRevenue] = useState<string>('');
  const [marketingBudget, setMarketingBudget] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<string>('');
  const [avgSalary, setAvgSalary] = useState<string>('');
  const [currentConversion, setCurrentConversion] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');

  // Results and lead capture state
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const industryMultipliers = {
    'technology': 1.8,
    'healthcare': 1.6,
    'finance': 1.7,
    'retail': 1.4,
    'manufacturing': 1.5,
    'professional-services': 1.6,
    'education': 1.3,
    'other': 1.5
  };

  const companySizeMultipliers = {
    '1-10': 0.8,
    '11-50': 1.0,
    '51-200': 1.2,
    '201-500': 1.4,
    '501-1000': 1.6,
    '1000+': 1.8
  };

  const calculateROI = useCallback(() => {
    const revenue = parseFloat(currentRevenue) || 0;
    const budget = parseFloat(marketingBudget) || 0;
    const employees = parseFloat(employeeCount) || 0;
    const salary = parseFloat(avgSalary) || 0;
    const conversion = parseFloat(currentConversion) || 0;
    const hours = parseFloat(hoursPerWeek) || 0;

    if (!revenue || !budget || !employees || !hours) {
      return;
    }

    const industryMultiplier = industryMultipliers[industry as keyof typeof industryMultipliers] || 1.5;
    const sizeMultiplier = companySizeMultipliers[companySize as keyof typeof companySizeMultipliers] || 1.0;

    // Base calculations
    const hourlyRate = salary ? (salary / 2080) : 50; // Default $50/hour
    const currentHourlyProductivity = revenue / (employees * 2080);
    
    // AI improvements
    const productivityGain = 0.25 * industryMultiplier; // 25% base improvement
    const conversionImprovement = Math.min(0.35, 0.15 + (industryMultiplier * 0.1)); // Up to 35% conversion boost
    const timesSaved = hours * 52 * employees * 0.7; // 70% of manual tasks automated

    // Monthly calculations
    const monthlySavedHours = timesSaved / 12;
    const monthlySavings = (monthlySavedHours * hourlyRate) + 
                          (budget * conversionImprovement / 12) + 
                          ((currentHourlyProductivity * productivityGain * employees * 173.33)); // 173.33 hours/month

    const annualSavings = monthlySavings * 12;
    
    // Implementation cost (dynamic based on company size)
    const baseCost = 25000;
    const implementationCost = baseCost * sizeMultiplier;
    
    // ROI calculations
    const roiPercentage = ((annualSavings - implementationCost) / implementationCost) * 100;
    const paybackPeriod = implementationCost / monthlySavings;
    const timeToValue = Math.max(2, Math.min(6, paybackPeriod / 2)); // 2-6 months

    const calculatedResults: CalculationResults = {
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      implementationCost: Math.round(implementationCost),
      roiPercentage: Math.round(roiPercentage),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      productivityGain: Math.round(productivityGain * 100),
      timeToValue: Math.round(timeToValue)
    };

    setResults(calculatedResults);
  }, [currentRevenue, marketingBudget, employeeCount, avgSalary, currentConversion, hoursPerWeek, industry, companySize]);

  const handleEnhancedResults = () => {
    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (data: any) => {
    setIsSubmittingLead(true);
    try {
      const interactionData = {
        roiPercentage: results?.roiPercentage,
        monthlySavings: results?.monthlySavings,
        annualSavings: results?.annualSavings,
        implementationCost: results?.implementationCost,
        paybackPeriod: results?.paybackPeriod,
        productivityGain: results?.productivityGain,
        industry,
        companySize,
        currentRevenue: parseFloat(currentRevenue),
        marketingBudget: parseFloat(marketingBudget),
        employeeCount: parseFloat(employeeCount)
      };

      await apiRequest('/api/leads/capture', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          leadSource: 'ROI Calculator',
          postSlug,
          interactionData
        })
      });

      setLeadCaptured(true);
      setShowLeadForm(false);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Calculator className="h-6 w-6 text-blue-400" />
            AI Marketing ROI Calculator
          </CardTitle>
          <p className="text-slate-300">
            Calculate your potential return on investment with AI-powered marketing automation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-slate-300">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="professional-services">Professional Services</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-slate-300">Company Size</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue" className="text-slate-300">Annual Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="1000000"
                  value={currentRevenue}
                  onChange={(e) => setCurrentRevenue(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-slate-300">Annual Marketing Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="100000"
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Operational Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="employees" className="text-slate-300">Marketing Team Size</Label>
                <Input
                  id="employees"
                  type="number"
                  placeholder="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-slate-300">Average Salary ($)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="65000"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversion" className="text-slate-300">Current Conversion Rate (%)</Label>
                <Input
                  id="conversion"
                  type="number"
                  placeholder="2.5"
                  step="0.1"
                  value={currentConversion}
                  onChange={(e) => setCurrentConversion(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-slate-300">Manual Tasks (hours/week)</Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="20"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={calculateROI}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            disabled={!currentRevenue || !marketingBudget || !employeeCount || !hoursPerWeek}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate ROI
          </Button>

          {/* Basic Results Section */}
          {results && (
            <>
              <Separator className="bg-slate-600" />
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  Your AI Marketing ROI
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-slate-400 text-sm">Monthly Savings</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(results.monthlySavings)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-slate-400 text-sm">Annual ROI</p>
                          <p className="text-2xl font-bold text-white">{formatPercentage(results.roiPercentage)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-slate-400 text-sm">Payback Period</p>
                          <p className="text-2xl font-bold text-white">{results.paybackPeriod} mo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA for Enhanced Results */}
                {!leadCaptured && (
                  <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-600">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <h4 className="text-xl font-bold text-white">Want Detailed Analysis?</h4>
                        <p className="text-blue-100">
                          Get a comprehensive ROI breakdown, implementation roadmap, and industry benchmarks
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Custom Implementation Plan
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Industry Benchmarks
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Risk Assessment
                          </div>
                        </div>
                        <Button 
                          onClick={handleEnhancedResults}
                          className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-6 py-3"
                        >
                          Get Enhanced Results
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Thank You Message */}
                {leadCaptured && (
                  <Card className="bg-gradient-to-r from-green-900 to-emerald-900 border-green-600">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
                        <h4 className="text-xl font-bold text-white">Thank You!</h4>
                        <p className="text-green-100">
                          Your detailed ROI analysis will be sent to your email within the next few minutes.
                          Our team will also reach out to discuss a customized implementation strategy.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Lead Capture Form Modal */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        onSubmit={handleLeadSubmit}
        title="Get Your Detailed ROI Analysis"
        description="Enter your details to receive a comprehensive analysis with implementation roadmap and industry benchmarks."
        ctaText="Send My Analysis"
        isSubmitting={isSubmittingLead}
      />
    </div>
  );
}
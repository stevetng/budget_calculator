'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BudgetCalculator = () => {
  const [salary, setSalary] = useState('');
  const [state, setState] = useState('CA');
  const [budget, setBudget] = useState(null);

  // State tax brackets and rates
  const stateTaxBrackets = {
    'AL': { rate: 0.05, name: 'Alabama' },
    'AK': { rate: 0, name: 'Alaska' },
    'AZ': { rate: 0.0259, name: 'Arizona' },
    'AR': { rate: 0.055, name: 'Arkansas' },
    'CA': { rate: 0.093, name: 'California' },
    'CO': { rate: 0.044, name: 'Colorado' },
    'CT': { rate: 0.0699, name: 'Connecticut' },
    'DE': { rate: 0.066, name: 'Delaware' },
    'FL': { rate: 0, name: 'Florida' },
    'GA': { rate: 0.0575, name: 'Georgia' },
    'HI': { rate: 0.11, name: 'Hawaii' },
    'ID': { rate: 0.058, name: 'Idaho' },
    'IL': { rate: 0.0495, name: 'Illinois' },
    'IN': { rate: 0.0323, name: 'Indiana' },
    'IA': { rate: 0.0575, name: 'Iowa' },
    'KS': { rate: 0.057, name: 'Kansas' },
    'KY': { rate: 0.045, name: 'Kentucky' },
    'LA': { rate: 0.0425, name: 'Louisiana' },
    'ME': { rate: 0.0715, name: 'Maine' },
    'MD': { rate: 0.0575, name: 'Maryland' },
    'MA': { rate: 0.05, name: 'Massachusetts' },
    'MI': { rate: 0.0405, name: 'Michigan' },
    'MN': { rate: 0.0985, name: 'Minnesota' },
    'MS': { rate: 0.05, name: 'Mississippi' },
    'MO': { rate: 0.054, name: 'Missouri' },
    'MT': { rate: 0.0675, name: 'Montana' },
    'NE': { rate: 0.0684, name: 'Nebraska' },
    'NV': { rate: 0, name: 'Nevada' },
    'NH': { rate: 0, name: 'New Hampshire' },
    'NJ': { rate: 0.1075, name: 'New Jersey' },
    'NM': { rate: 0.049, name: 'New Mexico' },
    'NY': { rate: 0.0685, name: 'New York' },
    'NC': { rate: 0.0475, name: 'North Carolina' },
    'ND': { rate: 0.029, name: 'North Dakota' },
    'OH': { rate: 0.0399, name: 'Ohio' },
    'OK': { rate: 0.0475, name: 'Oklahoma' },
    'OR': { rate: 0.099, name: 'Oregon' },
    'PA': { rate: 0.0307, name: 'Pennsylvania' },
    'RI': { rate: 0.0599, name: 'Rhode Island' },
    'SC': { rate: 0.07, name: 'South Carolina' },
    'SD': { rate: 0, name: 'South Dakota' },
    'TN': { rate: 0, name: 'Tennessee' },
    'TX': { rate: 0, name: 'Texas' },
    'UT': { rate: 0.0485, name: 'Utah' },
    'VT': { rate: 0.0875, name: 'Vermont' },
    'VA': { rate: 0.0575, name: 'Virginia' },
    'WA': { rate: 0, name: 'Washington' },
    'WV': { rate: 0.065, name: 'West Virginia' },
    'WI': { rate: 0.0765, name: 'Wisconsin' },
    'WY': { rate: 0, name: 'Wyoming' }
  };

  const calculateFederalTax = (salary) => {
    const numSalary = Number(salary);
    if (numSalary <= 11600) return numSalary * 0.10;
    if (numSalary <= 47150) return 1160 + (numSalary - 11600) * 0.12;
    if (numSalary <= 100525) return 5426 + (numSalary - 47150) * 0.22;
    if (numSalary <= 191950) return 17168.50 + (numSalary - 100525) * 0.24;
    if (numSalary <= 243725) return 39110.50 + (numSalary - 191950) * 0.32;
    if (numSalary <= 609350) return 55678.50 + (numSalary - 243725) * 0.35;
    return 183647.25 + (numSalary - 609350) * 0.37;
  };

  const calculateBudget = () => {
    const annualSalary = Number(salary);
    const stateTax = annualSalary * stateTaxBrackets[state].rate;
    const federalTax = calculateFederalTax(annualSalary);
    const ficaTax = annualSalary * 0.0765;
    
    const totalTax = stateTax + federalTax + ficaTax;
    const postTaxAnnual = annualSalary - totalTax;
    const monthlyIncome = postTaxAnnual / 12;

    const newBudget = {
      monthlyIncome: monthlyIncome,
      housing: monthlyIncome * 0.30,
      utilities: monthlyIncome * 0.05,
      groceries: monthlyIncome * 0.10,
      transportation: monthlyIncome * 0.10,
      savings: monthlyIncome * 0.20,
      retirement: monthlyIncome * 0.10,
      entertainment: monthlyIncome * 0.05,
      shopping: monthlyIncome * 0.05,
      other: monthlyIncome * 0.05,
      taxes: {
        federal: federalTax / 12,
        state: stateTax / 12,
        fica: ficaTax / 12
      }
    };

    setBudget(newBudget);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const pieData = budget ? [
    { name: 'Housing', value: budget.housing, color: '#0ea5e9' },
    { name: 'Utilities', value: budget.utilities, color: '#22c55e' },
    { name: 'Groceries', value: budget.groceries, color: '#eab308' },
    { name: 'Transportation', value: budget.transportation, color: '#ec4899' },
    { name: 'Savings', value: budget.savings, color: '#8b5cf6' },
    { name: 'Retirement', value: budget.retirement, color: '#f43f5e' },
    { name: 'Entertainment', value: budget.entertainment, color: '#14b8a6' },
    { name: 'Shopping', value: budget.shopping, color: '#f97316' },
    { name: 'Other', value: budget.other, color: '#6366f1' }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post-Tax Budget Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Salary</label>
              <Input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter your annual salary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stateTaxBrackets).map(([code, info]) => (
                    <SelectItem key={code} value={code}>{info.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculateBudget} className="w-full">Calculate Budget</Button>
        </CardContent>
      </Card>

      {budget && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  Monthly Post-Tax Income: {formatCurrency(budget.monthlyIncome)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Recommended Monthly Expenses</h3>
                    <div className="space-y-1">
                      <p>Housing: {formatCurrency(budget.housing)}</p>
                      <p>Utilities: {formatCurrency(budget.utilities)}</p>
                      <p>Groceries: {formatCurrency(budget.groceries)}</p>
                      <p>Transportation: {formatCurrency(budget.transportation)}</p>
                      <p>Savings: {formatCurrency(budget.savings)}</p>
                      <p>Retirement: {formatCurrency(budget.retirement)}</p>
                      <p>Entertainment: {formatCurrency(budget.entertainment)}</p>
                      <p>Shopping: {formatCurrency(budget.shopping)}</p>
                      <p>Other: {formatCurrency(budget.other)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Monthly Tax Breakdown</h3>
                    <div className="space-y-1">
                      <p>Federal Tax: {formatCurrency(budget.taxes.federal)}</p>
                      <p>State Tax: {formatCurrency(budget.taxes.state)}</p>
                      <p>FICA Tax: {formatCurrency(budget.taxes.fica)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BudgetCalculator;
import React, { useState, useEffect } from 'react';
import InputForm from '../components/InputForm';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Reviewing bulk cargo requirements & tonnage specifications...',
  'Querying corridor bunker prices & historical Baltic rate fixtures...',
  'Computing forward econometric rate projections...',
  'Synthesizing chartering decision support recommendation...',
];

export default function NewAnalysis({ setCurrentPage, setAnalysisData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading && stageIndex < ANALYSIS_STAGES.length - 1) {
      timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1);
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isLoading, stageIndex]);

  const handleStartAnalysis = async (procurementInput) => {
    setIsLoading(true);
    setStageIndex(0);

    // Mock analytical calculation matching the expected contract
    setTimeout(() => {
      const isDecreasing = procurementInput.cargo === 'coal';
      const simulatedResult = {
        input: procurementInput,
        current_rate: 15.2,
        forecast_rate: isDecreasing ? 13.7 : 16.4,
        trend: isDecreasing ? 'decreasing' : 'increasing',
        volatility: 'medium',
        confidence: 0.84,
        recommendation: isDecreasing 
          ? 'WAIT FOR BETTER MARKET ENTRY' 
          : 'LOCK IN TONNAGE IMMEDIATELY',
        savings_amount: 450000,
        historical_rates: [
          { date: '2026-01', rate: 16.2, isForecast: false },
          { date: '2026-02', rate: 15.8, isForecast: false },
          { date: '2026-03', rate: 15.2, isForecast: false },
          { date: '2026-04', rate: 14.5, isForecast: true },
          { date: '2026-05', rate: 13.9, isForecast: true },
          { date: '2026-06', rate: 13.7, isForecast: true },
        ],
      };

      setAnalysisData(simulatedResult);
      setIsLoading(false);
      setCurrentPage('dashboard');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition mb-2"
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">New Freight & Chartering Analysis</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Input requirement parameters to predict forward dry bulk rates and receive timing recommendations.
          </p>
        </div>
      </div>

      {/* Progressive Stage Loader Overlay */}
      {isLoading && (
        <div className="mb-8 p-6 rounded-xl bg-slate-900/90 border border-sky-500/30 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="animate-spin text-sky-400" size={22} />
            <h3 className="text-sm font-semibold text-slate-200">Processing Market Intelligence Model</h3>
          </div>
          <div className="space-y-2.5">
            {ANALYSIS_STAGES.map((desc, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                {idx < stageIndex ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : idx === stageIndex ? (
                  <Loader2 size={16} className="animate-spin text-sky-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                )}
                <span className={idx <= stageIndex ? 'text-slate-200' : 'text-slate-500'}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4-Section Form */}
      <InputForm onSubmit={handleStartAnalysis} isLoading={isLoading} />
    </div>
  );
}
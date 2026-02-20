import React from 'react';
import { type AIAnalysisResponse } from '../types';
import { UserIcon, StethoscopeIcon, ThermometerIcon, HeartIcon } from './IconComponents';

interface AiAnalysisProps {
  analysis: AIAnalysisResponse | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse flex flex-col gap-2">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
)

const AnalysisCard: React.FC<{title: string, icon: React.ReactNode, content: string | undefined, isLoading: boolean}> = ({ title, icon, content, isLoading }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h4 className="font-bold text-slate-100">{title}</h4>
        </div>
        {isLoading ? <SkeletonLoader /> : content ? (
            <p className="text-sm text-slate-300">{content}</p>
        ) : (
            <p className="text-sm text-slate-500">Awaiting sufficient data for analysis...</p>
        )}
    </div>
);

const AiAnalysis: React.FC<AiAnalysisProps> = ({ analysis, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-300 mb-4">AI-Powered Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Temperature Analysis */}
        <AnalysisCard 
            title="Temperature: For You"
            icon={<UserIcon className="w-6 h-6 text-cyan-400" />}
            content={analysis?.temperatureRecommendation}
            isLoading={isLoading}
        />
         <AnalysisCard 
            title="Temperature: Professional Note"
            icon={<StethoscopeIcon className="w-6 h-6 text-cyan-400" />}
            content={analysis?.temperatureProfessionalNote}
            isLoading={isLoading}
        />

        {/* Heart Rate Analysis */}
        <AnalysisCard 
            title="Heart Rate: For You"
            icon={<UserIcon className="w-6 h-6 text-pink-400" />}
            content={analysis?.heartRateRecommendation}
            isLoading={isLoading}
        />
        <AnalysisCard 
            title="Heart Rate: Professional Note"
            icon={<StethoscopeIcon className="w-6 h-6 text-pink-400" />}
            content={analysis?.heartRateProfessionalNote}
            isLoading={isLoading}
        />

      </div>
    </div>
  );
};

export default AiAnalysis;

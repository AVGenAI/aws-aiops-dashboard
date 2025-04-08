'use client';

import { useState } from 'react';
import ExportButton from './ExportButton';

interface ExportPanelProps {
  data: any;
  filename: string;
  className?: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

const ExportPanel = ({
  data,
  filename,
  className = '',
  onExportStart,
  onExportComplete,
  onExportError
}: ExportPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
        Export
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {expanded && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10 flex flex-col space-y-2 min-w-[120px]">
          <ExportButton
            data={data}
            filename={filename}
            type="json"
            className="w-full justify-center"
            onExportStart={onExportStart}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
          />
          <ExportButton
            data={data}
            filename={filename}
            type="csv"
            className="w-full justify-center"
            onExportStart={onExportStart}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
          />
          <ExportButton
            data={data}
            filename={filename}
            type="pdf"
            className="w-full justify-center"
            onExportStart={onExportStart}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
          />
        </div>
      )}
    </div>
  );
};

export default ExportPanel;

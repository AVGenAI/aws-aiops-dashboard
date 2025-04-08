'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  data: any;
  filename: string;
  type: 'json' | 'csv' | 'pdf';
  label?: string;
  className?: string;
  disabled?: boolean;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

const ExportButton = ({
  data,
  filename,
  type,
  label,
  className = '',
  disabled = false,
  onExportStart,
  onExportComplete,
  onExportError
}: ExportButtonProps) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (disabled || exporting) return;

    try {
      setExporting(true);
      onExportStart?.();

      let content: string | Blob;
      let mimeType: string;
      let fileExtension: string;

      switch (type) {
        case 'json':
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          fileExtension = 'json';
          break;
        case 'csv':
          content = convertToCSV(data);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'pdf':
          // For PDF, we'll use the API endpoint
          const response = await fetch('/api/export/pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, filename }),
          });

          if (!response.ok) {
            throw new Error(`Failed to generate PDF: ${response.statusText}`);
          }

          const blob = await response.blob();
          saveAs(blob, `${filename}.pdf`);
          setExporting(false);
          onExportComplete?.();
          return;
        default:
          throw new Error(`Unsupported export type: ${type}`);
      }

      // Create a blob and save the file
      const blob = new Blob([content], { type: mimeType });
      saveAs(blob, `${filename}.${fileExtension}`);

      onExportComplete?.();
    } catch (error) {
      console.error('Export error:', error);
      onExportError?.(error as Error);
    } finally {
      setExporting(false);
    }
  };

  // Helper function to convert data to CSV format
  const convertToCSV = (data: any): string => {
    if (!data || !data.length) return '';

    // Handle array of objects
    if (Array.isArray(data) && typeof data[0] === 'object') {
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => 
          headers.map(header => {
            const cell = row[header];
            // Handle nested objects and arrays
            const cellValue = typeof cell === 'object' ? JSON.stringify(cell) : cell;
            // Escape quotes and wrap in quotes if contains comma
            return typeof cellValue === 'string' && (cellValue.includes(',') || cellValue.includes('"')) 
              ? `"${cellValue.replace(/"/g, '""')}"` 
              : cellValue;
          }).join(',')
        )
      ];
      return csvRows.join('\n');
    }

    // Handle simple array
    if (Array.isArray(data)) {
      return data.join('\n');
    }

    // Handle object
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');
    }

    // Handle primitive
    return String(data);
  };

  const buttonLabel = label || `Export ${type.toUpperCase()}`;
  
  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting}
      className={`px-3 py-1 text-sm rounded transition-colors ${
        disabled || exporting
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : type === 'json'
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : type === 'csv'
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      } ${className}`}
    >
      {exporting ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </span>
      ) : (
        buttonLabel
      )}
    </button>
  );
};

export default ExportButton;

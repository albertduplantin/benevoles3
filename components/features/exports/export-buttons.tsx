'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { MissionClient, UserClient } from '@/types';
import {
  exportMissionVolunteersPDF,
  exportMissionReportPDF,
  exportGlobalStatsPDF,
} from '@/lib/utils/pdf-export';
import {
  exportMissionVolunteersExcel,
  exportMissionReportExcel,
  exportGlobalStatsExcel,
  exportFullDataExcel,
} from '@/lib/utils/excel-export';

interface ExportButtonsProps {
  type: 'mission' | 'global';
  mission?: MissionClient;
  missions?: MissionClient[];
  volunteers?: UserClient[];
  responsibles?: UserClient[];
  totalVolunteers?: number;
  allVolunteers?: Map<string, UserClient>;
}

export function ExportButtons({
  type,
  mission,
  missions,
  volunteers = [],
  responsibles = [],
  totalVolunteers = 0,
  allVolunteers,
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel', exportType: string) => {
    setIsExporting(true);
    try {
      if (type === 'mission' && mission) {
        // Exports pour une mission spécifique
        if (format === 'pdf') {
          if (exportType === 'volunteers') {
            await exportMissionVolunteersPDF(mission, volunteers);
          } else if (exportType === 'report') {
            await exportMissionReportPDF(mission, volunteers, responsibles);
          }
        } else if (format === 'excel') {
          if (exportType === 'volunteers') {
            exportMissionVolunteersExcel(mission, volunteers);
          } else if (exportType === 'report') {
            exportMissionReportExcel(mission, volunteers, responsibles);
          }
        }
      } else if (type === 'global' && missions) {
        // Exports globaux
        if (format === 'pdf') {
          await exportGlobalStatsPDF(missions, totalVolunteers);
        } else if (format === 'excel') {
          if (exportType === 'stats') {
            exportGlobalStatsExcel(missions, totalVolunteers);
          } else if (exportType === 'full' && allVolunteers) {
            exportFullDataExcel(missions, allVolunteers);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  if (type === 'mission') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Exporter au format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Liste des bénévoles
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleExport('pdf', 'volunteers')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF - Liste bénévoles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel', 'volunteers')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel - Liste bénévoles
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-gray-500">
            Rapport complet
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleExport('pdf', 'report')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF - Rapport complet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel', 'report')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel - Rapport complet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Type === 'global'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exporter les données
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Exporter au format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Statistiques
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('pdf', 'stats')}>
          <FileText className="mr-2 h-4 w-4" />
          PDF - Statistiques
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel', 'stats')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel - Statistiques
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Export complet
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('excel', 'full')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel - Toutes les données
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


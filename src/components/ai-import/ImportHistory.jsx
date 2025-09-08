import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  History, 
  Download, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock,
  Undo
} from 'lucide-react';

const mockImportHistory = [
  {
    id: 'IMP-001',
    type: 'Students',
    files: ['students_grade5.pdf', 'students_grade6.xlsx'],
    total_records: 85,
    successful: 82,
    failed: 3,
    status: 'Completed',
    imported_by: 'admin@school.edu',
    imported_at: '2024-01-15T10:30:00Z',
    processing_time: '2m 15s'
  },
  {
    id: 'IMP-002',
    type: 'Teachers',
    files: ['teacher_list.csv'],
    total_records: 24,
    successful: 24,
    failed: 0,
    status: 'Completed',
    imported_by: 'admin@school.edu',
    imported_at: '2024-01-14T14:45:00Z',
    processing_time: '45s'
  },
  {
    id: 'IMP-003',
    type: 'Fee Records',
    files: ['fee_structure.pdf'],
    total_records: 150,
    successful: 0,
    failed: 150,
    status: 'Failed',
    imported_by: 'admin@school.edu',
    imported_at: '2024-01-13T09:15:00Z',
    processing_time: '1m 30s',
    error: 'Invalid date formats in fee records'
  },
  {
    id: 'IMP-004',
    type: 'Students',
    files: ['admission_forms.pdf'],
    total_records: 45,
    successful: 45,
    failed: 0,
    status: 'Processing',
    imported_by: 'admin@school.edu',
    imported_at: '2024-01-15T15:20:00Z',
    processing_time: 'In progress...'
  }
];

export default function ImportHistory() {
  const [imports, setImports] = useState(mockImportHistory);
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.Pending;
  };

  const handleReprocess = async (importId) => {
    setLoading(true);
    // Simulate reprocessing
    setTimeout(() => {
      setImports(prev => prev.map(imp => 
        imp.id === importId 
          ? { ...imp, status: 'Processing' }
          : imp
      ));
      setLoading(false);
    }, 1000);
  };

  const handleRollback = async (importId) => {
    if (confirm('Are you sure you want to rollback this import? This will remove all imported records.')) {
      setLoading(true);
      // Simulate rollback
      setTimeout(() => {
        setImports(prev => prev.map(imp => 
          imp.id === importId 
            ? { ...imp, status: 'Rolled Back', successful: 0 }
            : imp
        ));
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Import History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Import ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((imp) => (
                <TableRow key={imp.id}>
                  <TableCell className="font-medium">{imp.id}</TableCell>
                  <TableCell>{imp.type}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {imp.files.map((file, index) => (
                        <div key={index} className="text-xs text-slate-600 truncate max-w-32">
                          {file}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">{imp.successful}</span>
                        {imp.failed > 0 && (
                          <>
                            {' / '}
                            <span className="text-red-600 font-medium">{imp.failed}</span>
                            {' failed'}
                          </>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        of {imp.total_records} total
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(imp.status)}
                      <Badge className={getStatusBadge(imp.status)}>
                        {imp.status}
                      </Badge>
                    </div>
                    {imp.error && (
                      <div className="text-xs text-red-600 mt-1">
                        {imp.error}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(imp.imported_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(imp.imported_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{imp.processing_time}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {imp.status === 'Failed' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReprocess(imp.id)}
                          disabled={loading}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      {imp.status === 'Completed' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRollback(imp.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Undo className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
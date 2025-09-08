import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Slash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function GuardianHealthCard({ stats }) {
  const healthPercentage = stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0;
  
  return (
    <Card className="mb-6 border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle>Guardian Data Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-1">
                <p className="text-4xl font-bold text-slate-900">{healthPercentage}%</p>
                <p className="text-sm text-slate-600">Verified Guardians</p>
                <Progress value={healthPercentage} className="mt-2" />
            </div>
            <div className="md:col-span-3 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                        <p className="font-bold text-lg">{stats.verified}</p>
                        <p className="text-sm text-slate-600">Verified</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-yellow-600" />
                    <div>
                        <p className="font-bold text-lg">{stats.unverified}</p>
                        <p className="text-sm text-slate-600">Unverified</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <Slash className="w-8 h-8 text-red-600" />
                    <div>
                        <p className="font-bold text-lg">{stats.optedOut}</p>
                        <p className="text-sm text-slate-600">Opted Out</p>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
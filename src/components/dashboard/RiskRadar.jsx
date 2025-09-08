import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Clock, DollarSign } from "lucide-react";

export default function RiskRadar() {
  const risks = [
    {
      id: 1,
      type: "Low Attendance",
      description: "Grade 8-B has 68% attendance this week",
      severity: "High",
      icon: TrendingDown,
      color: "text-red-500"
    },
    {
      id: 2,
      type: "Exam Lag",
      description: "Physics Grade 10 results pending for 5 days",
      severity: "Medium",
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      id: 3,
      type: "Unpaid Dues",
      description: "42 students have overdue fees totaling ₹3.2L",
      severity: "High",
      icon: DollarSign,
      color: "text-red-500"
    },
    {
      id: 4,
      type: "Teacher Absence",
      description: "Mathematics teacher absent for 3 consecutive days",
      severity: "Medium",
      icon: AlertTriangle,
      color: "text-yellow-500"
    }
  ];

  const getSeverityBadge = (severity) => {
    const colors = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[severity] || colors.Medium;
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Risk Radar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((risk) => (
          <div key={risk.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
            <risk.icon className={`w-5 h-5 mt-0.5 ${risk.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-slate-900 text-sm">{risk.type}</h4>
                <Badge className={getSeverityBadge(risk.severity)}>
                  {risk.severity}
                </Badge>
              </div>
              <p className="text-xs text-slate-600">{risk.description}</p>
            </div>
          </div>
        ))}
        
        {risks.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No risks detected</p>
            <p className="text-xs mt-1">Your school is running smoothly!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
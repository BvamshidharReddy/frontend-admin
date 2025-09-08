import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, AlertCircle, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ActionQueue() {
  const navigate = useNavigate();
  
  const actions = [
    {
      id: 1,
      type: "Unmarked Attendance",
      description: "Grade 7-A attendance not marked today",
      priority: "High",
      icon: CheckSquare,
      action: "Mark Now",
      time: "Due 2 hours ago",
      redirectTo: "Attendance"
    },
    {
      id: 2,
      type: "Pending Moderation",
      description: "Mathematics Grade 10 exam results need approval",
      priority: "Medium",
      icon: Clock,
      action: "Review",
      time: "Due in 1 hour",
      redirectTo: "Examinations"
    },
    {
      id: 3,
      type: "Unresolved Ticket",
      description: "Parent complaint about transport timing",
      priority: "High",
      icon: AlertCircle,
      action: "Respond",
      time: "Due 30 mins ago",
      redirectTo: "Support"
    },
    {
      id: 4,
      type: "Fee Approval",
      description: "3 scholarship applications need review",
      priority: "Medium",
      icon: UserCheck,
      action: "Approve",
      time: "Due today",
      redirectTo: "Fees"
    }
  ];

  const getPriorityBadge = (priority) => {
    const colors = {
      High: "bg-red-100 text-red-800 border-red-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200"
    };
    return colors[priority] || colors.Medium;
  };

  const handleActionClick = (action) => {
    if (action.redirectTo) {
      navigate(createPageUrl(action.redirectTo));
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Action Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <action.icon className="w-5 h-5 text-slate-500" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-slate-900 text-sm">{action.type}</h4>
                <Badge className={getPriorityBadge(action.priority)}>
                  {action.priority}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mb-2">{action.description}</p>
              <p className="text-xs text-slate-500">{action.time}</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="shrink-0"
              onClick={() => handleActionClick(action)}
            >
              {action.action}
            </Button>
          </div>
        ))}

        {actions.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>All caught up!</p>
            <p className="text-xs mt-1">No pending actions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
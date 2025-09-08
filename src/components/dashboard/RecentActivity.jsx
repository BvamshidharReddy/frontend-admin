import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  FileText, 
  DollarSign, 
  MessageSquare,
  Clock
} from "lucide-react";

const mockActivities = [
  {
    id: 1,
    type: "attendance",
    title: "Attendance marked for Grade 10-A",
    time: "5 minutes ago",
    icon: ClipboardCheck,
    color: "from-green-500 to-green-600"
  },
  {
    id: 2,
    type: "exam",
    title: "Math exam scheduled for Grade 9",
    time: "1 hour ago",
    icon: FileText,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 3,
    type: "fee",
    title: "Fee payment received from John Doe",
    time: "2 hours ago",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 4,
    type: "announcement",
    title: "Holiday announcement sent to parents",
    time: "3 hours ago",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 5,
    type: "exam",
    title: "English exam results published",
    time: "1 day ago",
    icon: FileText,
    color: "from-blue-500 to-blue-600"
  }
];

export default function RecentActivity() {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
              <activity.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 mb-1">
                {activity.title}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                  {activity.time}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
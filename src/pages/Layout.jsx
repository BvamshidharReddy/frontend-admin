

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileText,
  DollarSign,
  MessageSquare,
  Settings,
  Award,
  Crown,
  Star,
  Briefcase,
  BedDouble,
  Bus,
  FilePlus2,
  Library,
  Calendar,
  Bot,
  Video,
  LifeBuoy,
  Cpu // Added Cpu icon for AI Bulk Import
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    tier: "basic"
  },
  {
    title: "AI Bulk Import", // New navigation item
    url: createPageUrl("AIImport"),
    icon: Cpu,
    tier: "premium"
  },
  {
    title: "People",
    url: createPageUrl("People"),
    icon: Users,
    tier: "basic"
  },
  {
    title: "Students",
    url: createPageUrl("Students"),
    icon: Users,
    tier: "basic"
  },
  {
    title: "Teachers",
    url: createPageUrl("Teachers"),
    icon: GraduationCap,
    tier: "basic"
  },
  {
    title: "Academics",
    url: createPageUrl("Academics"),
    icon: BookOpen,
    tier: "basic"
  },
  {
    title: "Attendance",
    url: createPageUrl("Attendance"),
    icon: ClipboardCheck,
    tier: "basic"
  },
  {
    title: "Examinations",
    url: createPageUrl("Examinations"),
    icon: FileText,
    tier: "basic"
  },
  {
    title: "Fee Management",
    url: createPageUrl("Fees"),
    icon: DollarSign,
    tier: "basic"
  },
  {
    title: "Communications",
    url: createPageUrl("Communications"),
    icon: MessageSquare,
    tier: "basic"
  },
  {
    title: "Calendar & Events",
    url: createPageUrl("Calendar"),
    icon: Calendar,
    tier: "standard"
  },
  {
    title: "HR & Payroll",
    url: createPageUrl("HR"),
    icon: Briefcase,
    tier: "standard"
  },
  {
    title: "Hostel & Meals",
    url: createPageUrl("Hostel"),
    icon: BedDouble,
    tier: "standard"
  },
  {
    title: "Transport & GPS",
    url: createPageUrl("Transport"),
    icon: Bus,
    tier: "standard"
  },
  {
    title: "Admissions & Cert.",
    url: createPageUrl("Admissions"),
    icon: FilePlus2,
    tier: "standard"
  },
  {
    title: "Library & Inventory",
    url: createPageUrl("Library"),
    icon: Library,
    tier: "standard"
  },
  {
    title: "E-Learning",
    url: createPageUrl("ELearning"),
    icon: Video,
    tier: "premium"
  },
  {
    title: "AI Chatbot",
    url: createPageUrl("Chatbot"),
    icon: Bot,
    tier: "premium"
  },
  {
    title: "Support & Tickets",
    url: createPageUrl("Support"),
    icon: LifeBuoy,
    tier: "basic"
  }
];

const tierBadges = {
  basic: { label: "Basic", color: "bg-blue-100 text-blue-800" },
  standard: { label: "Standard", color: "bg-purple-100 text-purple-800" },
  premium: { label: "Premium", color: "bg-amber-100 text-amber-800" }
};

const getTierIcon = (tier) => {
  switch(tier) {
    case 'standard': return <Star className="w-3 h-3" />;
    case 'premium': return <Crown className="w-3 h-3" />;
    default: return null;
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const currentTier = "basic"; // This would come from tenant settings

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-md">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">MedhaShaala</h2>
                <p className="text-xs text-slate-500 font-medium">School Admin</p>
              </div>
            </div>
            <div className="mt-4">
              <Badge className={`${tierBadges[currentTier].color} font-semibold`}>
                {getTierIcon(currentTier)}
                <span className="ml-1">{tierBadges[currentTier].label}</span>
              </Badge>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-300 rounded-lg mb-1 border border-transparent hover:border-blue-200/50 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200/50 shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                          <span className="font-medium text-sm">{item.title}</span>
                          {item.tier !== 'basic' && (
                            <Badge variant="secondary" className={`ml-auto text-xs ${tierBadges[item.tier].color}`}>
                              {getTierIcon(item.tier)}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Students</span>
                      <span className="font-bold text-blue-700">0</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Teachers</span>
                      <span className="font-bold text-green-700">0</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Classes</span>
                      <span className="font-bold text-orange-700">0</span>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <Link to={createPageUrl("Settings")}>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Settings className="w-5 h-5 text-slate-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">Settings</p>
                  <p className="text-xs text-slate-500">Configure your school</p>
                </div>
              </div>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">MedhaShaala</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
        
        <ChatbotWidget />
      </div>
    </SidebarProvider>
  );
}


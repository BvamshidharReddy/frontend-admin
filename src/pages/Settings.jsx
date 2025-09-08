import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, School, Users, Bell, Shield, Globe, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const [schoolSettings, setSchoolSettings] = useState({
    name: "MedhaShaala International School",
    address: "123 Education Street, Learning City, LC 12345",
    phone: "+91 98765 43210",
    email: "admin@medhashaala.edu",
    website: "www.medhashaala.edu",
    currentTier: "premium" // Set to premium to show all features
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    examNotifications: true
  });

  const tierFeatures = {
    basic: [
      "Student & Teacher Management",
      "Basic Attendance Tracking",
      "Simple Fee Management",
      "Basic Communication Tools",
      "Standard Reports"
    ],
    standard: [
      "All Basic Features",
      "HR & Payroll Management",
      "Transport & GPS Tracking",
      "Hostel Management",
      "Library & Inventory",
      "Advanced Reports"
    ],
    premium: [
      "All Standard Features",
      "AI-Powered Features",
      "Auto Question Paper Generation",
      "24/7 AI Chatbot",
      "E-Learning Platform",
      "Custom Branding"
    ]
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Configure your school management system</p>
          </div>
        </div>

        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 md:w-auto">
            <TabsTrigger value="school">
              <School className="w-4 h-4 mr-2" />
              School
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Globe className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>School Name</Label>
                    <Input value={schoolSettings.name} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={schoolSettings.email} />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={schoolSettings.address} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input value={schoolSettings.phone} />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={schoolSettings.website} />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive notifications via email</p>
                  </div>
                  <Switch checked={notifications.emailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-slate-600">Receive notifications via SMS</p>
                  </div>
                  <Switch checked={notifications.smsNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-slate-600">Receive push notifications</p>
                  </div>
                  <Switch checked={notifications.pushNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Attendance Alerts</Label>
                    <p className="text-sm text-slate-600">Alert for student absence</p>
                  </div>
                  <Switch checked={notifications.attendanceAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Fee Reminders</Label>
                    <p className="text-sm text-slate-600">Automatic fee due reminders</p>
                  </div>
                  <Switch checked={notifications.feeReminders} />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {Object.entries(tierFeatures).map(([tier, features]) => (
                <Card key={tier} className={`border-0 shadow-sm ${tier === schoolSettings.currentTier ? 'bg-blue-50 border-blue-200' : 'bg-white/80'} backdrop-blur-md`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="capitalize">{tier} Plan</CardTitle>
                      {tier === schoolSettings.currentTier && (
                        <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold">
                      {tier === 'basic' && '₹2,999'}
                      {tier === 'standard' && '₹5,999'}
                      {tier === 'premium' && '₹9,999'}
                      <span className="text-sm font-normal text-slate-600">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {tier === schoolSettings.currentTier ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button className="w-full">
                        {tier === 'basic' ? 'Downgrade' : 'Upgrade'} to {tier}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Manage user roles and permissions for your school.</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Principal</p>
                      <p className="text-sm text-slate-600">Full system access</p>
                    </div>
                    <Badge>1 user</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Admin Staff</p>
                      <p className="text-sm text-slate-600">Administrative access</p>
                    </div>
                    <Badge>3 users</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Teachers</p>
                      <p className="text-sm text-slate-600">Teaching and grading access</p>
                    </div>
                    <Badge>24 users</Badge>
                  </div>
                </div>
                <Button className="mt-4">Manage Permissions</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Privacy & Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">DPDP Compliance</Label>
                    <p className="text-sm text-slate-600">Digital Personal Data Protection Act compliance</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Data Retention Policy</Label>
                    <p className="text-sm text-slate-600">Automatic data cleanup after 7 years</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Audit Logging</Label>
                    <p className="text-sm text-slate-600">Track all system changes</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Media Consent Required</Label>
                    <p className="text-sm text-slate-600">Require consent for photos/videos</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Button>Export Audit Logs</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Academic Year</Label>
                    <Input value="2024-2025" />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Input value="Asia/Kolkata" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Language</Label>
                    <Input value="English" />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Input value="INR (₹)" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-slate-600">Temporarily disable system access</p>
                  </div>
                  <Switch />
                </div>
                <Button>Save System Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
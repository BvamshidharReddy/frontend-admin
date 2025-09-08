import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FeatureListItem = ({ children }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
    <span className="text-sm text-slate-700">{children}</span>
  </li>
);

export default function UpgradeTierDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Unlock more powerful features to manage your institution efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Card className="border-purple-200 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-purple-600" />
                Standard Plan
              </CardTitle>
              <p className="text-2xl font-bold">₹5,999 <span className="text-sm font-normal text-slate-500">/month</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <FeatureListItem>All Basic Features</FeatureListItem>
                <FeatureListItem>HR & Payroll Management</FeatureListItem>
                <FeatureListItem>Transport & GPS Tracking</FeatureListItem>
                <FeatureListItem>Hostel Management</FeatureListItem>
                <FeatureListItem>Library & Inventory</FeatureListItem>
                <FeatureListItem>Advanced Reports</FeatureListItem>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="text-amber-500" />
                Premium Plan
              </CardTitle>
               <p className="text-2xl font-bold">₹9,999 <span className="text-sm font-normal text-slate-500">/month</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <FeatureListItem>All Standard Features</FeatureListItem>
                <FeatureListItem>AI-Powered Imports & OCR</FeatureListItem>
                <FeatureListItem>Auto Question Paper Generation</FeatureListItem>
                <FeatureListItem>24/7 AI Chatbot for Support</FeatureListItem>
                <FeatureListItem>E-Learning Platform</FeatureListItem>
                <FeatureListItem>Custom Branding & Domain</FeatureListItem>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Link to={createPageUrl("Settings") + '?tab=billing'}>
                    Go to Billing
                </Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
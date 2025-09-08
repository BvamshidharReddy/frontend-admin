import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

export default function UpgradeDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-600" />
            </div>
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            This feature is only available on our Premium plan. Upgrade now to unlock AI-powered insights and more!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Maybe Later</Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500">Upgrade Now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Search } from 'lucide-react';
import UpgradeDialog from './UpgradeDialog';

export default function AICard({ currentPlan }) {
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

    const handleSearchAttempt = (e) => {
        e.preventDefault();
        if (currentPlan !== 'premium') {
            setShowUpgradeDialog(true);
        } else {
            // Handle AI search logic for premium users
            const query = e.target.elements.search.value;
            alert(`AI Search for: "${query}"`);
        }
    };

    return (
        <>
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span>Medha AI Assistant</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearchAttempt} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                name="search"
                                placeholder="Ask Medha anything... (e.g., 'Show me all students with low attendance in Grade 5')"
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Ask AI</Button>
                    </form>
                </CardContent>
            </Card>
            <UpgradeDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} />
        </>
    );
}
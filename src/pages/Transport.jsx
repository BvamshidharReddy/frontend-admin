
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Plus, Crown, Route, Users, Navigation, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialRoutes = [
  { id: 'R01', name: 'City Center Route', stops: 12, students: 45, vehicle: 'V03', status: 'On Time' },
  { id: 'R02', name: 'Suburb Link', stops: 8, students: 32, vehicle: 'V01', status: 'Delayed' },
  { id: 'R03', name: 'East Side Express', stops: 15, students: 51, vehicle: 'V02', status: 'On Time' },
];

export default function Transport() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [isAddRouteDialogOpen, setIsAddRouteDialogOpen] = useState(false);
  const [newRouteData, setNewRouteData] = useState({ name: '', stops: '', students: '', vehicle: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  const handleAddRoute = () => {
    if (!newRouteData.name || !newRouteData.vehicle) {
      alert("Route Name and Vehicle are required.");
      return;
    }
    const newRoute = {
      id: `R${(routes.length + 1).toString().padStart(2, '0')}`,
      ...newRouteData,
      stops: parseInt(newRouteData.stops) || 0,
      students: parseInt(newRouteData.students) || 0,
      status: 'On Time',
    };
    setRoutes([...routes, newRoute]);
    setNewRouteData({ name: '', stops: '', students: '', vehicle: '' });
    setIsAddRouteDialogOpen(false);
  };

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoute = () => {
    if (routeToDelete) {
      setRoutes(routes.filter(r => r.id !== routeToDelete.id));
      setRouteToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              Transport & GPS
              <Badge className="bg-purple-100 text-purple-800">
                <Crown className="w-3 h-3 mr-1" />
                Standard
              </Badge>
            </h1>
            <p className="text-slate-600">Manage bus routes, student allocation, and real-time tracking.</p>
          </div>
          <Dialog open={isAddRouteDialogOpen} onOpenChange={setIsAddRouteDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Route</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="routeName">Route Name</Label>
                  <Input id="routeName" value={newRouteData.name} onChange={(e) => setNewRouteData({...newRouteData, name: e.target.value})} placeholder="e.g., West Side Loop"/>
                </div>
                <div>
                  <Label htmlFor="vehicle">Vehicle ID</Label>
                  <Input id="vehicle" value={newRouteData.vehicle} onChange={(e) => setNewRouteData({...newRouteData, vehicle: e.target.value})} placeholder="e.g., V04"/>
                </div>
                <div>
                  <Label htmlFor="stops">Number of Stops</Label>
                  <Input id="stops" type="number" value={newRouteData.stops} onChange={(e) => setNewRouteData({...newRouteData, stops: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="students">Number of Students</Label>
                  <Input id="students" type="number" value={newRouteData.students} onChange={(e) => setNewRouteData({...newRouteData, students: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2">
                   <Button variant="outline" onClick={() => setIsAddRouteDialogOpen(false)}>Cancel</Button>
                   <Button onClick={handleAddRoute}>Add Route</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm h-[500px]">
              <CardHeader>
                <CardTitle>Live GPS Tracking</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>Map view would be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle>Routes Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {routes.map(route => (
                  <Card key={route.id} className="p-4 hover:bg-slate-50 transition-colors border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full"><Bus className="w-5 h-5 text-blue-600"/></div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{route.name}</p>
                          <p className="text-xs text-slate-500">Vehicle {route.vehicle}</p>
                        </div>
                      </div>
                      <Badge className={route.status === 'On Time' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {route.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t mt-2">
                       <span className="flex items-center gap-1"><Navigation className="w-3 h-3"/> {route.stops} stops</span>
                       <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {route.students} students</span>
                       <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(route)}>
                         <Trash2 className="w-3 h-3"/>
                       </Button>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the route "{routeToDelete?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteRoute}>Delete Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

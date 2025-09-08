
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BedDouble, UserPlus, Utensils, Plus, Crown, ClipboardCheck, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialRooms = [
  { id: 'A-101', type: 'AC', capacity: 2, occupants: [{id: 'S012', name: 'Rohan'}, {id: 'S045', name: 'Amit'}], status: 'Occupied' },
  { id: 'A-102', type: 'Non-AC', capacity: 3, occupants: [{id: 'S088', name: 'Priya'}], status: 'Partially Occupied' },
  { id: 'B-205', type: 'AC', capacity: 2, occupants: [], status: 'Vacant' },
  { id: 'C-310', type: 'AC', capacity: 2, occupants: [{id: 'S201', name: 'Sita'}, {id: 'S210', name: 'Gita'}], status: 'Occupied' },
];

export default function Hostel() {
  const [rooms, setRooms] = useState(initialRooms);
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ id: '', type: 'Non-AC', capacity: '2' });
  
  // State for manage dialog
  const [isManageRoomDialogOpen, setIsManageRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showIdCardDialog, setShowIdCardDialog] = useState(false);

  const handleAddRoom = () => {
    if (!newRoomData.id || !newRoomData.capacity) {
      alert("Room No. and Capacity are required.");
      return;
    }
    const newRoom = {
      ...newRoomData,
      capacity: parseInt(newRoomData.capacity),
      occupants: [],
      status: 'Vacant',
    };
    setRooms([...rooms, newRoom]);
    setNewRoomData({ id: '', type: 'Non-AC', capacity: '2' });
    setIsAddRoomDialogOpen(false);
  };
  
  const handleManageClick = (room) => {
    setSelectedRoom(room);
    setIsManageRoomDialogOpen(true);
  };
  
  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                Hostel & Meals
                <Badge className="bg-purple-100 text-purple-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Standard
                </Badge>
              </h1>
              <p className="text-slate-600">Oversee hostel admissions, room allocation, and meal planning.</p>
            </div>
            <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add New Room</span>
                  <span className="sm:hidden">New Room</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Hostel Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="roomId">Room No.</Label>
                    <Input id="roomId" value={newRoomData.id} onChange={(e) => setNewRoomData({...newRoomData, id: e.target.value})} placeholder="e.g., D-101" />
                  </div>
                  <div>
                    <Label>Room Type</Label>
                    <Select value={newRoomData.type} onValueChange={(value) => setNewRoomData({...newRoomData, type: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="Non-AC">Non-AC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Select value={newRoomData.capacity} onValueChange={(value) => setNewRoomData({...newRoomData, capacity: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRoom}>Add Room</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="allocation">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="allocation" className="flex items-center gap-2 p-2 sm:p-3">
              <BedDouble className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Room Allocation</span>
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2 p-2 sm:p-3">
              <Utensils className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Meal Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Room Allocation</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Room No.</TableHead>
                        <TableHead className="min-w-[80px] hidden sm:table-cell">Type</TableHead>
                        <TableHead className="min-w-[100px]">Capacity</TableHead>
                        <TableHead className="min-w-[150px] hidden md:table-cell">Occupants</TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                        <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map(room => (
                        <TableRow key={room.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm md:text-base">{room.id}</p>
                              <div className="sm:hidden mt-1">
                                <Badge variant="outline" className="text-xs">{room.type}</Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm">{room.type}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{room.occupants.length} / {room.capacity}</span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm">{room.occupants.map(o => o.name).join(', ') || 'N/A'}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={room.status === 'Occupied' ? 'destructive' : room.status === 'Vacant' ? 'default' : 'secondary'}
                              className={`text-xs ${room.status === 'Occupied' ? 'bg-red-100 text-red-800' : room.status === 'Vacant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {room.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleManageClick(room)}>Manage</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Meal Plans Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Manage daily, weekly, or monthly meal plans for hostel residents.
                  Coming soon: detailed meal scheduling and dietary preferences.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Manage Room Dialog */}
      <Dialog open={isManageRoomDialogOpen} onOpenChange={setIsManageRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Room</DialogTitle>
            {selectedRoom && <DialogDescription>Details for Room {selectedRoom.id}</DialogDescription>}
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4 py-4">
              <p><strong>Occupants:</strong> {selectedRoom.occupants.map(o => `${o.name} (${o.id})`).join(', ') || 'None'}</p>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsManageRoomDialogOpen(false)}>Close</Button>
                {selectedRoom.occupants.length > 0 && (
                  <Button onClick={() => { setIsManageRoomDialogOpen(false); setShowIdCardDialog(true); }}>Generate ID Cards</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Generate ID Card Dialog */}
      <Dialog open={showIdCardDialog} onOpenChange={setShowIdCardDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate ID Cards</DialogTitle></DialogHeader>
          <div className="py-4 text-center">
            <p>ID Card generation for occupants of room {selectedRoom?.id}.</p>
            <div className="mt-4 flex flex-col items-center gap-4">
              {selectedRoom?.occupants.map(o => (
                <div key={o.id} className="p-4 border rounded-lg w-64 shadow-md bg-white">
                  <div className="flex flex-col items-center">
                    <User className="w-12 h-12 text-slate-400 mb-2"/>
                    <p className="font-bold">{o.name}</p>
                    <p className="text-sm text-slate-600">{o.id}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-6">
                <Button variant="outline" onClick={() => setShowIdCardDialog(false)}>Cancel</Button>
                <Button onClick={() => alert('Printing ID cards...')}>Print</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

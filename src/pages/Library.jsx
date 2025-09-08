
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Plus, Crown, BookOpen, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialBooks = [
    { id: 'B001', title: 'Introduction to Physics', author: 'H.C. Verma', status: 'Available', issuedTo: null, dueDate: null },
    { id: 'B002', title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', status: 'Issued', issuedTo: 'S045', dueDate: '2024-08-15' },
    { id: 'B003', title: 'History of Modern India', author: 'Bipan Chandra', status: 'Available', issuedTo: null, dueDate: null },
    { id: 'B004', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', status: 'Overdue', issuedTo: 'S112', dueDate: '2024-07-20' },
];

export default function LibraryPage() {
  const [books, setBooks] = useState(initialBooks);
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [newBookData, setNewBookData] = useState({ title: '', author: '' });
  
  // State for manage dialog
  const [isManageBookDialogOpen, setIsManageBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleAddBook = () => {
    if (!newBookData.title || !newBookData.author) {
      alert("Title and Author are required.");
      return;
    }
    const newBook = {
      id: `B${(books.length + 1).toString().padStart(3, '0')}`,
      ...newBookData,
      status: 'Available',
      issuedTo: null,
      dueDate: null,
    };
    setBooks([...books, newBook]);
    setNewBookData({ title: '', author: '' });
    setIsAddBookDialogOpen(false);
  };
  
  const handleManageClick = (book) => {
    setSelectedBook(book);
    setIsManageBookDialogOpen(true);
  };
  
  const handleIssueReturn = (bookId, action) => {
      setBooks(books.map(book => {
          if (book.id === bookId) {
              if (action === 'issue') {
                  const studentId = prompt("Enter Student ID to issue to:");
                  if (studentId) {
                      return { ...book, status: 'Issued', issuedTo: studentId, dueDate: '2024-09-30' }; // Example due date
                  }
              } else if (action === 'return') {
                  return { ...book, status: 'Available', issuedTo: null, dueDate: null };
              }
          }
          return book;
      }));
      setIsManageBookDialogOpen(false);
  }

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                Library & Inventory
                <Badge className="bg-purple-100 text-purple-800">
                  <Crown className="w-3 h-3 mr-1" />
                  Standard
                </Badge>
              </h1>
              <p className="text-slate-600">Manage library books and school inventory.</p>
            </div>
            <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add New Book</span>
                  <span className="sm:hidden">New Book</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="bookTitle">Book Title</Label>
                    <Input id="bookTitle" value={newBookData.title} onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="bookAuthor">Author</Label>
                    <Input id="bookAuthor" value={newBookData.author} onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddBookDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddBook}>Add Book</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="books">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="books" className="flex items-center gap-2 p-2 sm:p-3">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Book Management</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2 p-2 sm:p-3">
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Issue/Return</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Book List</CardTitle>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Book ID</TableHead>
                        <TableHead className="min-w-[200px]">Title</TableHead>
                        <TableHead className="min-w-[150px] hidden sm:table-cell">Author</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[100px] hidden md:table-cell">Issued To</TableHead>
                        <TableHead className="min-w-[100px] hidden lg:table-cell">Due Date</TableHead>
                        <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map(book => (
                        <TableRow key={book.id}>
                          <TableCell>
                            <span className="text-sm font-mono">{book.id}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm md:text-base">{book.title}</p>
                              <div className="sm:hidden mt-1">
                                <p className="text-xs text-slate-500">{book.author}</p>
                                {book.issuedTo && <Badge variant="outline" className="text-xs mt-1">To: {book.issuedTo}</Badge>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-sm">{book.author}</span>
                          </TableCell>
                          <TableCell>
                              <Badge className={`text-xs ${
                                  book.status === 'Available' ? 'bg-green-100 text-green-800' :
                                  book.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                              }`}>{book.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm">{book.issuedTo || 'N/A'}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <span className="text-sm">{book.dueDate || 'N/A'}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleManageClick(book)}>Manage</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4 md:mt-6">
            <Card className="border-0 bg-white/80 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Issue & Return Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Manage book issuing and return processes. 
                  Coming soon: barcode scanning and automated due date reminders.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Manage Book Dialog */}
      <Dialog open={isManageBookDialogOpen} onOpenChange={setIsManageBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Book</DialogTitle>
            {selectedBook && <DialogDescription>Book: {selectedBook.title}</DialogDescription>}
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4 py-4">
              <p><strong>Status:</strong> {selectedBook.status}</p>
              {selectedBook.issuedTo && <p><strong>Issued To:</strong> {selectedBook.issuedTo}</p>}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsManageBookDialogOpen(false)}>Close</Button>
                {selectedBook.status === 'Available' && (
                    <Button onClick={() => handleIssueReturn(selectedBook.id, 'issue')}>Issue Book</Button>
                )}
                {selectedBook.status !== 'Available' && (
                    <Button onClick={() => handleIssueReturn(selectedBook.id, 'return')}>Return Book</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

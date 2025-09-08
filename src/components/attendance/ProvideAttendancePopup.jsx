
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { Attendance } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

const exportToCsv = (filename, rows) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvHeader = keys.join(separator);
    const csvContent = rows.map(row => {
        return keys.map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
            cell = cell.includes(separator) ? `"${cell}"` : cell;
            return cell;
        }).join(separator);
    }).join('\n');

    const blob = new Blob([csvHeader + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export default function ProvideAttendancePopup({ open, onOpenChange, role, classId, startDate, endDate, allStudents, allTeachers }) {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);

    const peopleList = useMemo(() => {
        if (role === 'student') {
            return allStudents.filter(s => s.class_id === classId);
        }
        if (role === 'teacher') {
            return allTeachers.filter(t => t.class_id === classId);
        }
        return [];
    }, [role, classId, allStudents, allTeachers]);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!classId || peopleList.length === 0) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const personIds = peopleList.map(p => p.id);
                // NOTE: This assumes the backend supports filtering by date range.
                // If not, all records would need to be fetched and filtered client-side.
                const attendanceData = await Attendance.filter({
                    student_id: { $in: personIds },
                    date: { $gte: startDate, $lte: endDate }
                });
                setRecords(attendanceData);
            } catch (error) {
                console.error("Error fetching attendance report data:", error);
            } finally {
                setLoading(false);
            }
        };

        if(open) {
            fetchAttendance();
        }
    }, [open, peopleList, classId, startDate, endDate]);

    const summaryData = useMemo(() => {
        return peopleList.map(person => {
            const personRecords = records.filter(r => r.student_id === person.id);
            const summary = personRecords.reduce((acc, record) => {
                acc[record.status] = (acc[record.status] || 0) + 1;
                return acc;
            }, { Present: 0, Absent: 0, Late: 0, Leave: 0 });
            
            const totalRecords = summary.Present + summary.Absent + summary.Late;
            const percentage = totalRecords > 0 ? ((summary.Present + summary.Late) / totalRecords * 100).toFixed(1) : 'N/A';

            return {
                id: person.id,
                name: person.name,
                roll_no: person.roll_no || person.employee_id,
                ...summary,
                percentage
            };
        });
    }, [peopleList, records]);

    const detailedData = useMemo(() => {
       return records.map(record => {
           const person = peopleList.find(p => p.id === record.student_id);
           return {
               name: person?.name,
               roll_no: person?.roll_no || person?.employee_id,
               date: record.date,
               status: record.status
           }
       }).filter(r => r.name); // Filter out records where person was not found
    }, [records, peopleList]);
    
    const handleExport = (formatType) => {
        const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('data-value');
        const data = activeTab === 'percentage' ? summaryData : detailedData;
        const filename = activeTab === 'percentage' ? `attendance_summary.${formatType}` : `attendance_details.${formatType}`;
        
        if (formatType === 'csv') {
            exportToCsv(filename, data);
        } else {
            alert(`${formatType.toUpperCase()} export is a premium feature.`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Attendance Report</DialogTitle>
                    <DialogDescription>
                        Viewing records from {format(new Date(startDate), "PPP")} to {format(new Date(endDate), "PPP")}.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="percentage" className="flex-grow flex flex-col overflow-hidden">
                    <div className="flex-shrink-0 flex justify-between items-center pr-2">
                        <TabsList>
                            <TabsTrigger value="percentage">Percentage View</TabsTrigger>
                            <TabsTrigger value="database">Database View</TabsTrigger>
                        </TabsList>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-grow overflow-auto mt-4">
                        <TabsContent value="percentage" className="m-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Roll No.</TableHead>
                                        <TableHead>Present</TableHead>
                                        <TableHead>Absent</TableHead>
                                        <TableHead>Late</TableHead>
                                        <TableHead>On Leave</TableHead>
                                        <TableHead>Attendance %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={7}><Skeleton className="h-6 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : summaryData.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.roll_no}</TableCell>
                                            <TableCell>{item.Present}</TableCell>
                                            <TableCell>{item.Absent}</TableCell>
                                            <TableCell>{item.Late}</TableCell>
                                            <TableCell>{item.Leave}</TableCell>
                                            <TableCell className="font-bold">{item.percentage}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                        <TabsContent value="database" className="m-0">
                             <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Roll No.</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                         Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : detailedData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.roll_no}</TableCell>
                                            <TableCell>{format(new Date(item.date), "PPP")}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

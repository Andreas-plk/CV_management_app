"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import {deleteUser} from "@/app/actions";

import { toast } from "sonner";

type Student = {
    id: string;
    email: string;
    name: string | null;
};

export default function StudentsTable({ initialStudents }: { initialStudents: Student[] }) {
    const [students, setStudents] = useState(initialStudents);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function handleDelete(id: string) {
        setLoadingId(id);
        try {
            await deleteUser(id);
            setStudents((prev) => prev.filter((s) => s.id !== id));
            toast.success("Ο χρήστης διαγράφηκε επιτυχώς");
        } catch (err) {
            console.error(err);
            toast.error("Σφάλμα στη διαγραφή");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Διαγραφή</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="destructive"
                                className="cursor-pointer rounded-full bg-red-800 hover:bg-red-600 hover:scale-102"
                                size="sm"
                                disabled={loadingId === student.id}
                                onClick={() => handleDelete(student.id)}
                            >
                                {loadingId === student.id ? "Διαγραφή..." : <Trash className="h-4 w-4" />}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

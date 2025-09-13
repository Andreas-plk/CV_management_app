"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {createCVS} from "@/app/actions";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import {toast} from "sonner";
import { FaFileUpload } from "react-icons/fa";

type Props = {
    userId: string;
};

export default function CVForm({ userId }: Props) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    function toggleCategory(cat: string) {
        setCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        if (userId!=="")
        {
            fd.set("userId", userId);
        }

        categories.forEach((c) => fd.append("categories", c));

        try {
            // throw Error("Είσαι στόκος 4ο4");
            setLoading(true);
            await createCVS(fd);
            toast.success("Το CV ανέβηκε επιτυχώς!");
            form.reset();
            setCategories([]);
        } catch (err: any) {
            toast.warning("Σφάλμα: " + (err.message || "Αποτυχία upload"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 p-4 border rounded shadow-lg shadow-primary/70">
            <div>
                <Label htmlFor="name">Όνομα βιογραφικού</Label>
                <Input id="name" name="name" required className="mt-2" />
            </div>

            <div>
                <Label htmlFor="file">Αρχείο (PDF)</Label>
                <Input id="file" name="file" type="file" accept="application/pdf" required className="mt-2 cursor-pointer" />
            </div>

            <div>
                <Label>Κατηγορίες (έως 5)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {CATEGORY_OPTIONS.map((c) => (
                        <label key={c.value} className="flex items-center space-x-2">
                            <Checkbox
                                className="cursor-pointer"
                                checked={categories.includes(c.value)}
                                onCheckedChange={() => toggleCategory(c.value)}
                            />
                            <span>{c.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                {loading ? "Ανέβασμα..." : "Ανέβασμα βιογραφικού"}
                <FaFileUpload/>
            </Button>
        </form>
    );
}

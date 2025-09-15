"use client";

import {useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {createCVS, updateCVS} from "@/app/actions";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import {toast} from "sonner";
import { FaFileUpload } from "react-icons/fa";
import {cv} from "@/lib/types";
import { useRouter} from "next/navigation";


type Props = {
    userId: string;
    cv?:cv|null
};

export default function CVForm({ userId,cv=null }: Props) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();

    function toggleCategory(cat: string) {
        setCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    }
    useEffect(() => {
        if(cv) {
            setCategories(cv?.categories)
        }
    },[])



    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if(cv===null) {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            if (userId !== "") {
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
        }else{
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            if (userId !== "") {
                fd.set("userId", userId);
            }
            fd.set("id",cv.id)

            categories.forEach((c) => fd.append("categories", c));

            try {
                // throw Error("Είσαι στόκος 4ο4");
                setLoading(true);
                await updateCVS(fd);
                toast.success("Το CV ενημερώθηκε επιτυχώς!");
                form.reset();
                setCategories([]);
                router.push("/edit")
            } catch (err: any) {
                toast.warning("Σφάλμα: " + (err.message || "Αποτυχία upload"));
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 p-4 border rounded shadow-xl shadow-primary/40">
            <div>
                <Label htmlFor="name">Όνομα βιογραφικού (στα αγγλικά)</Label>
                <Input id="name" name="name" required className="mt-2" defaultValue={cv? cv.name:""} />
            </div>

            <div>
                <Label htmlFor="file">Αρχείο (PDF)</Label>
                <Input id="file"
                       name="file"
                       type="file"
                       accept="application/pdf"
                       className="mt-2 cursor-pointer"
                        />
                {cv && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Υπάρχει ήδη ανεβασμένο αρχείο. Αν δεν επιλέξεις καινούργιο, το
                        παλιό θα μείνει.
                    </p>
                )}
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
                {loading ? "Μιλάω με βάση..." :cv? "Ενημέρωση βιογραφικού":"Ανέβασμα βιογραφικού"}
                <FaFileUpload/>
            </Button>
        </form>
    );
}

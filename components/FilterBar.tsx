"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function FilterBar() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    function toggleCategory(cat: string) {
        setSelected((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    }

    function applyFilter() {
        const query = selected.map((c) => `cat=${c}`).join("&");
        startTransition(() => {
            router.push(`/dashboard?${query}`);
        });
    }

    return (
        <div className="border rounded p-4 space-y-2">
            <h3 className="font-semibold">Φίλτρο ανά κατηγορία</h3>
            <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                    <label key={c.value} className="flex items-center space-x-2">
                        <Checkbox
                            checked={selected.includes(c.value)}
                            onCheckedChange={() => toggleCategory(c.value)}
                        />
                        <span>{c.label}</span>
                    </label>
                ))}
            </div>
            <button
                type="button"
                onClick={applyFilter}
                disabled={isPending}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
                {isPending ? "Φόρτωση..." : "Εφαρμογή"}
            </button>
        </div>
    );
}

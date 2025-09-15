"use client";

import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import {cv} from '@/lib/types'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {User} from "@prisma/client";
import BioCard from "@/components/bioCard";



export default function CVList({ cvs,user }: { cvs: cv[],user:User|null }) {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        setSelected((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const filtered =
        selected.length === 0
            ? cvs
            : cvs.filter((cv) =>
                cv.categories.some((cat: string) => selected.includes(cat))
            );


    return (
        <div className="space-y-6">
            <div className="border  p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Φίλτρο κατηγοριών</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 ">
                    {CATEGORY_OPTIONS.map((c) => {
                        const isActive = selected.includes(c.value);
                        return (
                            <Button
                                key={c.value}
                                onClick={() => toggleCategory(c.value)}
                                className={`flex-shrink-0
                                    px-3 py-1 sm:px-5 sm:py-2 md:px-6 md:py-3
                                    text-sm  md:text-base
                                    rounded-2xl transition-colors cursor-pointer ${
                                    isActive
                                        ? "bg-primary"
                                        : "bg-card hover:bg-primary/30"
                                }`}

                            >
                                {c.label}
                            </Button>
                        );
                    })}

                    </div>
            </div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold ">Βιογραφικά</h1>
                {user ? (<Button asChild><Link href="/upload">Upload<FaFileUpload/></Link></Button>):(<></>)}
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500 italic">Δεν υπάρχουν βιογραφικά.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((cv,idx) => (
                        <BioCard key={idx} cv={cv}/>
                    ))}

                </div>
            )}
        </div>
    );
}

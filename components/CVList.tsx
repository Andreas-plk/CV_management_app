"use client";

import { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {cv} from '@/lib/types'
import {Button} from "@/components/ui/button";
import Link from "next/link";



export default function CVList({ cvs }: { cvs: cv[] }) {
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
                <Button asChild><Link href="/">Upload<FaFileUpload/></Link></Button>
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500 italic">Δεν υπάρχουν βιογραφικά.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((cv) => (
                        <Card key={cv.id} className="ring-primary/50 ring">
                            <CardHeader>
                                <CardTitle>{cv.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    <strong>Κατηγορίες:</strong>{" "}
                                    {cv.categories?.join(" • ") || "—"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(cv.createdAt).toLocaleDateString("el-GR")}
                                </p>
                                <Button asChild variant="default" className="mt-2">
                                    <a href={`/api/cv/${cv.id}`} target="_blank">
                                        Προβολή Βιογραφικού
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            )}


        </div>
    );
}

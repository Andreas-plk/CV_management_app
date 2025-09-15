'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CATEGORY_MAP} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import {cv} from "@/lib/types";
import Link from "next/link";
import {acceptCVS} from "@/app/actions";
import {useState} from "react";
import {toast} from "sonner";

const BioCard = ({cv,role=""}:{cv:cv,role?:string}) => {
    const [loading, setLoading] = useState(false);
    return (
        <Card key={cv.id} className="ring-primary/50 ring">
            <CardHeader>
                <CardTitle>{cv.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    <strong>Κατηγορίες:</strong>{" "}
                    {cv.categories?.map(cat=>CATEGORY_MAP[cat]||cat).join(" • ") || "—"}
                </p>
                <p className="text-sm text-gray-500">
                    {new Date(cv.createdAt).toLocaleDateString("el-GR")}
                </p>
                <div className="flex justify-between">
                <Button asChild variant="default" className="mt-2">
                    <Link href={`/api/cv/${cv.id}`} target="_blank">
                        Προβολή Βιογραφικού
                    </Link>
                </Button>
                    <p></p>
                    <p></p>
                    <p></p>
                {!cv.accepted && role==="ADMIN" ? (<>
                    <Button onClick={async ()=>{
                        setLoading(true)
                        const res=await acceptCVS(cv.id,true)
                        setLoading(false)
                        toast.success(res);

                    }} variant="default" className="mt-2 cursor-pointer">
                        {loading ? "Φόρτωση..." : "Αποδοχή"}
                    </Button>
                    <Button onClick={async ()=>{
                        setLoading(true)
                        const res=await acceptCVS(cv.id,false)
                        setLoading(false)
                        toast.success(res);

                    }} variant="default"  className="mt-2 cursor-pointer rounded-full bg-red-800 hover:bg-red-600 hover:scale-102">
                        {loading ? "..." : "X"}
                    </Button></>
                ):role==="STUDENT"?(
                    <>
                        <Button asChild className="mt-2">
                            <Link href={`/edit/${cv.id}`} >
                                επεξεργασία
                            </Link>
                        </Button>
                        <Button onClick={async ()=>{
                            setLoading(true)
                            const res=await acceptCVS(cv.id,false)
                            setLoading(false)
                            toast.success(res);

                        }} variant="default"  className="mt-2 cursor-pointer rounded-full bg-red-800 hover:bg-red-600 hover:scale-102">
                            {loading ? "..." : "X"}
                        </Button></>
                ):(<></>)}


                </div>
            </CardContent>
        </Card>
    )
}
export default BioCard

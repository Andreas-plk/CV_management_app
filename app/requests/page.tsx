import {getCVS} from "@/app/actions";
import BioCard from "@/components/bioCard";
import {getSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {User} from "@prisma/client";

const Page = async () => {
    const cvs = await getCVS(true);
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user?.role   !== "ADMIN")
    {
        redirect("/dashboard");
    }
    return (
        <div className="space-y-6 p-6">

                {cvs.length === 0 ? (<p className="text-gray-500 italic">Δεν υπάρχουν βιογραφικά για έγκριση.</p>):
                (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cvs.map((cv,idx) => (
                    <BioCard key={idx} cv={cv} role={user.role} />
                ))}
                </div>)}


        </div>
    )
}
export default Page

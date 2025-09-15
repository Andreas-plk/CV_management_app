
import { getCVSbyId} from "@/app/actions";
import {getSession} from "@/lib/session";
import {User} from "@prisma/client";
import {redirect} from "next/navigation";
import BioCard from "@/components/bioCard";

const Page = async () =>
    {

        const session = await getSession();
        const user = session?.user as User;
        if (!user || user?.role   !== "STUDENT")
            {
                redirect("/dashboard");
            }
        const cvs = await getCVSbyId(user.id);
            return (
                <div className="space-y-6 p-6">

                    {cvs.length === 0 ? (<p className="text-gray-500 italic">Δεν υπάρχουν βιογραφικά.</p>):
                        (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {cvs.map((cv,idx) => (
                                <BioCard key={idx} cv={cv} role={user.role} />
                            ))}
                        </div>)}


                </div>
            )
}

export default Page

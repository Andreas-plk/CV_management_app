
import {getCVS} from "@/app/actions";
import CVList from "@/components/CVList";
import {getSession} from "@/lib/session";
import {User} from "@prisma/client";
export default async function DashboardPage() {
    const cvs = await getCVS(false);
    const session = await getSession();
    const user = session?.user as User;
    return (

        <div className="p-6 space-y-6">
            <CVList cvs={cvs} user={user ?? null} />
        </div>
    );
}


import {getCVS} from "@/app/actions";
import CVList from "@/components/CVList";
import {getSession} from "@/lib/session";
export default async function DashboardPage() {
    const cvs = await getCVS();
    const session = await getSession();

    return (

        <div className="p-6 space-y-6">
            {session?(<p>hello from session</p>):(<p>no session</p>)}
            <CVList cvs={cvs} />
        </div>
    );
}

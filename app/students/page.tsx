import { getStudents} from "@/app/actions";
import {getSession} from "@/lib/session";
import {User} from "@prisma/client";
import {redirect} from "next/navigation";
import StudentsTable from "@/components/StudentsTable";

const Page = async () => {
    const students = await getStudents();
    const session = await getSession();
    const user = session?.user as User;
    if (!user || user?.role   !== "ADMIN")
    {
        redirect("/dashboard");
    }
    return (
        <div className="space-y-6 p-10 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Μαθητές</h1>
            <div className="w-1/2">
                <StudentsTable initialStudents={students} />
            </div>

        </div>
    )
}
export default Page

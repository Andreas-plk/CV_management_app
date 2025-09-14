import CVForm from "@/components/CVForm";
import {getSession} from "@/lib/session";
import {User} from "@prisma/client";
import {redirect} from "next/navigation";


const Page = async () => {
    const session = await getSession();
    const user= session?.user as User;
    if (!user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex items-center justify-center w-full h-full p-10">
            <CVForm userId={user.role!=="ADMIN"? user.id : ""} />

        </div>
    )
}
export default Page

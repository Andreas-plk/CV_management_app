import CVForm from "@/components/CVForm";
import {getSession} from "@/lib/session";
import {User} from "@prisma/client";
import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";


const Page = async ({ params }: { params: { id: string } }) => {
    const session = await getSession();
    const {id}=await params;
    const user= session?.user as User;
    if (!user) {
        redirect("/dashboard");
    }
    const cv = await prisma.cV.findFirst({
        where: { id },
    });
    return (
        <div className="flex items-center justify-center w-full h-full p-10">
            <CVForm userId={user.role!=="ADMIN"? user.id : ""} cv={cv} />

        </div>
    )
}
export default Page

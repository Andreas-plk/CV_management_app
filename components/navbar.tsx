import Link from "next/link";
import { Button } from "./ui/button";
import {getSession} from "@/lib/session";
import {logout} from "@/app/actions";
import {User} from "@prisma/client";

const Navbar = async () => {
    const session = await getSession();
    const user = session?.user as User;
    return (
        <div className="p-6 border-b rounded-bl-2xl shadow-md shadow-primary/70">
            <nav className="flex items-center justify-between">
                {/* Αριστερά */}
                <h1 className="text-2xl font-bold">
                    <Link href="/dashboard">BioFind</Link>
                </h1>
               <Link className="text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white
                after:rotate-2 after:transition-all after:duration-300 hover:after:w-full" href="/dashboard">Πίνακας</Link>
                {user && user?.role==="ADMIN" ?
                    (<Link className="text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white
                after:rotate-2 after:transition-all after:duration-300 hover:after:w-full" href="/requests">Αιτήματα</Link>):
                    (<p></p>)}

                <p></p>

                {/* Δεξιά */}
                <div className="flex items-center space-x-4">
                    {session ?(<Button className="cursor-pointer" onClick={logout}>Logout</Button>)
                    :<>
                        <Button asChild variant="outline">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild >
                        <Link href="/signUp">Signup</Link>
                    </Button></>}
                </div>
            </nav>
        </div>
    )
}
export default Navbar

import React from 'react'
import Link from "next/link";
import { Button } from "./ui/button";
import {getSession} from "@/lib/session";
import {logout} from "@/app/actions";

const Navbar = async () => {
    const session = await getSession();
    return (
        <div className="p-6 border-b rounded-bl-2xl shadow-md shadow-primary/70">
            <nav className="flex items-center justify-between">
                {/* Αριστερά */}
                <h1 className="text-2xl font-bold">
                    <Link href="/dashboard">BioFind</Link>
                </h1>

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

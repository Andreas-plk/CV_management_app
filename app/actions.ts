'use server';

import prisma from "@/lib/prisma";
import {Category} from "@prisma/client"
import {redirect} from "next/navigation";
import {createSession, deleteSession} from "@/lib/session";



export async function getCVS() {
    try {
        return await prisma.cV.findMany({
            select: {
                id: true,
                name: true,
                categories: true,
                createdAt: true,
            },
        });
    }catch (error) {
        console.error(error);
        return []
    }
}


export async function createCVS(formData: FormData) {
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string | null;
    const file = formData.get("file") as File;

    if (!name  || !file) {
        throw new Error("Λείπουν πεδία (name, userId, file)");
    }
    if (file.type !== "application/pdf") {
        throw new Error("Μόνο PDF αρχεία επιτρέπονται");
    }

    const categoryStrings = formData.getAll("categories") as string[];
    const categories: Category[] = categoryStrings
        .map((c) => {
            if (Object.values(Category).includes(c as Category)) {
                return c as Category;
            }
            throw new Error(`Μη έγκυρη κατηγορία: ${c}`);
        });

    if (categories.length > 5) {
        throw new Error("Ένα CV μπορεί να έχει μέχρι 5 κατηγορίες");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data: any = {
        name,
        file: buffer,
        categories,
    };

    if (userId) {
        data.user = { connect: { id: userId } };
    }

    return await prisma.cV.create({ data });
}

export async function createUser(formData: FormData) {
    const bcrypt= require("bcrypt");
    const email = formData.get("email") as string;
    const password =formData.get("password") as string
    const repeatPassword = formData.get("repeatPassword") as string

    if (password !== repeatPassword) {
        throw new Error("Παρακαλώ εισάγετε σωστά τους κωδικούς")
    }

    bcrypt.hash(password,12,async function(err:Error, hash:string){
        if (err) throw err;
        const data:any={
            email,
            password: hash,
        }
        return await prisma.user.create({data});
    } );
}

export async function getUser(formData: FormData) {

    const email = formData.get("email") as string;
    const password =formData.get("password") as string

        const user= await prisma.user.findUnique({
            where: { email }
        });
        if (user===null) {
            throw new Error("Δεν βρέθηκε χρήστης.");
        }

        const bcrypt= require("bcrypt");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Λάθος κωδικός");
        }

        await createSession(user.id,user.email)
        redirect("/dashboard")

}

export async function logout() {
    await deleteSession()
    redirect('/dashboard')
}
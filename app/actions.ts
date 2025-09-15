'use server';

import prisma from "@/lib/prisma";
import {Category} from "@prisma/client"
import {redirect} from "next/navigation";
import {createSession, deleteSession} from "@/lib/session";
import {revalidatePath} from "next/cache";





export async function getCVS(pending:boolean) {
    try {
        return await prisma.cV.findMany({
            where:{
                accepted:!pending,
            },
            select: {
                id: true,
                name: true,
                categories: true,
                createdAt: true,
                accepted: true
            },
            orderBy:{
                createdAt:"desc"
            }
        });
    }catch (error) {
        console.error(error);
        return []
    }
}

export async function getCVSbyId(id:string) {
    try {
        return await prisma.cV.findMany({
            where:{
                userId:id
            },
            select: {
                id: true,
                name: true,
                categories: true,
                createdAt: true,
                accepted: true
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
        accepted: false,
    };

    if (userId) {
        data.user = { connect: { id: userId } };
    }

    return await prisma.cV.create({ data });
}

export async function updateCVS(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string | null;
    const file = formData.get("file") as File;

    if (!name) {
        throw new Error("Λείπουν πεδία (name)");
    }
    if (file && file.size>0) {
        if(file.type !== "application/pdf"){
        throw new Error("Μόνο PDF αρχεία επιτρέπονται");
        }
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



    const data: any = {
        name,
        categories,
    };
    if(file && file.size>0) {
        const arrayBuffer = await file.arrayBuffer();
        data.file= Buffer.from(arrayBuffer);
    }

    if (userId) {
        data.user = { connect: { id: userId } };

    }
    return await prisma.cV.update({where:{
            id
        } ,data });

}


export async function acceptCVS(id: string,accepted: boolean) {
    if (accepted) {
        await prisma.cV.update({
            where:{
                id
            },
            data: {
                accepted: true,
            }
        })
        revalidatePath("/requests")
        return "Επιτυχές"
    }
    await prisma.cV.delete({ where:{id} });
    revalidatePath("/requests")
    return "Διαγραφή επιτυχής"

}

export async function createUser(formData: FormData) {
    const bcrypt= require("bcrypt");
    const email = formData.get("email") as string;
    const password =formData.get("password") as string
    const repeatPassword = formData.get("repeatPassword") as string

    if (password !== repeatPassword) {
        throw new Error("Παρακαλώ εισάγετε σωστά τους κωδικούς")
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hash,
            role: "STUDENT",
        },
    });

    await createSession(user.id, user.email, user.role);

    redirect("/dashboard");
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

        await createSession(user.id,user.email,user.role)
        redirect("/dashboard")

}

export async function getStudents() {
    return prisma.user.findMany({
        where:{role:"STUDENT"},
        select: {
            id: true,
            email: true,
            name: true,
        },
    })

}
export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id },
    });
    revalidatePath("/students");
}
export async function logout() {
    await deleteSession()
    redirect('/dashboard')
}
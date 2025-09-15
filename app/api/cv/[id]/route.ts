// app/api/cv/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const {id} = await params;
    try {
        const cv = await prisma.cV.findUnique({
            where: {id },
        });

        if (!cv || !cv.file) {
            return new NextResponse("Not found", { status: 404 });
        }
        const uint8 = new Uint8Array(cv.file);
        return new NextResponse(uint8.buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${cv.name}.pdf"`,
            },
        });
    } catch (err) {
        console.error(err);
        return new NextResponse("Server error", { status: 500 });
    }
}

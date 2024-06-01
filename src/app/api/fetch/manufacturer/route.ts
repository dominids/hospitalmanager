import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import ManufacturerNames from "../../../../../models/manufacturersNames";

export async function GET() {
    try {
        await connectMongoDB();
        const manufacturerNames = await ManufacturerNames.find();
        return NextResponse.json({ manufacturerNames });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}
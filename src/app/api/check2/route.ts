import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ProviderNamesSchema from "../../../../models/providerNames";

export async function POST(req) {
    const { name } = await req.json();
    try {
        await connectMongoDB();
        const ProviderNames = await ProviderNamesSchema.findOne({ name }).select("_id");
        console.log(`Registered`);
        return NextResponse.json({ ProviderNames });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import ProviderNamesSchema from "../../../../models/providerNames";

export async function GET() {
    try {
        await connectMongoDB();
        const providerNames = await ProviderNamesSchema.find().sort({"name": "asc"});;
        console.log(providerNames);
        return NextResponse.json({ providerNames }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Error occured while fetching the data" }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const { name, email, phoneNumber, address } = await req.json();

        await connectMongoDB();
        await ProviderNamesSchema.create({ name, email, phoneNumber, address })

        return NextResponse.json({ message: `${name} registered in category` }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error occured while registering" }, { status: 500 });
    }
}
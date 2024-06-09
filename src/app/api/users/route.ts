import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function GET() {
    try {
        await connectMongoDB();
        const users = await User.find().sort({ name: "asc" });
        console.log(users);
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error occurred while fetching the data" }, { status: 500 });
    }
}

import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../../models/user";

export async function GET(req: NextRequest, { params }) {
    const { id } = params;
    console.log(`Request received: Method - GET, ID - ${id}`);
    try {
        await connectMongoDB();
        const user = await User.findById(id);
        console.log(user);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return NextResponse.json({ message: "Error occurred while fetching the user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }) {
    const { id } = params;
    console.log(`Request received: Method - DELETE, ID - ${id}`);
    await connectMongoDB();

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        return NextResponse.json({ message: "Error occurred while deleting the user" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }) {
    const { id } = params;
    const data = await req.json();
    console.log(`Request received: Method - PUT, ID - ${id}`);
    await connectMongoDB();

    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error.message);
        return NextResponse.json({ message: "Error occurred while updating the user" }, { status: 500 });
    }
}

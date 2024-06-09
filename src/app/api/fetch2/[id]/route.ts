import { connectMongoDB } from "../../../../../lib/mongodb";
import ApplianceNames from "../../../../../models/applianceNames";
import EventNames from "../../../../../models/eventNames";
import LocationNames from "../../../../../models/locationNames";
import ManufacturerNames from "../../../../../models/manufacturersNames";
import { NextRequest, NextResponse } from "next/server";
import ProviderNamesSchema from "../../../../../models/providerNames";

export async function DELETE(req: NextRequest, { params }) {
    const {id} = params;
    console.log(`Request received: Method - DELETE, ID - ${id}`);
    await connectMongoDB();

    try {
        const deletedItem = await ProviderNamesSchema.findByIdAndDelete(id);
        if (!deletedItem) {
            NextResponse.json({ message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        NextResponse.json({ message: error.message }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, { params }) {
    const { category, id } = params;
    const { name, email, phoneNumber, address } = await req.json();

    console.log(`Request received: Method - PUT, Category - ${category}, ID - ${id}, Name - ${name}`);

    await connectMongoDB();

    try {

        const updatedItem = await ProviderNamesSchema.findByIdAndUpdate(id, { name, email, phoneNumber, address });
        if (!updatedItem) {
            return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
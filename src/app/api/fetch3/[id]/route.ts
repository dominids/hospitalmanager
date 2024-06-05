import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Appliance from "../../../../../models/appliance";


export async function GET(req: NextRequest, { params }) {
    const {id} = params;
    console.log(`Request received: Method - GET, ID - ${id}`);
    try {
        await connectMongoDB();
        const appliance = await Appliance.find().select('-appliance -inventoryNumber -model -event -__v -notes');
        console.log(appliance);
        return NextResponse.json({ appliance }, { status: 201 });

    } catch (error) {
        console.error("Error fetching appliances:", error.message);
        console.error("Error stack:", error.stack);
        throw error;
    }
}

export async function DELETE(req: NextRequest, { params }) {
    const {id} = params;
    console.log(`Request received: Method - DELETE, ID - ${id}`);
    await connectMongoDB();

    try {
        const deletedItem = await Appliance.findByIdAndDelete(id);
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
    const { appliance, inventoryNumber, model } = await req.json();

    console.log(`Request received: Method - PUT, Category - ${category}, ID - ${id}, Name - ${name}`);

    await connectMongoDB();

    try {

        const updatedItem = await Appliance.findByIdAndUpdate(id, { appliance: appliance, inventoryNumber: parseFloat(inventoryNumber), model: model });
        if (!updatedItem) {
            return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
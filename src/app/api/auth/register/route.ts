import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, schoolName, phoneNumber } = body;

        const supabase = await createClient();
        
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    school_name: schoolName,
                    phone_number: phoneNumber,
                }
            }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Register successful" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
}
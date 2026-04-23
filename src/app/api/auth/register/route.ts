import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { translateAuthError } from "@/utils/error-mapping";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, schoolName, phoneNumber } = body;

        const supabaseServer = await createServerClient();
        
        const { data: authData, error } = await supabaseServer.auth.signUp({
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
            return NextResponse.json({ error: translateAuthError(error.message) }, { status: 400 });
        }

        // Insert into public.users directly using service role key
        if (authData?.user?.id) {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            await supabaseAdmin.from('users').upsert({
                id: authData.user.id,
                full_name: fullName,
                school_name: schoolName,
                phone_number: phoneNumber
            }, { onConflict: 'id' });
        }

        return NextResponse.json({ message: "Register successful" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." }, { status: 400 });
    }
}
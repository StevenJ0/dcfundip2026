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
            console.error('[Register] Sign up error:', error.message);
            console.log('DEBUG: Raw error object:', JSON.stringify(error, null, 2));
            return NextResponse.json({ error: translateAuthError(error.message) }, { status: 400 });
        }
        if (authData?.user?.id) {
            try {
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );
                const { error: upsertError } = await supabaseAdmin.from('users').upsert({
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    school_name: schoolName,
                    phone_number: phoneNumber
                }, { onConflict: 'id' });

                if (upsertError) {
                    // Profile sync failed but auth already succeeded — log only.
                    console.error('[Register] Profile upsert error:', upsertError.message);
                }
            } catch (upsertException) {
                // Catches misconfigured env vars or network errors on the admin client.
                // Do NOT rethrow — auth signup succeeded, return 200 to the client.
                console.error('[Register] Profile upsert exception:', upsertException);
            }
        }

        return NextResponse.json({ message: "Register successful" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." }, { status: 400 });
    }
}
"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email/send"
import { InviteTeamMemberEmail } from "@/emails/InviteTeamMemberEmail"
import React from "react"

const ROLE_DISPLAY: Record<string, string> = {
  dentist: "Dentista",
  receptionist: "Recepcionista",
  clinic_owner: "Administrador",
  super_admin: "Super Admin",
}

export async function inviteMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Não autorizado" }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("owner_id", user.id)
    .single()

  if (!clinic) return { error: "Clínica não encontrada" }

  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const email = (formData.get("email") as string).trim().toLowerCase()
  const role = (formData.get("role") as string) as "super_admin" | "clinic_owner" | "dentist" | "receptionist" | "patient"
  const inviteeName = (formData.get("name") as string | null)?.trim() || email.split("@")[0]

  if (!email) return { error: "Email é obrigatório" }

  const admin = createAdminClient()
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users.find((u) => u.email === email)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://naviclean.vercel.app"
  const inviterName = (inviterProfile?.full_name as string | null) ?? user.email ?? "Administrador"
  const clinicName = clinic.name as string

  if (existingUser) {
    const { data: existing } = await supabase
      .from("clinic_members")
      .select("id")
      .eq("clinic_id", clinic.id)
      .eq("user_id", existingUser.id)
      .single()

    if (existing) return { error: "Este usuário já é membro da clínica" }

    const { error } = await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: existingUser.id,
      role,
    })
    if (error) return { error: error.message }

    // Notify existing user
    try {
      await sendEmail({
        to: email,
        subject: `Você foi adicionado à equipe de ${clinicName} no NaviClin`,
        react: React.createElement(InviteTeamMemberEmail, {
          inviteeName,
          clinicName,
          inviterName,
          inviteUrl: `${appUrl}/dashboard`,
          role: ROLE_DISPLAY[role] ?? role,
        }),
      })
    } catch (err) {
      console.error("Invite email failed:", err)
    }
  } else {
    // Generate invite link via Supabase Admin
    const { data: inviteData, error: inviteError } = await admin.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        data: { role, clinic_id: clinic.id },
        redirectTo: `${appUrl}/onboarding`,
      },
    })

    if (inviteError) return { error: inviteError.message }

    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: { role },
    })
    if (createError && createError.message !== "User already registered") {
      return { error: createError.message }
    }

    const userId = newUser?.user?.id ?? existingUsers?.users.find((u) => u.email === email)?.id
    if (!userId) return { error: "Erro ao criar usuário" }

    const { error } = await supabase.from("clinic_members").insert({
      clinic_id: clinic.id,
      user_id: userId,
      role,
    })
    if (error) return { error: error.message }

    const inviteUrl = inviteData?.properties?.action_link ?? `${appUrl}/login`

    try {
      await sendEmail({
        to: email,
        subject: `Convite para equipe: ${clinicName} no NaviClin`,
        react: React.createElement(InviteTeamMemberEmail, {
          inviteeName,
          clinicName,
          inviterName,
          inviteUrl,
          role: ROLE_DISPLAY[role] ?? role,
        }),
      })
    } catch (err) {
      console.error("Invite email failed:", err)
    }
  }

  revalidatePath("/equipe")
  return { success: true }
}

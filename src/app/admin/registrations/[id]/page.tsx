import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RegistrationDetail } from "./RegistrationDetail";
import type { Registration } from "@/lib/types";

export const metadata: Metadata = {
  title: "Registration · Admin — Khinext '26",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function RegistrationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin");

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", params.id)
    .single<Registration>();

  if (error || !data) notFound();

  return <RegistrationDetail initial={data} />;
}

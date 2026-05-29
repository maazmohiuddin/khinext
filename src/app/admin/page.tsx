import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { PageHero } from "@/components/ui/PageHero";
import type { CardShare, Registration, Submission } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Dashboard — Khinext '26",
  robots: { index: false },
};

// Always render fresh data on every request — never cache.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Verify the user is in the admins whitelist (defense-in-depth on top of RLS).
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return (
      <>
        <PageHero eyebrow="Access Denied" title={<>Not an <span className="kx-accent">admin.</span></>}>
          Signed in as <strong className="text-white">{user.email}</strong>, but this email isn't in the admins whitelist.
          Have an existing admin add it via Supabase Studio.
        </PageHero>
        <section className="kx-section">
          <form action="/api/admin/signout" method="post" className="text-center">
            <button className="kx-btn-outline" type="submit">Sign out</button>
          </form>
        </section>
      </>
    );
  }

  const svc = createServiceClient();
  const [subsRes, regsRes, cardsRes] = await Promise.all([
    supabase.from("submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("registrations").select("*").order("created_at", { ascending: false }),
    svc.from("card_shares").select("id, slug, name, template, designation, created_at").order("created_at", { ascending: false }),
  ]);

  const submissions = (subsRes.data ?? []) as Submission[];
  const registrations = (regsRes.data ?? []) as Registration[];
  const cardShares = (cardsRes.data ?? []) as CardShare[];

  return (
    <AdminDashboard
      adminEmail={user.email ?? ""}
      initialSubmissions={submissions}
      initialRegistrations={registrations}
      initialCardShares={cardShares}
    />
  );
}

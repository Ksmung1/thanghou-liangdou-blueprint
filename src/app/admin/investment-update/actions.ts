"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "../../../../lib/admin-auth";
import { validateInvestmentInput } from "../../../../lib/investments";
import { getSupabaseAdminClient } from "../../../../lib/supabase";

export async function loginAdmin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");

  if (!(await verifyAdminPassword(password))) {
    redirect("/admin/investment-update?error=Invalid%20password");
  }

  await createAdminSession();
  redirect("/admin/investment-update");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/investment-update");
}

export async function updateInvestment(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/investment-update?error=Admin%20session%20required");
  }

  const { data, error } = validateInvestmentInput({
    projectId: String(formData.get("projectId") ?? ""),
    investorName: String(formData.get("investorName") ?? ""),
    amountLakh: Number(formData.get("amountLakh") ?? 0),
  });

  if (!data) {
    redirect(
      `/admin/investment-update?error=${encodeURIComponent(
        error ?? "Invalid investment data",
      )}`,
    );
  }

  const supabase = getSupabaseAdminClient();

  const { error: upsertError } = await supabase
    .from("investment_contributions")
    .upsert(
      {
        project_id: data.projectId,
        investor_name: data.investorName,
        amount_lakh: data.amountLakh,
      },
      {
        onConflict: "project_id,investor_name",
      },
    );

  if (upsertError) {
    redirect(
      `/admin/investment-update?error=${encodeURIComponent(upsertError.message)}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/investment-update");
  redirect("/admin/investment-update?success=Investment%20updated");
}

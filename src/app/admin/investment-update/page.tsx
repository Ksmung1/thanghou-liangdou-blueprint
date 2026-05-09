import Link from "next/link";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import {
  buildInvestmentProjects,
  INVESTMENT_SCHEMA_SETUP_MESSAGE,
  isMissingInvestmentSchemaError,
  type InvestmentProject,
} from "../../../../lib/investments";
import { getSupabaseServerClient } from "../../../../lib/supabase";
import { loginAdmin, logoutAdmin, updateInvestment } from "./actions";

export const dynamic = "force-dynamic";

async function getAdminInvestmentData(): Promise<{
  projects: InvestmentProject[];
  error: string | null;
}> {
  try {
    const supabase = getSupabaseServerClient();
    const [projectResult, contributionResult] = await Promise.all([
      supabase
        .from("investment_projects")
        .select(
          "id, slug, name, summary, total_target_lakh, equity_percent_open, sort_order, created_at",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("investment_contributions")
        .select("id, project_id, investor_name, amount_lakh, created_at, updated_at")
        .order("updated_at", { ascending: false }),
    ]);

    if (projectResult.error || contributionResult.error) {
      const message =
        projectResult.error?.message ??
        contributionResult.error?.message ??
        "Unable to load investment data.";

      return {
        projects: [],
        error: isMissingInvestmentSchemaError(message)
          ? INVESTMENT_SCHEMA_SETUP_MESSAGE
          : message,
      };
    }

    return {
      projects: buildInvestmentProjects(
        projectResult.data ?? [],
        contributionResult.data ?? [],
      ),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load investment data.";

    return {
      projects: [],
      error: isMissingInvestmentSchemaError(message)
        ? INVESTMENT_SCHEMA_SETUP_MESSAGE
        : message,
    };
  }
}

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function InvestmentUpdatePage(props: AdminPageProps) {
  const [{ error: queryError, success }, isAuthenticated, { projects, error }] =
    await Promise.all([
      props.searchParams,
      isAdminAuthenticated(),
      getAdminInvestmentData(),
    ]);

  return (
    <main className="admin-page">
      <nav className="reviews-nav" aria-label="Admin navigation">
        <Link className="reviews-nav-link" href="/">
          Back to home
        </Link>
        <span className="reviews-nav-current">Admin investment update</span>
      </nav>

      <header className="page-header">
        <h1>Investment admin</h1>
        <p className="page-subtitle">
          Password-protected access for updating live investment progress.
        </p>
      </header>

      {!isAuthenticated ? (
        <section className="admin-lock-card">
          <div className="admin-lock-icon" aria-hidden="true">
            LOCKED
          </div>
          <h2>Admin access locked</h2>
          <p className="card-copy">
            Enter the admin password to update investor names and committed
            amounts for each project.
          </p>
          <form className="form-stack admin-lock-form" action={loginAdmin}>
            <div className="field">
              <label htmlFor="password">Admin password</label>
              <input id="password" name="password" type="password" required />
            </div>
            <div className="submit-row">
              <button className="submit-button" type="submit">
                Unlock admin
              </button>
              {queryError ? (
                <span className="status-text error">{queryError}</span>
              ) : null}
            </div>
          </form>
        </section>
      ) : (
        <section className="admin-grid">
          <section className="card">
            <div className="admin-card-head">
              <div>
                <h2>Update investment</h2>
                <p className="card-copy">
                  Upsert by project and investor name. If the same person is
                  entered again for the same project, the amount is replaced.
                </p>
              </div>
              <form action={logoutAdmin}>
                <button className="admin-logout" type="submit">
                  Lock admin
                </button>
              </form>
            </div>

            <form className="form-stack" action={updateInvestment}>
              <div className="field">
                <label htmlFor="projectId">Project</label>
                <select
                  id="projectId"
                  name="projectId"
                  className="admin-select"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="investorName">Investor name</label>
                <input
                  id="investorName"
                  name="investorName"
                  maxLength={80}
                  placeholder="Investor or fund name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="amountLakh">Amount in lakh</label>
                <input
                  id="amountLakh"
                  name="amountLakh"
                  type="number"
                  min="0.01"
                  max="10"
                  step="0.01"
                  placeholder="1.00"
                  required
                />
              </div>

              <div className="submit-row">
                <button className="submit-button" type="submit">
                  Save investment
                </button>
                {queryError ? (
                  <span className="status-text error">{queryError}</span>
                ) : null}
                {!queryError && success ? (
                  <span className="status-text success">{success}</span>
                ) : null}
                {!queryError && !success && error ? (
                  <span className="status-text error">{error}</span>
                ) : null}
              </div>
            </form>
          </section>

          <section className="card">
            <h2>Current project status</h2>
            <p className="card-copy">
              This mirrors the same live numbers shown on the public page.
            </p>
            <div className="admin-project-list">
              {projects.map((project) => (
                <article key={project.id} className="admin-project-row">
                  <div>
                    <strong>{project.name}</strong>
                    <p>
                      {project.committedPercent}% committed · Rs
                      {project.committedLakh.toFixed(
                        project.committedLakh % 1 === 0 ? 0 : 2,
                      )}
                      L of Rs{project.totalTargetLakh}L
                    </p>
                  </div>
                  <span>{project.investors.length} investors</span>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

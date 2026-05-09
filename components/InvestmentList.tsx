"use client";

import type { InvestmentProject } from "../lib/investments";

type InvestmentListProps = {
  projects: InvestmentProject[];
  error?: string | null;
};

function formatLakh(value: number): string {
  return `₹${value.toFixed(value % 1 === 0 ? 0 : 2)}L`;
}

export default function InvestmentList({
  projects,
  error = null,
}: InvestmentListProps) {
  return (
    <section className="investment-shell">
      <div className="investment-shell-head">
        <div>
          <p className="investment-kicker">Investment Open</p>
          <h2>10% equity open per project.</h2>
          <p className="investment-copy">
            Each project opens a 10% investor window. The progress below is live
            and updates from actual recorded investment entries.
          </p>
        </div>
        <div className="investment-rule">₹1 lakh = 1% equity</div>
      </div>

      {error ? <div className="investment-state">{error}</div> : null}

      <div className="investment-grid">
        {projects.map((project) => {
          const progressWidth = Math.min(
            100,
            (project.committedPercent / project.equityPercentOpen) * 100,
          );

          return (
            <article key={project.id} className="investment-card">
              <div className="investment-card-head">
                <div>
                  <h3>{project.name}</h3>
                  <p className="investment-summary">{project.summary}</p>
                </div>
                <div className="investment-open-pill">
                  {project.equityPercentOpen}% Open
                </div>
              </div>

              <div className="investment-metrics">
                <div className="investment-metric">
                  <span>Committed</span>
                  <strong>{formatLakh(project.committedLakh)}</strong>
                </div>
                <div className="investment-metric">
                  <span>Progress</span>
                  <strong>{project.committedPercent}%</strong>
                </div>
                <div className="investment-metric">
                  <span>Remaining</span>
                  <strong>{formatLakh(project.remainingLakh)}</strong>
                </div>
              </div>

              <div className="investment-progress-block">
                <div className="investment-progress-labels">
                  <span>Funding progress</span>
                  <strong>
                    {formatLakh(project.committedLakh)} /{" "}
                    {formatLakh(project.totalTargetLakh)}
                  </strong>
                </div>
                <div className="investment-progress-track" aria-hidden="true">
                  <div
                    className="investment-progress-fill"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
                <div className="investment-progress-meta">
                  <span>{project.committedPercent}% allocated</span>
                  <span>{project.remainingPercent}% still open</span>
                </div>
              </div>

              <div className="investment-slots" aria-hidden="true">
                {Array.from({ length: project.equityPercentOpen }, (_, index) => (
                  <span
                    key={`${project.slug}-${index + 1}`}
                    className={`investment-slot${
                      index < Math.floor(project.committedPercent)
                        ? " investment-slot-active"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <div className="investment-investors">
                <div className="investment-investors-head">
                  <span>Latest investors</span>
                  <strong>{project.investors.length}</strong>
                </div>
                {project.investors.length === 0 ? (
                  <div className="investment-investor-empty">
                    No investment recorded yet.
                  </div>
                ) : (
                  <div className="investment-investor-list">
                    {project.investors.slice(0, 4).map((investor) => (
                      <div key={investor.id} className="investment-investor-row">
                        <span>{investor.investorName}</span>
                        <strong>{formatLakh(investor.amountLakh)}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

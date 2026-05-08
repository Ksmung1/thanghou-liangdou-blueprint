"use client";

import { useEffect } from "react";

const navLinks = [
  { href: "#story", label: "Origin" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#equity", label: "Equity" },
  { href: "#revenue", label: "Economics" },
  { href: "#numbers", label: "Numbers" },
  { href: "#vision", label: "Vision" },
];

const partnerLinks = {
  educafe: "https://educafe.vercel.app",
  flowpandas: "https://flowpandas.com",
};

const projectBadges = [
  { className: "badge badge-gold", label: "2 Launches + 3 Pilots" },
  { className: "badge badge-amber", label: "2026 Q2 -> 2028 Q2" },
  { className: "badge badge-ember", label: "Lean EdTech First" },
  { className: "badge badge-sage", label: "No Upfront Investor Dilution" },
];

const heroStats = [
  { value: "₹18-25L", label: "24-Month Cash Plan" },
  { value: "5", label: "Projects" },
  { value: "24 mo", label: "Base Timeline" },
  { value: "45/45/10", label: "Safer Equity Split" },
];

const roadmapProjects = [
  {
    dotClass: "timeline-dot dot-a",
    key: "A",
    href: "https://bankcore.vercel.app",
    quarter: "2026 · Q2-Q3 — Launch Track",
    name: "BankSSC Mock Test Hub",
    description:
      "Fastest path to revenue. Public launch first, then scale only if the product clears a paid-retention gate: 1,000 paid users or 8 institute partners with repeat usage.",
    tag: "Banking · SSC · First Revenue Bet",
    milestone: "Gate: ₹8-12L Year-1 Revenue",
  },
  {
    dotClass: "timeline-dot dot-b",
    key: "B",
    href: undefined,
    quarter: "2026 · Q4 — Validation Track",
    name: "EduLearn 6-12",
    description:
      "Prototype and school-parent beta, not a full commercial rollout on day one. Move to paid expansion only after lesson completion, parent retention, and low-support delivery are proven.",
    tag: "K-12 · NCERT · Beta First",
    milestone: "Gate: 500 Active Students",
  },
  {
    dotClass: "timeline-dot dot-c",
    key: "C",
    href: undefined,
    quarter: "2027 · Q1 — Optional Build Track",
    name: "FocusFlow",
    description:
      "Built only if acquisition costs from the student audience remain attractive. Treated as a cross-sell productivity layer, not a standalone moonshot in year one.",
    tag: "Productivity · Cross-Sell Optionality",
    milestone: "Gate: CAC Below 4 Months Payback",
  },
  {
    dotClass: "timeline-dot dot-d",
    key: "D",
    href: undefined,
    quarter: "2027 · Q2 — Cohort Pilot",
    name: "Chai & Civil",
    description:
      "Begin with content, mentorship, and a small live cohort before funding an app-heavy build. This keeps UPSC risk low and lets the market signal where product depth is needed.",
    tag: "UPSC · Cohort Before Platform",
    milestone: "Gate: 200 Paid Cohort Seats",
  },
  {
    dotClass: "timeline-dot dot-e",
    key: "E",
    href: undefined,
    quarter: "2027 · Q3-Q4 — Expansion Only",
    name: "MedJEE Prep",
    description:
      "Highest-content-cost category, so it should be launched last. Enter only after the earlier products prove repeatable content operations, conversion, and teacher-led distribution.",
    tag: "NEET · JEE · Last-Mile Expansion",
    milestone: "Gate: Portfolio Profitability",
  },
];

const equityLegend = [
  {
    color: "#d4840a",
    name: "Educafe",
    description: "Capital, distribution, operations",
    percentage: "45%",
  },
  {
    color: "#4a9e6e",
    name: "Flowpandas",
    description: "Product, engineering, delivery",
    percentage: "45%",
  },
  {
    color: "#5a84b5",
    name: "ESOP Pool",
    description: "Unissued talent reserve with vesting",
    percentage: "10%",
  },
];

const revenueItems = [
  {
    icon: "📱",
    title: "Subscriptions",
    description:
      "Primary revenue engine: monthly and annual plans for mock tests, courses, and disciplined revision workflows.",
  },
  {
    icon: "🎓",
    title: "Paid Cohorts",
    description:
      "Smaller, higher-trust cohort programs for mentorship, answer writing, and guided test-prep batches.",
  },
  {
    icon: "🏫",
    title: "Institution Deals",
    description:
      "School and institute partnerships provide lower CAC and more predictable contract revenue than pure B2C alone.",
  },
  {
    icon: "📊",
    title: "Assessment Layer",
    description:
      "Analytics, progress reports, and performance dashboards improve retention and support upsells across products.",
  },
];

const projectionScenarios = [
  {
    name: "Conservative Case",
    revenue12: "₹8-12L",
    revenue24: "₹24-36L",
    cash: "₹15-18L",
    launches: "Only 1 product reaches stable paid traction",
    revenueHeight: "35%",
    scaleHeight: "30%",
    cashHeight: "60%",
  },
  {
    name: "Working Plan",
    revenue12: "₹15-20L",
    revenue24: "₹60-90L",
    cash: "₹18-25L",
    launches: "2 products launch properly and one pilot matures",
    revenueHeight: "72%",
    scaleHeight: "75%",
    cashHeight: "82%",
  },
  {
    name: "Strong Execution Case",
    revenue12: "₹24-30L",
    revenue24: "₹1.0-1.2Cr",
    cash: "₹25-30L",
    launches: "3 products reach real commercial scale",
    revenueHeight: "100%",
    scaleHeight: "100%",
    cashHeight: "100%",
  },
];

const marketSignals = [
  {
    value: "~20%",
    label: "India Online Education Growth",
    note: "India online education was projected to expand at roughly 20% CAGR through 2025.",
    sourceLabel: "IBEF Education Report, Nov 2025",
    sourceHref: "https://www.ibef.org/industry/education-presentation",
  },
  {
    value: "43%",
    label: "K-12 Is the Largest Segment",
    note: "K-12 was the largest edtech segment share in India in 2025.",
    sourceLabel: "IMARC India Edtech Market, crawled 2026",
    sourceHref: "https://www.imarcgroup.com/india-edtech-market",
  },
  {
    value: "26.9%",
    label: "Test Prep Growth Rate",
    note: "India test preparation was forecast at 26.88% CAGR from 2026 to 2034.",
    sourceLabel: "IMARC India Test Preparation Market, crawled 2026",
    sourceHref: "https://www.imarcgroup.com/india-test-preparation-market",
  },
];

function SeedIcon() {
  return (
    <svg
      className="seed-icon"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="16" cy="16" rx="6" ry="8" transform="rotate(-20 16 16)" />
      <path
        d="M16 8 C18 4 22 3 24 6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="11" cy="22" r="2.5" opacity=".6" />
      <circle cx="21" cy="12" r="1.8" opacity=".5" />
      <circle cx="8" cy="14" r="1.2" opacity=".4" />
    </svg>
  );
}

export default function ThangbouBlueprint() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 },
    );

    const projectTimeouts = new WeakMap<Element, number>();
    const rowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(
              (entry.target as HTMLElement).dataset.revealDelay ?? "0",
            );
            const timeoutId = window.setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay);
            projectTimeouts.set(entry.target, timeoutId);
          }
        });
      },
      { threshold: 0.1 },
    );

    const donutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const circles = entry.target.querySelectorAll<SVGCircleElement>(
              "circle[stroke-dasharray]",
            );

            circles.forEach((circle, index) => {
              circle.style.transition = `stroke-dashoffset .8s ease ${index * 0.15}s, opacity .8s ease ${index * 0.15}s`;
            });
          }
        });
      },
      { threshold: 0.3 },
    );

    const revealElements = document.querySelectorAll(".reveal");
    const projectRows = document.querySelectorAll(".project-row");
    const donutWraps = document.querySelectorAll(".donut-wrap");

    revealElements.forEach((element) => revealObserver.observe(element));
    projectRows.forEach((element, index) => {
      (element as HTMLElement).dataset.revealDelay = String(index * 120);
      rowObserver.observe(element);
    });
    donutWraps.forEach((element) => donutObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      rowObserver.disconnect();
      donutObserver.disconnect();
      projectRows.forEach((element) => {
        const timeoutId = projectTimeouts.get(element);
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      });
    };
  }, []);

  return (
    <div className="blueprint-shell">
      <div className="topbar" />

      <nav>
        <span className="nav-logo">T x L</span>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <section id="hero">
          <p className="hero-eyebrow">
            Investor Blueprint · Educafe x Flowpandas
          </p>

          <h1 className="hero-title">
            Project
            <br />
            Thangbou-Liandou
          </h1>

          <p className="hero-sub">
            A staged portfolio thesis: launch lean, protect founder ownership,
            and scale only after the first products earn the right to expand.
          </p>

          <div className="seed-divider">
            <SeedIcon />
          </div>

          <div className="hero-badges">
            {projectBadges.map((badge) => (
              <span key={badge.label} className={badge.className}>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="hero-stats">
            {heroStats.map((stat) => (
              <div key={stat.label} className="stat">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

      
        </section>

        <div className="sep" />

        <section id="story">
          <p className="section-tag">The Origin</p>
          <h2 className="section-title">
            A folktale of the <em>Paite Tribe</em>
            <br />
            reborn as disciplined venture design
          </h2>

          <div className="story-card">
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />

            <p>
              In the hills of <strong>Churachandpur, Manipur</strong>, the
              story of <strong>Thanghou and Liandou</strong> speaks about
              sharing even the smallest mustard seed. The original blueprint
              borrowed that spirit.
            </p>
            <p>
              This version adds the discipline investors expect: fewer promises,
              phased launches, and milestones that can be measured. The goal is
              not to announce five giant wins at once. The goal is to build one
              revenue engine, validate the second, and only then widen the
              portfolio.
            </p>
            <p>
              That keeps founder risk lower, preserves ownership, and gives
              outside capital a cleaner story: <strong>capital follows proof</strong>,
              not ambition alone.
            </p>

            <div className="origin">
              Paite Tribe Folktale · Churachandpur, Manipur · Investor-ready
              adaptation
            </div>
          </div>
        </section>

        <div className="sep" />

        <section id="partners">
          <p className="section-tag reveal">The Partnership</p>
          <h2 className="section-title reveal">
            Two operators.
            <br />
            <em>One capital-disciplined roadmap.</em>
          </h2>

          <div className="partner-grid reveal">
            <a
              className="partner-card partner-a partner-link-card"
              href={partnerLinks.educafe}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="partner-logo">Educafe</div>
              <div className="partner-name">Educafe</div>
              <p className="partner-desc">
                Educafe anchors brand, distribution, and staged cash deployment.
                Instead of spreading small amounts across five simultaneous
                builds, capital is released milestone by milestone into the
                products that show market pull.
              </p>
              <div className="partner-equity">
                <span aria-hidden="true">🌿</span> 45% Equity · Staged Capital +
                GTM Ownership
              </div>
            </a>

            <a
              className="partner-card partner-b partner-link-card"
              href={partnerLinks.flowpandas}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="partner-logo">Flowpandas</div>
              <div className="partner-name">Flowpandas</div>
              <p className="partner-desc">
                Flowpandas owns product architecture, engineering execution, and
                delivery discipline. Build effort is also staged, which avoids
                over-committing team capacity before user retention and payment
                behavior are visible.
              </p>
              <div className="partner-equity">
                <span aria-hidden="true">⚡</span> 45% Equity · Product + Tech
                Delivery
              </div>
            </a>
          </div>

          <div className="plus-sign reveal">+</div>

          <div className="equity-card reveal">
            <div className="ec-label">Safer Default</div>
            <div className="ec-value">No Investor Pool Upfront</div>
            <p className="ec-note">
              Reserve only 10% as an unissued ESOP pool. Do not pre-gift equity
              to hypothetical investors before capital arrives. Future outside
              investors should come in through a priced round or SAFE/CCPS and
              dilute all existing holders proportionally.
            </p>
          </div>
        </section>

        <div className="sep" />

        <section id="roadmap">
          <div className="roadmap-header">
            <div>
              <p className="section-tag">The Roadmap</p>
              <h2 className="section-title">
                Launch first.
                <br />
                <em>Expand only after proof.</em>
              </h2>
            </div>
            <div
              className="hero-badges"
              style={{ justifyContent: "flex-end" }}
            >
              <span className="badge badge-amber">2 Revenue Launches First</span>
              <span className="badge badge-gold">24 Month Window</span>
            </div>
          </div>

          <div className="timeline-bar">
            {roadmapProjects.map((project) => (
              <div key={project.key} className="project-row">
                <div className={project.dotClass}>{project.key}</div>
                <a
                  className={`project-card${project.href ? " project-link-card" : ""}`}
                  href={project.href}
                  target={project.href ? "_blank" : undefined}
                  rel={project.href ? "noopener noreferrer" : undefined}
                >
                  <div className="project-quarter">{project.quarter}</div>
                  <div className="project-name">{project.name}</div>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-footer">
                    <span className="project-tag">{project.tag}</span>
                    <span className="project-valuation">
                      {project.milestone}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        <div className="sep" />

        <section id="equity">
          <p className="section-tag reveal">Equity Structure</p>
          <h2 className="section-title reveal">
            Keep founder control.
            <br />
            <em>Hire with options, not premature dilution.</em>
          </h2>

          <div className="equity-grid reveal">
            <div className="equity-wheel">
              <div className="donut-wrap">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#0e2318"
                    strokeWidth="20"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#d4840a"
                    strokeWidth="20"
                    strokeDasharray="141.37 314.16"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#4a9e6e"
                    strokeWidth="20"
                    strokeDasharray="141.37 314.16"
                    strokeDashoffset="-141.37"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#5a84b5"
                    strokeWidth="20"
                    strokeDasharray="31.42 314.16"
                    strokeDashoffset="-282.74"
                  />
                </svg>
                <div className="donut-center">
                  <span className="dc-label">Founders Keep</span>
                  <span className="dc-value">90%</span>
                  <span className="dc-label">Pre-Fundraise</span>
                </div>
              </div>

              <div className="equity-legend">
                {equityLegend.map((item) => (
                  <div key={item.name} className="legend-item">
                    <div
                      className="legend-dot"
                      style={{ background: item.color }}
                    />
                    <div>
                      <div className="legend-name">{item.name}</div>
                      <div className="legend-desc">{item.description}</div>
                    </div>
                    <div className="legend-pct" style={{ color: item.color }}>
                      {item.percentage}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="equity-card reveal">
              <div className="ec-label">Portfolio Cash Requirement</div>
              <div className="ec-value">₹18-25 Lakh</div>
              <p className="ec-note">
                A realistic 24-month base plan for content, product, initial
                GTM, and small-team execution. It is materially safer than
                assuming five revenue launches from ₹5 lakh total cash.
              </p>
            </div>

            <div className="equity-card reveal">
              <div className="ec-label">Investor Entry Principle</div>
              <div className="ec-value">Dilute After Traction</div>
              <p className="ec-note">
                External capital should be raised only after at least one launch
                shows retention, paid conversion, and clean monthly reporting.
                That protects both valuation and founder ownership.
              </p>
            </div>
          </div>
        </section>

        <div className="sep" />

        <section id="revenue">
          <p className="section-tag reveal">Economics</p>
          <h2 className="section-title reveal">
            Numbers before narrative.
            <br />
            <em>Contribution margin before scale.</em>
          </h2>

          <div className="formula-block reveal">
            <div className="formula-text">
              Paid Users x ARPU + B2B Contracts
              <span className="op">-</span>
              Refunds + Delivery Cost
              <span className="op">=</span>
              <span className="result">Contribution Margin</span>
            </div>
            <p className="formula-note">
              The base case assumes revenue concentration in 1-2 products first,
              not equal revenue from all five projects at once.
            </p>
          </div>

          <div className="revenue-items reveal">
            {revenueItems.map((item) => (
              <div key={item.title} className="rev-item">
                <div className="ri-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <div className="ri-title">{item.title}</div>
                <p className="ri-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="sep" />

        <section id="numbers">
          <p className="section-tag reveal">Investor Numbers</p>
          <h2 className="section-title reveal">
            Clear scenarios.
            <br />
            <em>Readable, defensible, and milestone-based.</em>
          </h2>

          <div className="equity-card reveal">
            <div className="ec-label">How To Read This</div>
            <div className="ec-value">Three Simple Cases</div>
            <p className="ec-note">
              These are not guaranteed outcomes. They are planning ranges.{" "}
              <strong>12-Month Revenue</strong> means total revenue collected in
              the first year. <strong>24-Month Annualised Revenue</strong> means
              the run-rate the portfolio could be operating at by the end of
              year two if traction holds. <strong>Cash Required</strong> is the
              estimated amount needed to reach that level without overbuilding
              too early.
            </p>
          </div>

          <div className="numbers-grid reveal">
            {projectionScenarios.map((scenario) => (
              <div key={scenario.name} className="scenario-card">
                <div className="scenario-name">{scenario.name}</div>
                <div className="scenario-chart">
                  <div className="scenario-bar-group">
                    <div className="scenario-bar-wrap">
                      <div
                        className="scenario-bar scenario-bar-revenue"
                        style={{ height: scenario.revenueHeight }}
                      />
                    </div>
                    <span className="scenario-bar-label">Year 1 Revenue</span>
                  </div>
                  <div className="scenario-bar-group">
                    <div className="scenario-bar-wrap">
                      <div
                        className="scenario-bar scenario-bar-scale"
                        style={{ height: scenario.scaleHeight }}
                      />
                    </div>
                    <span className="scenario-bar-label">Year 2 Run-Rate</span>
                  </div>
                  <div className="scenario-bar-group">
                    <div className="scenario-bar-wrap">
                      <div
                        className="scenario-bar scenario-bar-cash"
                        style={{ height: scenario.cashHeight }}
                      />
                    </div>
                    <span className="scenario-bar-label">Cash Needed</span>
                  </div>
                </div>
                <div className="scenario-metric">
                  <span>12-Month Revenue</span>
                  <strong>{scenario.revenue12}</strong>
                </div>
                <div className="scenario-metric">
                  <span>Revenue Run-Rate By End Of Year 2</span>
                  <strong>{scenario.revenue24}</strong>
                </div>
                <div className="scenario-metric">
                  <span>Cash Required</span>
                  <strong>{scenario.cash}</strong>
                </div>
                <div className="scenario-foot">{scenario.launches}</div>
              </div>
            ))}
          </div>

          <div className="market-grid reveal">
            {marketSignals.map((signal) => (
              <div key={signal.label} className="market-card">
                <div className="market-value">{signal.value}</div>
                <div className="market-label">{signal.label}</div>
                <p className="market-note">{signal.note}</p>
                <a
                  className="source-note"
                  href={signal.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {signal.sourceLabel}
                </a>
              </div>
            ))}
          </div>

          <div className="equity-card reveal">
            <div className="ec-label">What Investors Should Understand</div>
            <div className="ec-value">This Is A Traction-First Proposal</div>
            <p className="ec-note">
              The purpose of these numbers is not to claim a fixed valuation
              today. The purpose is to show that the team is thinking in
              measurable stages: launch, paid retention, repeat revenue, and
              only then fundraising or valuation expansion.
            </p>
          </div>
        </section>

        <div className="sep" />

        <section id="vision">
          <div className="seed-divider vision-divider">
            <SeedIcon />
          </div>

          <p className="vision-quote">
            "A small seed is still enough, if it is planted with discipline. A
            venture does not need louder promises. It needs better proof."
          </p>
          <p className="vision-attr">The Spirit of Thanghou & Liandou</p>
        </section>
      </main>

      <footer>
        <div className="footer-title">Project Thangbou-Liandou</div>
        <p className="footer-sub">
          A staged joint venture designed to protect founder ownership, deploy
          capital carefully, and give investors milestone-based numbers instead
          of fantasy projections.
        </p>
        <div className="footer-badges">
          <span className="badge badge-gold">Educafe x Flowpandas</span>
          <span className="badge badge-amber">EdTech · India</span>
          <span className="badge badge-ember">24-Month Base Plan</span>
          <span className="badge badge-sage">Investor-Ready Revision</span>
        </div>
        <p className="footer-copy">
          Master Blueprint · Conservative Assumptions · Traction Before
          Valuation
        </p>
      </footer>
    </div>
  );
}

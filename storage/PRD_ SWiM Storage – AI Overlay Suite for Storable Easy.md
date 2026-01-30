\# PRD: SWiM Storage – AI Overlay Suite for Storable Easy  
\*\*Version:\*\* 0.9 – July 2025    
\*\*Owner:\*\* SWiM AI, LLC 

\#\# 1\. Purpose & Vision

\*\*Vision\*\*    
Make every small self-storage facility as data-driven and profitable as a REIT—without adding head-count or switching property-management systems.

\*\*Mission for V1 (next 12 months)\*\*    
Deliver a plug-and-play AI layer that connects to Storable Easy, ingests nightly facility data, and automatically optimizes:  
\- (a) street rates  
\- (b) scheduled rent increases  
\- (c) tenant communications    
…proving ≥ 4% revenue lift and \>70% reduction in routine support calls for single-site owners.

\---

\#\# 2\. Background

\- \*\*Market gap\*\*: 12k+ facilities on Storable Easy have no native AI.  
\- \*\*Strategic fit\*\*: Overlay model is low-capex, leverages Easy API or CSV export.  
\- \*\*Pilot interest\*\*: 5 facilities (1,740 units) committed to beta.

\---

\#\# 3\. Goals & Success Metrics (Year 1\)

| Objective       | KPI                                     | Target        |  
|----------------|------------------------------------------|---------------|  
| Revenue lift    | Monthly gross rent vs. pre-AI baseline   | ≥ 4%          |  
| Churn neutrality| Δ in move-out rate vs. control units     | ≤ \+0.5 pp     |  
| Automation      | % inbound comms resolved by AuroraBot    | ≥ 70%         |  
| Adoption        | Facilities live                          | ≥ 120         |  
| Reliability     | Job schedule completion rate             | ≥ 99%         |  
| Security        | SOC 2 Type I audit pass                  | By Month 9    |

\---

\#\# 4\. Target Personas

| Persona | Job to be Done | Pain Points |  
|--------|----------------|-------------|  
| Hands-On Owner (HOO) | "Keep my place full and raise rents when I should, but don't flood me with knobs." | Time-poor, tech-wary |  
| Regional Manager (RM) | "Give me a dashboard to monitor all my sites." | Manual spreadsheets |  
| Third-Party Mgmt Rep (TPM) | "Prove to my owners this software creates value." | Needs audit trail |

\---

\#\# 5\. User Stories (MVP – Release 1.0)

| Priority | As a … | I want … | So that … | Acceptance Criteria |  
|----------|--------|----------|-----------|---------------------|  
| P0 | HOO | AI-suggested street rates | I maximize revenue automatically | Shows daily; 1-click approve/override |  
| P0 | HOO | Auto rent-increase timings | Raise revenue w/o excess churn | Model risk score; enforce rules |  
| P0 | HOO | AuroraBot chat/SMS | Tenants get answers while I sleep | ≥ 70% resolution rate |  
| P1 | RM | Portfolio dashboard | I monitor performance easily | Aggregated KPIs, exports |  
| P1 | TPM | Audit trail of decisions | I justify results to clients | Time-stamped logs |  
| P2 | HOO | Delinquency alerts | I reduce bad debt | Tiered risk flags, auto-notices |

\---

\#\# 6\. Functional Requirements

\#\#\# 6.1 Data Ingestion

\- Primary: CSV upload via web interface  
\- Future: Easy API via OAuth (pending approval)  
\- Fallback: CSV upload \+ headless browser scrape  
\- SLA: Complete by 5:00 AM local time

\#\#\# 6.2 Rate Optimizer

\- Model: GBT → RL (by Month 12\)  
\- Inputs: occupancy, DOW, seasonality, comps, weather  
\- Output: recommended rate per unit type  
\- Write-back via CSV export (Phase 1), API PATCH (when available)

\#\#\# 6.3 Rent Raise Scheduler

\- Model: Survival analysis  
\- Output: Raise schedule w/ churn risk score  
\- Bulk action via UI or Easy import file

\#\#\# 6.4 AuroraBot (Chat \+ SMS)

\- Channels: Web widget, SMS, Voice (optional)  
\- NLU: GPT-4o \+ retrieval augmented FAQ  
\- Actions: Quote, reserve, payment link, directions  
\- Safeguards: Profanity filter, payment rate-limiting

\#\#\# 6.5 Dashboards

\- Stack: React \+ Supabase Realtime \+ Chart.js  
\- Views: RevPAR, lift %, churn graph, pricing logs  
\- Permissions: Owner / Manager / Read-only

\#\#\# 6.6 Alerts

\- Channels: SMS, email, Slack, Teams (P2)  
\- Triggers: Low occupancy, delinquency, model anomaly

\---

\#\# 7\. Non-Functional Requirements

\- \*\*Availability\*\*: 99% uptime  
\- \*\*Performance\*\*: Dashboard P95 \< 5s; batch \< 4 hrs  
\- \*\*Security\*\*: SOC 2, TLS 1.3, AES-256, Supabase RLS  
\- \*\*Privacy\*\*: CCPA & GDPR compliant  
\- \*\*Scalability\*\*: Horizontal for 50k facilities  
\- \*\*Maintainability\*\*: 60%+ test coverage (MVP); GitHub Actions  
\- \*\*Localization\*\*: Currency/date formats; I18n in Year 2

\---

\#\# 8\. Architecture (Adaptive)

\#\#\# Phase 1 \- Manual Operations (MVP)  
\- Input: CSV upload via web interface  
\- Storage: Supabase (PostgreSQL \+ Storage)  
\- Compute: Supabase Edge Functions \+ External Python service  
\- Frontend: Next.js \+ Supabase client  
\- ML: Batch predictions via cron  
\- Observability: Basic logging \+ Sentry free tier

\#\#\# Phase 2 \- Hybrid  
\- Add: Web scraping, automated reminders  
\- Same core architecture

\#\#\# Phase 3 \- Full Automation  
\- Add: Storable Easy API integration  
\- Add: Real-time webhooks  
\- Consider: Migration to AWS if scale demands

\---

\#\# 9\. Assumptions & Dependencies

\- Easy Partner API approval within 30 days (if not, continue with CSV)  
\- Beta customers allow anonymized data  
\- GPT-4o usage capped at 200k tokens/day  
\- CSV export schema is stable

\---

\#\# 10\. Out of Scope (V1)

\- CCTV computer vision  
\- IoT locks and hardware integration  
\- PPC/SEO budget optimizer  
\- Multi-PMS support (Yardi, DoorSwap)

\---

\#\# 11\. Milestones

| Month | Milestone |  
|-------|-----------|  
| 0 | CSV template finalized; PRD sign-off |  
| 1 | Ingestion & Supabase schema operational |  
| 3 | Alpha rate model in sandbox |  
| 4 | Beta with 5 facilities |  
| 6 | MVP code freeze; SOC 2 prep |  
| 7 | GA Launch via Storable Marketplace |  
| 9 | Rent raise module release |  
| 12 | AuroraBot GA; 120 sites onboarded |

\---

\#\# 12\. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |  
|------|-------------|--------|------------|  
| Storable API unavailable | High | Med | CSV upload workflow; proven value for API negotiation |  
| Bad rate calls | Low | High | Rate-change cap; owner override |  
| AI pushback | Med | Med | Explainable UI, manual opt-in |  
| Data breach | Low | High | Pen test; Supabase RLS |

\---

\#\# 13\. Metrics

\- \*\*Business\*\*: ARR, unit count, CAC, gross margin  
\- \*\*Product\*\*: MAE vs. actual rate, churn delta, bot FCR  
\- \*\*System\*\*: Upload success rate, job latency  
\- \*\*Engagement\*\*: DAU/WAU by facility, dashboard duration

\---

\#\# 14\. Rollout Plan

1\. CSV template distribution → manual upload  
2\. 30-day parallel run (AI "suggests")  
3\. Opt-in autoscale after results  
4\. Slack community \+ Office hours  
5\. Monthly impact report

\---

\#\# 15\. Open Questions

| \# | Question | Owner | Due |  
|---|----------|-------|-----|  
| 1 | Does Easy API support write-back? | PM | Sprint 1 |  
| 2 | Which lien letters can be auto? | Legal | Sprint 3 |  
| 3 | Twilio porting for SMS? | Eng | Sprint 4 |  
| 4 | Comp-rate API pricing access? | BizDev | Sprint 2 |

\---

\#\# 16\. Data Integration Strategy

\*\*Month 0-3: Manual CSV uploads (daily/weekly)\*\*  
\- Template provided to customers  
\- Validation on upload  
\- Manual approval workflow

\*\*Month 4-6: Enhanced Manual\*\*  
\- Email reminders for uploads  
\- Auto-fetch public data (weather, comps)  
\- CSV pre-fill from previous uploads

\*\*Month 7+: API Integration (pending approval)\*\*  
\- Maintain CSV option as fallback  
\- Gradual migration per customer  
\- A/B test manual vs automated outcomes

\---

\#\# 17\. Appendix

\- Glossary (RevPAR, LTV, Rent Roll…)  
\- CSV template specifications  
\- API specs (Easy endpoints \- when available)  
\- ML model documentation  
\- Compliance checklist

\---

\*\*Summary\*\*: Aurora will deliver fast, measurable lift to small facility owners while creating a durable AI and data moat. This PRD de-risks execution with clear milestones, stakeholder alignment, and a modular roadmap that can expand into access control, full PMS, and beyond.  

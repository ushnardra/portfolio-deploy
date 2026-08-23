# Ushnardra Ghosh — Knowledge Base

> Source of truth for a RAG chatbot answering questions about Ushnardra Ghosh
> and his work. Every fact below is taken from his own portfolio site source
> (`data.js`, `components/*.jsx`) and the public links listed in it. Nothing is
> inferred or invented. Where a figure is self-reported (e.g. clients served),
> it is marked as such.

---

## 1. Identity

| Field | Value |
| --- | --- |
| Name | Ushnardra Ghosh |
| Role | Software Solutions Engineer (solo, not an agency or team) |
| Business / brand name | Fluidwebsoft |
| Tagline | Software Solutions & AI Integration |
| Location | Kolkata, West Bengal, India — works with clients worldwide |
| Email | ushnardra9999@gmail.com |
| Phone / WhatsApp | +91 9330497299 |
| LinkedIn | https://www.linkedin.com/in/ushnardra-ghosh/ |
| GitHub | https://github.com/ushnardra |

**Important positioning fact:** Fluidwebsoft is one person. The site deliberately
avoids the words "studio", "team", "we" and "in-house". Clients work with
Ushnardra directly, and he owns the entire build end to end. He positions
himself as a solutions provider — solving problems and improving existing
systems — not just a web developer.

**Self-description (from the About section):**
> "Fluidwebsoft is me — Ushnardra Ghosh, a software solutions engineer in Kolkata
> working with clients worldwide. I work across web engineering and AI
> integration, solving problems and making existing systems better — which is
> why every feature here gets built in-house rather than outsourced."

Positioning line: **software engineering + AI integration** — one engineer, two
disciplines. We solve problems and make your existing solutions better.

---

## 2. What he does (services)

Seven service lines:

1. **AI-Integrated Projects** — web applications with machine learning, NLP and
   generative AI wired in; tools that automate, predict and personalise rather
   than just display.
2. **3D & Immersive Websites** — real-time 3D on the web with Three.js and
   WebGL. Product configurators, virtual tours, scroll-driven cinematic pages
   that stay fast.
3. **E-Commerce Solutions** — storefronts built around checkout completion;
   inventory, payments and analytics integrated, measured on conversion rather
   than looks.
4. **SaaS Platforms** — multi-tenant products with authentication, role-based
   access, subscription billing and cloud architecture to scale past launch.
5. **Portfolio & Personal Sites** — for people whose work has to sell itself
   (designers, architects, researchers). Considered motion, real typography,
   fast on mobile.
6. **Business & Showcase Sites** — credibility-first: clear positioning, fast
   load, structured data, and a contact path that produces enquiries.
7. **ERP Software** — custom enterprise resource planning systems that
   centralise operations — inventory, procurement, HR, finance and reporting in
   one place, built around how the client's business actually runs.

If a project spans two of these, he scopes it on the call.

---

## 3. Differentiators (his four stated capabilities)

- **Applied AI, not subcontracted** — machine learning is built in-house by him,
  including model interpretability work. AI features are a normal part of a
  project, not an exception.
- **Real-time 3D on the web** — Three.js and WebGL used where they earn their
  weight, with a performance budget agreed before a single mesh is loaded.
- **Engineered for Core Web Vitals** — performance is a requirement, not a
  cleanup task. His own site scores 95+ Lighthouse performance (best measured
  run) with a full WebGL demo one click away; Accessibility 100, Best Practices
  100, SEO 100, CLS 0.
- **Handover, not lock-in** — documented code in the client's repository, on the
  client's hosting, no proprietary layer.

---

## 4. Tech stack

**Frontend:** React, Next.js, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS,
Three.js / WebGL (`@react-three/fiber`, `@react-three/drei`), Vite

**Backend:** Node.js, Django, Django REST Framework, Python, REST APIs

**Data:** MongoDB, PostgreSQL, SQLite

**AI / ML:** Python, TensorFlow, scikit-learn, OpenCV, Grad-CAM (explainable
AI), NLP / sentiment & emotion analysis, Streamlit

**Cloud / platform:** AWS, Shopify, Netlify, Git / GitHub

---

## 5. Projects

### 5.1 E-Book Emporium — E-Commerce
Full e-commerce platform for book buyers: catalogue browsing, user accounts,
cart and checkout. Django REST backend with a React front end.
- Stack: React, Django, SQLite
- Live: https://luminous-sunshine-dbc85f.netlify.app/
- Code: https://github.com/ushnardra/EBOOKEmporium/tree/master

### 5.2 Green Traders Academy — Frontend / client work
Educational platform for traders: course discovery, descriptions, and a personal
library, with a responsive design and a robust backend. Bridges learners and
their next course.
- Stack: HTML5, CSS3, JavaScript
- Live: https://greentradersacademy.in/

### 5.3 DreamHome Realty — Business
Real-estate platform with filtered property search and interactive listings,
structured around turning browsers into enquiries.
- Stack: React, CSS3, REST API
- Live: https://effervescent-hummingbird-2d9c14.netlify.app/

### 5.4 LuxeEstates — Showcase
Luxury property showcase built on parallax scrolling and staged reveals — Lab
techniques applied to a brand.
- Stack: HTML5, CSS3, JavaScript
- Live: https://graceful-marshmallow-f546d1.netlify.app/

### 5.5 Emotion AI Analyzer — AI / ML
Semantic/sentiment analysis with emotion detection, deployed as a Streamlit app.
- Stack: Python, scikit-learn, Streamlit
- Live: https://semantic-analysis-with-emotions-pnyu5z7wzupy69asut6ngt.streamlit.app/
- Code: https://github.com/ushnardra/SEMANTIC-ANALYSIS-WITH-EMOTIONS

### 5.6 Explainable AI — Galaxy Classification — Research / AI
A CNN classifying galaxy morphology (elliptical, spiral, irregular) at **85%
accuracy**, with Grad-CAM overlays showing which structural features drove each
prediction.
- Stack: Python, TensorFlow, OpenCV, Grad-CAM, Streamlit
- Code: https://github.com/ushnardra/Explainable-AI-XAI-in-Deep-Learning-Models-for-Large-Scale-Galaxy-Classification

### 5.7 Fluidwebsoft portfolio site (this repository)
His own site, and itself a demo piece: React 19 + Vite 7 + Tailwind v4, a
pinned scroll-driven process sequence, a WebGL "Lab" section with eight complete
design systems, dark/light theming, `prefers-reduced-motion` fallbacks
everywhere, JSON-LD structured data (`ProfessionalService`, `Person`, `FAQPage`),
sitemap and robots.txt. Motion is driven by one rAF-batched scroll listener
writing a single CSS custom property.

---

## 6. Credentials

- **Front-end Web Development** — Reliance Foundation Skilling Academy via Skill
  India Digital. Completed Feb 2025, 8-hour course, NSDC authorised.
- **Certificate of participation** — Brainware University, Dept. of CSE-AI, in
  collaboration with **IBM**. April 2025, two-day tech event.

He states these exactly as issued and points to public code and live
deployments as the primary evidence.

---

## 7. How he works (process)

Four stages, each ending in a concrete deliverable:

1. **Discovery** — a call mapping goals, audience and constraints, then a
   written brief defining success. → *Written brief + agreed scope*
2. **Design** — wireframes first, then high-fidelity screens for every
   breakpoint; client signs off here, where changes cost minutes. → *Approved
   designs, mobile and desktop*
3. **Build** — production code with a **live preview URL from the first week**
   and a **written progress update every week**. → *Live preview + weekly
   updates*
4. **Launch** — deployment, a performance and accessibility pass, analytics
   wired up, repository transferred to the client, then 30 days of support. For
   larger e-commerce and ERP builds, weekly handover sessions are included after
   launch — system walkthroughs, team training and Q&A until the client is
   fully self-sufficient. →
   *Your repo, your hosting, 30-day support (+ weekly sessions for e-commerce/ERP)*

Engagement flow before that: a free, no-obligation **30-minute call** on goals,
features and deadline → a **written proposal** listing exactly what gets built,
the timeline and one **fixed price** → nothing starts until it is approved →
payment **split across milestones**, always following delivered work.

---

## 8. Scope tiers (no published rate card)

He does not publish prices, because "a five-page brochure site and an AI
platform have nothing in common." Every project is quoted after a call, in
writing, at a fixed price. Three scope tiers:

**Starter** — small businesses and personal brands
- Up to 5 pages, single or multi-page
- Responsive across mobile and desktop
- SEO groundwork, meta and structured data
- Contact form wired to the client's inbox
- 1 revision round

**Professional** — growing businesses that need more than a brochure
- Everything in Starter, plus custom motion and interaction design
- E-commerce or third-party API integration
- 30 days post-launch support
- 3 revision rounds

**Enterprise** — products, platforms and anything with real complexity
- Everything in Professional, plus AI / ML feature integration
- Full SaaS or ERP build
- Database and cloud architecture
- Weekly post-launch training sessions (e-commerce & ERP)
- Priority support and ongoing maintenance
- Open revisions within agreed scope

---

## 9. FAQ (verbatim answers)

**How long does a project take?**
A five-page business site is usually about a week. Something with a CMS,
e-commerce or custom integrations runs two to three weeks. Platforms with AI
features, 3D or full SaaS functionality are scoped individually — you get a date
in the written proposal, not a guess on the call.

**What does it cost?**
No published rate card. Every project is quoted after a call, in writing, at a
fixed price.

**How do payments work?**
Split across agreed milestones rather than paid upfront, so payment always
follows work you have already seen. The specific split is in your proposal.

**Who owns the code and the design?**
You do, on final payment. Everything is handed over in your own repository,
documented, with no proprietary framework or licence keeping you tied to me. You
are free to take it to any other engineer or team.

**How many revisions do I get?**
One round on Starter scope, three on Professional, and open revisions within the
agreed scope on Enterprise. Most changes land during the design stage, where
redrawing a layout costs minutes rather than days of rebuilding.

**What happens after launch?**
Thirty days of bug fixes and performance tuning are included on every project.
For larger e-commerce and ERP builds, weekly handover sessions are also included
after launch — system walkthroughs, team training and Q&A — so the client is
fully self-sufficient. After that, ongoing maintenance is available monthly if
wanted — and entirely optional, since the client owns the code.

**I already have a website. Can you fix or rebuild it?**
Yes. Common requests are performance and Core Web Vitals work, mobile layout
repairs, accessibility fixes, and adding features to an existing build. If a
rebuild would genuinely cost less than repairing what is there, I will say so.

**Do you only do design, or only development?**
Either, if that is what you need — but most projects are both, because the
design decisions and the implementation constraints are the same conversation.
If you already have Figma files, I can build straight from them.

**Can you really do AI and 3D, or is that just on the services page?**
Both are demonstrated live in the Lab section of this page — real WebGL and
eight complete design systems running in your browser — and the machine-learning
work is public on GitHub, including a Grad-CAM explainability project. Open them
rather than take my word for it.

**You are in India and I am not. Does that work?**
It is the normal case. Communication is written and asynchronous by default,
with a weekly progress update and a live preview URL you can check any time, so
time zones stop mattering. Calls are scheduled to suit yours.

---

## 10. Track record (self-reported figures)

- Clients served: **7+**
- On-time delivery: **100%**
- Progress updates: **weekly**
- Post-launch support: **30 days** included on every project

Client testimonials on the site are attributed to: Rupayan Gautam (Founder,
GreenTraders Academy), Sneha Gupta (Owner, StyleNest Boutique), Arjun Mehta
(CTO, InsightFlow), Diya Roy (Freelance Architect), and Karan Joshi (CEO,
LearnPath EdTech).

---

## 11. Contact

- Email: ushnardra9999@gmail.com
- WhatsApp: https://wa.me/919330497299 (+91 9330497299)
- LinkedIn: https://www.linkedin.com/in/ushnardra-ghosh/
- GitHub: https://github.com/ushnardra
- Based in Kolkata, West Bengal, India; available to clients worldwide
- First step is always a free 30-minute call, no obligation

---

## 12. Notes for the chatbot

- The assistant's name is **PIKI**. It is Ushnardra's site assistant, not
  Ushnardra himself — it speaks about him in the third person.
- Speak about Ushnardra as **one software solutions engineer**, never as a team or
  agency with staff. His focus is on solving problems and improving existing
  solutions — not just building websites.
- Never quote a price. Direct pricing questions to the free call and the written
  fixed-price proposal.
- Do not invent projects, clients, certifications, dates or metrics beyond what
  is listed here. If asked something not covered, say it is not documented and
  offer the contact routes in §11.
- LinkedIn profile details beyond the URL (full employment history, education
  dates, endorsements) are **not** captured in this file — do not answer as if
  they were. Ushnardra can paste his LinkedIn "About", "Experience" and
  "Education" sections into a §13 below to extend coverage.
- Good chunking boundary: each numbered section, and each project under §5, is a
  self-contained chunk. Keep headings with their bodies when embedding.

---
title: "SEO Roadmap & Indexing Tracker"
description: "Tracking document for md-rehman.dev SEO enhancements, Google indexing status, off-page backlinks, and future SEO tasks."
category: "planning/todo"
order: 2
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-05"
---

# SEO Roadmap & Indexing Tracker 🚀

Tracking document for SEO optimizations, Google Search Console indexing progress, off-page signals, and planned enhancements for `https://md-rehman.dev`.

---

## 🟢 1. Completed & Deployed (In Production)

- [x] **Primary Meta & Title Tags**: Configured unique `title`, `description`, `keywords`, `canonical` link, and `author` metadata in `apps/home/app/layout.tsx`.
- [x] **Google Site Verification**:
  - [x] HTML Meta Tag: `<meta name="google-site-verification" content="sxOiWLRDa1j3ofGcM8vq9IpuIWLBlJTv47gffUDjcIE" />` in `<head>`.
  - [x] Static HTML File: Created `apps/home/public/googlesxOiWLRDa1j3ofGcM8vq9IpuIWLBlJTv47gffUDjcIE.html` fallback.
  - [x] DNS TXT Record: Confirmed 100% global DNS propagation for `google-site-verification=sxOiWLRDa1j3ofGcM8vq9IpuIWLBlJTv47gffUDjcIE` across all worldwide DNS nodes via DNSChecker.org.
- [x] **Robots & Sitemap**:
  - [x] Dynamic `/robots.txt` route specifying `Allow: /` and `Sitemap: https://md-rehman.dev/sitemap.xml`.
  - [x] Dynamic `/sitemap.xml` listing main routes (`/`, `/tv-set`, `/companion`, `/planner`) and channel sub-pages with priorities and change frequencies.
- [x] **Structured Data (JSON-LD)**:
  - [x] `Person` schema (`Mohd. Rehman Baig` / `md-rehman` alternate names, `sameAs` links).
  - [x] `WebSite` schema (`MD Rehman Dev`).
  - [x] `SoftwareApplication` schema for showcase apps.
  - [x] `ItemList` schema for navigation elements.
- [x] **Social Share Preview Cards (OpenGraph & Twitter)**:
  - [x] OpenGraph `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`.
  - [x] Twitter `twitter:card` (`summary_large_image`), `twitter:creator` (`@_mdrehman`).
  - [x] Deployed authentic hero screenshot preview image at `/og-image.jpg`.
- [x] **Semantic HTML & Content Optimization**:
  - [x] Single `<h1>` tag with structured `<h2>` headings.
  - [x] Visually hidden SEO-focused section (`.sr-only`) targeting search terms (`md-rehman`, `rehman dev`, `Mohd. Rehman Baig`).

---

## 🟢 2. Search Console & High-Authority Backlinks (Completed)

- [x] **Google Search Console Indexing**:
  - [x] Verified site ownership in Google Search Console.
  - [x] Submitted `https://md-rehman.dev/sitemap.xml`.
  - [x] Triggered **Request Indexing** via GSC URL Inspection.
  - [x] Verified 5 pages successfully indexed in Google Search Console!
- [x] **High-Authority Backlink Updates**:
  - [x] GitHub Profile (`github.com/md-rehman`) website link updated to `https://md-rehman.dev`.
  - [x] LinkedIn Profile (`linkedin.com/in/md-rehman`) Contact Info website link.
  - [x] X / Twitter Profile (`x.com/_mdrehman`) bio link.
  - [x] Hashnode / Dev.to / Medium / Instagram bios updated with `https://md-rehman.dev`.

---

## 🔴 3. Future Tasks & Next Steps (To Do After Initial Indexing)

- [ ] **Bing Webmaster Tools Import**:
  - [ ] Log in to [Bing Webmaster Tools](https://www.bing.com/webmasters/).
  - [ ] 1-Click import site & sitemap from Google Search Console to index on Bing, Yahoo, DuckDuckGo, and Ecosia.
- [ ] **Rich Results & Schema Validation**:
  - [ ] Test live URL on [Google Rich Results Test](https://search.google.com/test/rich-results) to ensure schema validation returns 0 warnings.
- [x] **Core Web Vitals & Performance Audit**:
  - [x] Ran [PageSpeed Insights](https://pagespeed.web.dev/) mobile & desktop audit (`https://md-rehman.dev`).
  - [x] Verified Mobile Performance Score **82/100**, **CLS = 0.00** (Perfect), **TBT = 30ms** (Excellent).
- [x] **Dynamic OpenGraph Generator (`@vercel/og`)**:
  - [x] Implemented `next/og` (`ImageResponse`) edge route at `apps/home/app/api/og/route.tsx` for automatic dynamic 1200x630 social share card generation.
- [ ] **Content & Keyword Expansion (Long-Tail SEO)**:
  - [ ] Add project case studies or technical articles under `/blog` or `/projects` to target long-tail keywords (e.g. *React Native performance optimization*, *NativeBase design system architecture*).

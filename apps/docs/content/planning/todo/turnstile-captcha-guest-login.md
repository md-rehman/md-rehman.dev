---
title: "Cloudflare Turnstile CAPTCHA Protection for Anonymous Guest Sign-ins"
description: "Implementation guide and task roadmap for integrating Cloudflare Turnstile CAPTCHA with Supabase Anonymous Sign-ins"
category: "planning/todo"
order: 2
pinned: false
localOnly: true
author: "md-rehman"
updatedAt: "2026-08-18"
---

# Cloudflare Turnstile CAPTCHA for Anonymous Sign-ins 🛡️

## Objective
Enhance Supabase Anonymous Sign-in security by adding Cloudflare Turnstile CAPTCHA verification to prevent automated bot spam from creating dummy records in `auth.users`.

## Prerequisites & Dashboard Setup
1. **Cloudflare Dashboard**: Create a Turnstile Site Key & Secret Key in Cloudflare.
2. **Supabase Dashboard**:
   - Go to **Authentication > Security and Protection > CAPTCHA protection**.
   - Select **Cloudflare Turnstile**.
   - Input **Site Key** and **Secret Key**.
3. **Environment Variables**:
   - Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to `.env.local` / deployment environment variables for `apps/companion` and `apps/planner`.

## Architecture & Integration Plan

```mermaid
sequenceDiagram
    autonumber
    actor User as Guest User
    participant Page as Web Login Page (Companion/Planner)
    participant Turnstile as Turnstile Widget
    participant AuthPkg as @repo/auth Action
    participant Supabase as Supabase Auth Server

    User->>Page: Clicks "Continue as Guest"
    Page->>Turnstile: Execute challenge / obtain token
    Turnstile-->>Page: Return captchaToken string
    Page->>AuthPkg: Call loginAsGuest({ captchaToken })
    AuthPkg->>Supabase: supabase.auth.signInAnonymously({ options: { captchaToken } })
    Supabase-->>AuthPkg: Return Anonymous Auth Session (JWT)
    AuthPkg-->>Page: Set Cookies & Redirect to Home
```

## Implementation Steps

### 1. `@repo/auth` Updates
- Update `loginAsGuest(options?: { captchaToken?: string })` server action in `packages/auth/src/actions.ts`.
- Pass `captchaToken` inside `options` to `supabase.auth.signInAnonymously({ options: { captchaToken } })`.
- Update `mock.ts` mock clients to accept optional `captchaToken` parameter without failing validation.

### 2. Web UI Integration (`apps/companion` & `apps/planner`)
- Install lightweight turnstile package (e.g., `@marsidev/react-turnstile`) or add a client-side wrapper compound in `@repo/atomic-ui`.
- Render Turnstile widget on `login/page.tsx` when user interacts with guest sign in.
- Obtain `captchaToken` and pass it to the `loginAsGuest` server action.

### 3. Mobile UI Integration (`apps/companion-expo`)
- Native mobile apps: Pass captcha token using `react-native-webview` or configure mobile app client key exceptions / rate limiting in Supabase Security settings.

## Verification Checklist
- [ ] Turnstile widget renders cleanly without layout shifting.
- [ ] `signInAnonymously` succeeds when valid Turnstile token is supplied.
- [ ] Attempting `signInAnonymously` without token fails with 400 CAPTCHA error when CAPTCHA is enforced in Supabase.

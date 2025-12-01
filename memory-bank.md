Project: ibox-next (Next.js + RTK Query storefront)

High-level summary

- Purpose: Client-facing storefront with venue-specific routes, product listing, orders tracking, and client bonus lookup.
- Runtime: Next.js 15 (App Router), React 19, TypeScript.
- State and data:
  - Redux Toolkit + RTK Query for API access.
  - i18next for localization with Accept-Language header propagation.
- Styling: Tailwind CSS v4 + SCSS modules.
- Assets: Duplicated under public/assets and src/assets for web usage.
- API base: Configurable via NEXT_PUBLIC_API_BASE_URL. Default has been migrated to https://stark.adamtech.dev/api/

Run and build

- Dev: npm run dev
- Build: npm run build
- Start: npm run start
- Lint: npm run lint

Tech stack

- Framework: next@15.5.5 (App Router, turbopack)
- UI: react@19, react-dom@19, lucide-react
- State: @reduxjs/toolkit^2.9.0, react-redux^9.2.0
- Data: RTK Query (createApi/fetchBaseQuery)
- i18n: i18next, react-i18next, browser language detector, http backend
- UI libs: swiper, react-qr-code, @yudiel/react-qr-scanner, @react-input/mask
- Styles: tailwindcss@4, sass
- TS: typescript@^5, @types/\*

Key directory map

- src/app/ (Next App Router)
  - page.tsx: Landing/marketing page.
  - [venue]/: Venue-scoped routes.
    - layout.tsx: SSR metadata generation by fetching organization details.
    - [venueId]/, ref/, s/: Additional venue related routing (not fully mapped here).
  - cart/, orders/: Next-routed sections; orders/[id]/ for specific order pages.
- src/api/ (RTK Query)
  - base.ts: createApi() and fetchBaseQuery() with Accept-Language header and base URL.
  - Products.api.ts: getProducts query returning products/? querystring.
  - Categories.api.ts: categories endpoints (see file).
  - Orders.api.ts: orders endpoints (see file).
  - Venue.api.ts: organizations/{slug}/ and organizations/{slug}/table/{tableId}/
  - Client.api.ts: GET client/bonus with phone and organization slug mapping.
  - index.ts: re-exports hooks/apis.
- src/store/
  - index.ts: configureStore with baseApi middleware and &#34;yourFeature&#34; slice.
  - yourFeatureSlice.ts: project-specific state (venue, users data, etc.).
- src/client-pages/ (Legacy/compat React Router pages)
  - Main, Home, Order, Deliver, Takeaway, SelectOrderType, Scan, VenueGate, Cart, NotFound, SaveRefPage
  - Note: These use react-router-dom hooks; see src/router/compat.tsx for integration.
- src/components/
  - Header, Hero, BusketDesktop, FoodDetail, Modals, etc.
  - WS guard and route protection helpers.
- src/locales/: en, ru, kg translations.
- src/types/: categories, products, orders, venues
- src/utils/: haptics, storageUtils, timeUtils

API layer overview (RTK Query)

- Configuration: src/api/base.ts
  - const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || &#39;https://stark.adamtech.dev/api/&#39;;
  - fetchBaseQuery attaches Accept-Language header based on i18n.
  - refetchOnFocus and refetchOnReconnect enabled.
- Products.api.ts
  - getProducts({ category?, search?, organizationSlug?, spotId?, spotSlug?, venueSlug? })
  - Builds query string: products/?category=&search=&spotId=&organizationSlug=
  - Backward compatible keys: venueSlug and spotSlug.
- Venue.api.ts
  - getVenue({ venueSlug, tableId? })
  - Returns organizations/${venueSlug}/ or organizations/${venueSlug}/table/${tableId}/
- Client.api.ts
  - getClientBonus({ phone, organizationSlug?, venueSlug? })
  - GET client/bonus
  - Params: phone, organization_slug, venue_slug (mapped)
  - transformResponse ensures numeric balance and typed shape.
- Orders.api.ts, Categories.api.ts
  - Standard builder.query/ mutation patterns injecting into baseApi.

Server-side fetch (Next App Router)

- src/app/[venue]/layout.tsx
  - Updated to read base from NEXT_PUBLIC_API_BASE_URL with default fallback.
  - Fetches: ${base}organizations/${slug}/
  - Sets Metadata: title (companyName — ibox), description, icons (logo), OpenGraph/Twitter.

Environment variables

- NEXT_PUBLIC_API_BASE_URL
  - Default: https://stark.adamtech.dev/api/
  - Set in .env.local for deployment/staging as needed.
- Suggested (not yet implemented):
  - NEXT_PUBLIC_WS_BASE_URL to override WS origin if/when WS needs migration.

WebSocket notes (order status updates)

- Current usage (to be refactored/centralized if backend WS changes):
  - src/components/Hero/index.tsx: new WebSocket(`wss://ibox.kg/ws/orders/?phone_number=${user.phoneNumber}`)
  - src/client-pages/Order/index.tsx: new WebSocket(`wss://ibox.kg/ws/orders/?phone_number=${user.phoneNumber}&site=imenu`)
- Recommendation:
  - Introduce a small helper in src/utils/endpoints.ts that derives WS origin from NEXT_PUBLIC_API_BASE_URL (replace http(s) with ws(s)) or uses NEXT_PUBLIC_WS_BASE_URL, then keep path /ws/orders/ to avoid widespread code churn.
  - Use that helper in Hero and Order to remove hard-coded domain.

Branding and static links

- Marketing page includes links/emails with ibox.kg:
  - Demo link: https://ibox.kg/Exponenta
  - Email: info@ibox.kg
  - Footer copy: © {year} ibox.kg
- These are content/branding, not API calls. Change only if branding requires migration.

i18n and headers

- Accept-Language header is attached to every RTK Query request based on i18n.language or localStorage i18nextLng.
- LANGUAGES in SupHeader: RU, KG, ENG mapped to ru, kg, en. Reloads the page on change.

Types reference

- products: src/types/products.types.ts (IProduct)
- orders: src/types/orders.types.ts (IOrder, IOrderById)
- venues: src/types/venues.types.ts (IVenues)
- categories: src/types/categories.types.ts

Known API endpoints in use (relative to baseUrl)

- organizations/{slug}/
- organizations/{slug}/table/{tableId}/
- products/?category=&search=&spotId=&organizationSlug=
- client/bonus?phone=&organization_slug=&venue_slug=
- Other endpoints exist in Orders.api.ts, Categories.api.ts.

Recent migration (2025-11-21)

- Changed default REST base from https://ibox.kg/api/ to https://stark.adamtech.dev/api/
  - src/api/base.ts updated.
  - src/app/[venue]/layout.tsx SSR fetch updated to use env + fallback.
- Hard-coded WS endpoints remain at ibox.kg and should be centralized if backend WS origin changes.
- No schema changes applied yet; endpoints remain relative and compatible on the client side.

Next steps / TODOs

- Centralize WebSocket origin and build helper:
  - src/utils/endpoints.ts with deriveWsOrigin(base) and wsOrdersUrl(phone, site?)
  - Switch Hero and Order WS to this helper; add NEXT_PUBLIC_WS_BASE_URL override.
- Validate stark backend paths vs current relative endpoints:
  - Ensure products/, client/bonus, organizations/ paths exist and params match (phone, organization_slug).
- Consider replacing ad-hoc fetch calls with baseApi endpoints for consistency (where feasible).
- Confirm CORS and SSR headers with the new backend in production.
- Ensure environment is set in .env.local:
  NEXT_PUBLIC_API_BASE_URL=https://stark.adamtech.dev/api/
  # Optional if WS moves:
  # NEXT_PUBLIC_WS_BASE_URL=wss://stark.adamtech.dev
- Run QA for:
  - Products list and filters
  - Venue load (slug, optional tableId)
  - Client bonus display
  - Orders listing/details (REST) and realtime updates (WS)

Key files to start reading

- src/api/base.ts
- src/api/Products.api.ts, Client.api.ts, Venue.api.ts, Orders.api.ts, Categories.api.ts
- src/app/[venue]/layout.tsx
- src/components/Hero/index.tsx, src/client-pages/Order/index.tsx (WS usage)
- src/store/index.ts, src/store/yourFeatureSlice.ts
- src/i18n.ts, src/locales/\*

Conventions

- Prefer relative endpoints in RTK Query; baseUrl set in one place.
- Always include Accept-Language via baseApi prepareHeaders.
- Use types from src/types for strong typing of responses.
- Keep venue context in yourFeature state and pass slugs/ids into queries.

Notes for future AI sessions

- This memory bank outlines architecture, API usage, env, and the latest migration target.
- If adding endpoints, inject via baseApi to inherit headers and error handling.
- If moving WS, implement a centralized endpoints helper and minimal refactor in two components (Hero, Order).

### /search

Core search functionality (real-time search, vector search, ranking, scraping).

Include: query-engine/, reranker/, scraper/, citations/

### /chat

Conversational AI modules.

Include: context/, session/, routing/ (model switching GPT, Claude, DeepSeek, etc.)

### /recommendations

Query autocomplete, related search suggestions, personalization.

Include: autocomplete/, query-suggestions/, user-history/

### /ads

Advertising system like Google Ads + Facebook Ads.

Include: campaigns/, targeting/, dashboard/, analytics/

### /analytics

Metrics, dashboards, reports.

Include: user-metrics/, ad-metrics/, performance/

### /auth

Authentication & Authorization (Supabase + JWT + RBAC).

Include: signup/, login/, roles/, rate-limits/

### /personalization

Profiles, preferences, custom model selection.

Include: user-profiles/, settings/, feature-flags/

### /collaboration

Team/workspace features.

Include: shared-sessions/, notes/, multi-user/

### /integrations

Third-party APIs & services.

Include: huggingface/, together-ai/, cloudflare/, redis/

### /voice

Voice input/output.

Include: speech-to-text/, text-to-speech/

### /feedback

User feedback loops for answer refinement.

Include: ratings/, reporting/, learning/

### /knowledge

Knowledge base, docs, embeddings.

Include: pgvector/, faq/, datasets/

### /models

Custom LLM handling & fine-tuning.

Include: training/, routing/, inference/, evaluation/

### /ui-components

Reusable frontend blocks (Next.js + Tailwind).

Include: buttons/, cards/, modals/, charts/

### /experiments

Sandbox for testing features.

Include: a-b-tests/, prototypes/
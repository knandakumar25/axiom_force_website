# Axiom Force — web portal image.
#
# Two stages: Vite builds the static bundle, then Nginx serves it and proxies
# /api/ to the original accounts service (see nginx.conf), so the browser
# only ever talks to one origin.
FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS builder

WORKDIR /app

# Install dependencies first so the npm layer survives source-only edits.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines every VITE_* value into the bundle at build time, so the API
# base URL has to be known here rather than at runtime.
ARG VITE_API_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_URL

# Only a public browser key is accepted. Build contexts exclude all env files.
ARG VITE_CLERK_PUBLISHABLE_KEY
RUN case "$VITE_CLERK_PUBLISHABLE_KEY" in ""|pk_test_*|pk_live_*) ;; *) exit 1 ;; esac \
    && npm run build

FROM nginx:alpine@sha256:b50897d5c7b1aa08067c3d90c5e8b3e47ec4e3c91c91446f67820228f7b41e34 AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-runtime.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

USER nginx
EXPOSE 5173

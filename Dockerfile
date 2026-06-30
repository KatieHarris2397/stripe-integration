FROM mirror.gcr.io/library/node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm install

FROM mirror.gcr.io/library/node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN sed -i "s/output.*'export'/output: 'standalone'/g" next.config.* 2>/dev/null || true
RUN sed -i "s/output.*\"export\"/output: 'standalone'/g" next.config.* 2>/dev/null || true
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build

FROM mirror.gcr.io/library/node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
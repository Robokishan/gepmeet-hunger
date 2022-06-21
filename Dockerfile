# build environment
FROM node:14.18.1-alpine as deps
WORKDIR /opt/app
COPY yarn.lock ./
COPY package.json ./
RUN yarn


FROM node:14.18.1-alpine as builder
ENV NODE_OPTIONS=--max_old_space_size=2048
ENV NEXT_PUBLIC_MAIN_URL=http://65.20.75.214:8081/graphql
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build

FROM node:14.18.1-alpine as runner
WORKDIR /opt/app

# COPY --from=builder /opt/app/next-i18next.config.js ./
# COPY --from=builder /opt/app/next.config.js ./
# COPY --from=builder /opt/app/public ./public
# COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
EXPOSE 80
CMD ["node_modules/.bin/next", "start", "-p","80"]
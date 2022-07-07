# build environment
FROM node:16-alpine as deps
WORKDIR /opt/app
COPY yarn.lock package.json  ./
# Install prod dependencies
RUN yarn install --production && \
    # Cache prod dependencies
    cp -R node_modules /prod_node_modules && \
    # Install dev dependencies
    yarn install --production=false


FROM node:16-alpine as builder
ENV NODE_OPTIONS=--max_old_space_size=2048
ENV NEXT_PUBLIC_MAIN_URL=https://tanduri.kishanjoshi.dev
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . /app
RUN yarn build && \
    rm -rf node_modules

FROM node:16-alpine as runner
WORKDIR /opt/app

# COPY --from=builder /opt/app/next-i18next.config.js ./
# COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=deps /prod_node_modules ./node_modules
EXPOSE 80
CMD ["node_modules/.bin/next", "start", "-p","80"]
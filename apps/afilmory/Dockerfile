FROM node:24-alpine

ARG AFILMORY_REF=4843875f26f48343b08814e3282b3c4565a78c58

WORKDIR /app

RUN apk add --no-cache git perl libc6-compat curl wget \
  && corepack enable

RUN git init . \
  && git remote add origin https://github.com/Afilmory/Afilmory.git \
  && git fetch --depth 1 origin ${AFILMORY_REF} \
  && git checkout FETCH_HEAD \
  && git rev-parse HEAD > /app/AFILMORY_COMMIT

COPY patches/ ./patches/
COPY config.json ./config.json
COPY builder.config.ts ./builder.config.ts
COPY start.sh /usr/local/bin/afilmory-start

RUN chmod +x /usr/local/bin/afilmory-start \
  && git apply ./patches/remove-reaction-rail.patch \
  && sh ./scripts/preinstall.sh \
  && pnpm install --frozen-lockfile \
  && pnpm store prune

ENV NODE_ENV=production \
    PORT=3000 \
    PHOTO_BASE_PATH=/photos \
    PHOTO_BASE_URL=/photos \
    BUILDER_CONCURRENCY=2

EXPOSE 3000

CMD ["/usr/local/bin/afilmory-start"]

FROM node:18

RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libgif-dev \
        libpango1.0-dev \
    ; \
    rm -rf /var/lib/apt/lists/*;

COPY . /app
WORKDIR /app

RUN npm ci --omit=dev

VOLUME ["/app/cache", "/app/config"]
CMD ["node", "src/index.js"]

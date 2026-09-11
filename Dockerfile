FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy application source and assets
COPY src/ ./src/
COPY assets/ ./assets/

ENV NODE_ENV=production
ENV OTEL_SDK_DISABLED=true

CMD ["node", "--experimental-strip-types", "src/index.ts"]

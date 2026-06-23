FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM rust:1.86-slim-bookworm AS backend
WORKDIR /app
COPY backend/ .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend /app/target/release/backend .
COPY --from=frontend /frontend/dist ./dist
EXPOSE 3000
CMD ["./backend"]

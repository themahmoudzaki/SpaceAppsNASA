# --- base ---
FROM node:20-alpine AS base
WORKDIR /app
ENV PATH="/app/node_modules/.bin:$PATH"

FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- Development image ---
FROM deps AS dev
COPY . .

EXPOSE 3000 5173
CMD ["npm", "run", "dev"]

FROM deps AS build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

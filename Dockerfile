FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG VITE_AZURE_AD_CLIENT_ID=
ARG VITE_AZURE_AD_TENANT_ID=
ARG VITE_AZURE_AD_REDIRECT_URI=
ARG VITE_AZURE_AD_API_SCOPE=

ENV VITE_AZURE_AD_CLIENT_ID=$VITE_AZURE_AD_CLIENT_ID
ENV VITE_AZURE_AD_TENANT_ID=$VITE_AZURE_AD_TENANT_ID
ENV VITE_AZURE_AD_REDIRECT_URI=$VITE_AZURE_AD_REDIRECT_URI
ENV VITE_AZURE_AD_API_SCOPE=$VITE_AZURE_AD_API_SCOPE

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

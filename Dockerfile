FROM node:22.21.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build || echo "No build step"

EXPOSE 3000

CMD ["npm", "run", "dev"]

# # -----------------------------------------
# # 🏗️ Etapa 2: Build de produção (opcional)
# # -----------------------------------------
# FROM node:22.21.0 AS build
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# RUN npm run build

# # -----------------------------------------
# # 🚀 Etapa 3: Imagem final para produção
# # -----------------------------------------
# FROM node:22.21.0 AS prod
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app ./
# ENV NODE_ENV=production
# EXPOSE 3000
# CMD ["npm", "start"]

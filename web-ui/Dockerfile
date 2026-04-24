FROM node:20-alpine

WORKDIR /app

# Al estar el contexto en ./web-ui, los archivos están en la raíz
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Build for production
RUN npm run build

# Expose Next.js port
EXPOSE 3000

CMD ["npm", "start"]

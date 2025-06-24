FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate


EXPOSE  3000

CMD ["npm", "run", "dev"]
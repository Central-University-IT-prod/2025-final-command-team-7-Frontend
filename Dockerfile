FROM docker.io/node:alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["npx", "vite", "--host", "0.0.0.0"]

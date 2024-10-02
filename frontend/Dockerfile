FROM node:18.12.1 AS Production

WORKDIR /user/src/client

COPY package.json .
COPY package-lock.json .

RUN npm install --force
COPY . .

EXPOSE 3000
# RUN npm run build
CMD ["npm","start"]
# CMD ["sh","-c","npm run start"]

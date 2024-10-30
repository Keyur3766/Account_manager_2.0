FROM node:18.20.3 AS Production

WORKDIR /user/src/client 

COPY package.json .
COPY package-lock.json .

RUN npm install --force
COPY . .

RUN npm run build

EXPOSE 3000
# RUN npm run build
CMD ["npm","start"]
# CMD ["sh","-c","npm run start"]

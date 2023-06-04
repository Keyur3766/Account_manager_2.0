FROM node:18 AS Production

WORKDIR /user/src/server

COPY package.json .
COPY package-lock.json .


RUN npm install --force 


COPY . .

# RUN npm install -g html-pdf
RUN apt-get update && apt-get install -y \
    libx11-dev \
    libxkbfile-dev \
    libsecret-1-dev \
    libnss3-dev \
    libasound2-dev \
    libgtk-3-0 \
    libxss1 \
    libxtst6 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*


# RUN chmod +x /user/src/server/app/phantomjs-2.1.1-macosx/bin/phantomjs

EXPOSE 8081

# RUN npm run build

CMD ["npm","start"]
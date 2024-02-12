FROM node:17-alpine

RUN npm install -g nodemon


WORKDIR /app

# workdirectory로 copy하기 (app folder로)
COPY package.json .

#npm install하기
RUN npm install

#src에 있는 모든 파일들을 복사해서 /app에 넣기 
# 코드 변경될 것을 대비해 가장 밑에 
COPY . .

#아래의 포트 넘버로 컨테이너가 노출됨
EXPOSE 5001


CMD ["npm", "start"]
FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
  && npm prune --production

########################################################################################################################

FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

COPY ./prisma/schema.prisma ./prisma/schema.prisma
COPY ./prisma/migrations/ ./prisma/migrations/
RUN npx prisma generate

CMD ["npm", "run", "start:prod-migrate"]
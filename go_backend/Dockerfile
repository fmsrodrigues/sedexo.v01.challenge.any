FROM golang:1.21.5-alpine as builder

WORKDIR /home/go
COPY . .

RUN go mod download
RUN go mod verify
RUN go build -C ./cmd/web -o server

FROM golang:1.21.5-alpine

ENV APP_HOME /home/go
WORKDIR "$APP_HOME"

COPY --from=builder "$APP_HOME"/.env $APP_HOME
COPY --from=builder "$APP_HOME"/cmd/web/server $APP_HOME

EXPOSE 3334
CMD ["./server"]
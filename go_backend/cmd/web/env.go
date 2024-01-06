package main

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Environment struct {
	PORT string

	DATABASE_HOST string
	DATABASE_PORT string
	DATABASE_USER string
	DATABASE_PASS string
	DATABASE_NAME string
	DATABASE_URL  string

	FRETE_RAPIDO_API_CNPJ       string
	FRETE_RAPIDO_API_TOKEN      string
	FRETE_RAPIDO_API_PLATAFORMA string
	FRETE_RAPIDO_API_CEP        int
}

func (env *Environment) loadEnvironment() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	env.PORT = os.Getenv("PORT")

	env.DATABASE_HOST = os.Getenv("DATABASE_HOST")
	env.DATABASE_PORT = os.Getenv("DATABASE_PORT")
	env.DATABASE_USER = os.Getenv("DATABASE_USER")
	env.DATABASE_PASS = os.Getenv("DATABASE_PASS")
	env.DATABASE_NAME = os.Getenv("DATABASE_NAME")
	env.DATABASE_URL = os.Getenv("DATABASE_URL")

	env.FRETE_RAPIDO_API_CNPJ = os.Getenv("FRETE_RAPIDO_API_CNPJ")
	env.FRETE_RAPIDO_API_TOKEN = os.Getenv("FRETE_RAPIDO_API_TOKEN")
	env.FRETE_RAPIDO_API_PLATAFORMA = os.Getenv("FRETE_RAPIDO_API_PLATAFORMA")
	env.FRETE_RAPIDO_API_CEP, err = strconv.Atoi(os.Getenv("FRETE_RAPIDO_API_CEP"))
	if err != nil {
		log.Fatal("Error converting FRETE_RAPIDO_API_CEP to int")
	}
}

func NewEnvironment() *Environment {
	env := &Environment{}
	env.loadEnvironment()
	return env
}

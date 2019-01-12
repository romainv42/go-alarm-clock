package main

import (
	"log"
	"net/http"

	"alarm"
)

func main() {

	http.Handle("/", http.FileServer(http.Dir("./assets")))

	log.Fatal(http.ListenAndServe(":8081", nil))
	alarm.Load()
}

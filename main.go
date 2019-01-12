package main

import (
	"log"
	"net/http"

	"github.com/romainv42/go-alarm-clock/alarm"
)

func main() {
	alarm.Load()
	http.Handle("/", http.FileServer(http.Dir("./assets")))

	log.Fatal(http.ListenAndServe(":8081", nil))
}

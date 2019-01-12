package main

import (
	// "log"
	// "net/http"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/romainv42/go-alarm-clock/alarm"
)

func main() {
	for i, nxt := range alarm.Load() {
		fmt.Print(i)
		fmt.Println(nxt.CronExpression.Next(time.Now()))
	}

	http.Handle("/", http.FileServer(http.Dir("./assets")))

	log.Fatal(http.ListenAndServe(":8081", nil))
}

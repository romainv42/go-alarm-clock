package main

import (
	"net/http"
	"strings"
)

func main() {
	http.Post("http://localhost:8081/event", "application/json", strings.NewReader("{ \"kind\":\"alarm\", \"message\":\"\"}"))
}

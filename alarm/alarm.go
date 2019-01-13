package alarm

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gorhill/cronexpr"
	"github.com/julienschmidt/httprouter"
)

// Rule store cron parse result and other things
type Rule struct {
	CronExpression *cronexpr.Expression
	Enable         bool
	Special        bool
}

// Router provides method to manage alarms rules
func Router(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	rules := load()
	fmt.Println("Router called:", r.URL.Path)
	if r.Method == "GET" {

		item := ps.ByName("method")
		if item == "next" {
			fmt.Println("next called")

			var min int64
			for idx, r := range rules {
				fmt.Println(r.CronExpression.Next(time.Now()), r.CronExpression.Next(time.Now()).UnixNano())
				n := r.CronExpression.Next(time.Now()).UnixNano()
				if n < min || idx == 0 {
					min = n
				}
			}
			if min > 0 {
				fmt.Println("Next found: ", min)
				w.Header().Set("content-type", "application/json")

				fmt.Fprintf(w, "{\"next\": %d}", min/1000000)
			} else {
				http.NotFound(w, r)
				fmt.Println("Not found")

			}
		}
	}
}

// Load Crontab
func load() []Rule {
	b, err := ioutil.ReadFile("crontab.txt")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	str := string(b)
	rules := make([]Rule, 0)
	regex := regexp.MustCompile("[0-9*/LW -]+(SUN|MON|TUE|WED|THU|FRI|SAT)?")
	for idx, row := range strings.Split(str, "\n") {
		if cr := regex.FindString(row); cr != "" {
			defer func() {
				if r := recover(); r != nil {
					fmt.Println("Following line malformed: ", idx)
				}
			}()
			parsed := cronexpr.MustParse(cr)
			rules = append(rules, Rule{parsed, strings.HasPrefix(cr, "#"), false})
		}
	}
	return rules

}

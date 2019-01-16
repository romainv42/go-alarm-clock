package alarm

import (
	"encoding/json"
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
	Source         string `json:"expression"`
	CronExpression *cronexpr.Expression
	Enable         bool `json:"enable"`
	Special        bool `json:"special"`
}

// PutRouter provides API to save alarm informations
func PutRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

}

// GetRouter provides API to retrieve alarm informations
func GetRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if rules := load(); rules != nil {
		fmt.Println("Router called:", r.URL.Path)
		if r.Method == "GET" {
			item := ps.ByName("method")
			switch item {
			case "next":
				if n := loadNext(rules); n != nil {
					w.Header().Set("content-type", "application/json")
					fmt.Fprintf(w, "{\"next\": %d}", *n)
				} else {
					http.NotFound(w, r)
					fmt.Println("Not found")
				}
				break
			case "list":
				json, err := json.Marshal(&rules)
				if err != nil {
					http.Error(w, "An error occured", 500)
				}
				w.Header().Set("content-type", "application/json")
				fmt.Fprintf(w, string(json))
			}
		}
	} else {
		http.NotFound(w, r)
		fmt.Println("Not found")
	}
}

func loadNext(rules []Rule) *int {
	var min *int64
	for _, r := range rules {
		if !r.Enable {
			continue
		}
		fmt.Println(r.CronExpression.Next(time.Now()), r.CronExpression.Next(time.Now()).UnixNano())
		n := r.CronExpression.Next(time.Now()).UnixNano()
		if min == nil || n < *min {
			min = &n
		}
	}
	if min != nil {
		value := int(*min / 1000000)
		return &value
	}
	return nil
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
			rules = append(rules, Rule{cr, parsed, !strings.HasPrefix(row, "#"), false})
		}
	}
	return rules
}

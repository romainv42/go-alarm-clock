package alarm

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"crypto/sha1"

	"github.com/gorhill/cronexpr"
	"github.com/julienschmidt/httprouter"
)

// Rule store cron parse result and other things
type Rule struct {
	Source         string `json:"expression"`
	CronExpression *cronexpr.Expression
	Enable         bool   `json:"enable"`
	Command        string `json:"command"`
}

// DeleteRouter provides API to remove an alarm
func DeleteRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("Router called:", r.URL.Path)

	var bodyParsed struct {
		Checksum string `json:"checksum"`
	}
	error := json.NewDecoder(r.Body).Decode(&bodyParsed)
	if error != nil {
		http.Error(w, "Unable to parse body", 400)
		return
	}
	if rules := load(); rules != nil {
		index, error := strconv.Atoi(ps.ByName("rowIndex"))
		if error != nil || index >= len(rules) {
			http.Error(w, "Bad Parameter", 400)
			return
		}

		origin, error := json.Marshal(rules)
		if error != nil {
			http.Error(w, "An error occured", 500)
			return
		}

		checksum := fmt.Sprintf("%x", sha1.Sum(origin))

		if checksum != bodyParsed.Checksum {
			http.Error(w, "Crontab changed. Please reload", 409)
			return
		}
		rules = append(rules[:index], rules[index+1:]...)
		if save(rules) {
			fmt.Println("Done")
			w.Header().Set("content-type", "application/json")
			fmt.Fprintf(w, "{ \"operation\": \"success\" }")
		} else {
			http.Error(w, "An error occured while trying to save", 500)
		}
	} else {
		http.Error(w, "An error occured while trying to save", 500)
	}
}

// SaveRouter provides API to save alarm informations
func SaveRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("Router called:", r.URL.Path)

	var bodyParsed struct {
		Rule     Rule   `json:"data"`
		Checksum string `json:"checksum"`
	}
	error := json.NewDecoder(r.Body).Decode(&bodyParsed)
	if error != nil {
		http.Error(w, "Unable to parse body", 400)
		return
	}
	if rules := load(); rules != nil {
		origin, error := json.Marshal(rules)
		if error != nil {
			http.Error(w, "An error occured", 500)
			return
		}

		checksum := fmt.Sprintf("%x", sha1.Sum(origin))

		if checksum != bodyParsed.Checksum {
			http.Error(w, "Crontab changed. Please reload", 409)
			return
		}
		if paramIndex := ps.ByName("rowIndex"); len(paramIndex) > 0 {
			index, error := strconv.Atoi(paramIndex)
			if error != nil || index >= len(rules) {
				http.Error(w, "Bad Parameter", 400)
				return
			}

			rules[index] = bodyParsed.Rule
		} else {
			rules = append(rules, bodyParsed.Rule)
		}
		if save(rules) {
			fmt.Println("Done")
			w.Header().Set("content-type", "application/json")
			fmt.Fprintf(w, "{ \"operation\": \"success\" }")
		} else {
			http.Error(w, "An error occured while trying to save", 500)
		}
	} else {
		http.Error(w, "An error occured while trying to save", 500)
	}
}

// GetRouter provides API to retrieve alarm informations
func GetRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if rules := load(); rules != nil {
		fmt.Println("Router called:", r.URL.Path)
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
			data, err := json.Marshal(&rules)
			if err != nil {
				http.Error(w, "An error occured", 500)
			}
			checksum := sha1.Sum(data)
			w.Header().Set("content-type", "application/json")
			fmt.Fprintf(w, "{ \"data\": %s, \"checksum\": \"%x\" }", string(data), checksum)
		}
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
	regex := regexp.MustCompile("[# ]*[0-9*/LW, -]+(SUN|MON|TUE|WED|THU|FRI|SAT)?")
	for idx, row := range strings.Split(str, "\n") {
		if cr := regex.FindString(row); cr != "" {
			defer func() {
				if r := recover(); r != nil {
					fmt.Println("Following line malformed: ", idx)
				}
			}()
			command := regex.ReplaceAllString(row, "")
			fmt.Println(command)
			enabled := !strings.HasPrefix(cr, "#")
			cr = strings.TrimSpace(strings.Replace(cr, "#", "", 1))
			parsed := cronexpr.MustParse(cr)
			rules = append(rules, Rule{cr, parsed, enabled, command})
		}
	}
	return rules
}

func save(rules []Rule) bool {
	f, error := os.Create("crontab.txt")
	if error != nil {
		fmt.Println(error)
		return false
	}
	defer f.Close()

	for _, rule := range rules {
		var s string
		if rule.Enable {
			s = fmt.Sprintf("%s %s\n", rule.Source, rule.Command)
		} else {
			s = fmt.Sprintf("# %s %s\n", rule.Source, rule.Command)
		}

		if _, error := f.WriteString(s); error != nil {
			fmt.Println(error)
			return false
		}
	}
	f.Sync()
	return true
}

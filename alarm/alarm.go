package alarm

import (

	// "time"
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"

	"github.com/gorhill/cronexpr"
)

// Rule store cron parse result and other things
type Rule struct {
	CronExpression *cronexpr.Expression
	Enable         bool
	Special        bool
}

// Load Crontab
func Load() []Rule {
	b, err := ioutil.ReadFile("crontab.txt")
	if err != nil {
		fmt.Println(err)
		return nil
	}
	str := string(b)
	rules := make([]Rule, 0)
	regex := regexp.MustCompile("[0-9*/LW -]+(SUN|MON|TUE|WED|THU|FRI|SAT)?")
	for idx, row := range strings.Split(str, "\n") {
		fmt.Println("Row ", idx, row)
		if cr := regex.FindString(row); cr != "" {
			fmt.Println("Found: ", cr)
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

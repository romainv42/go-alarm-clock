package alarm

import (
	// "github.com/gorhill/cronexpr"
	// "time"
	"fmt"
	"io/ioutil"
)

func Load() {
	b, err := ioutil.ReadFile("./crontab.txt")
	if err != nil {
		fmt.Println(err)
		return
	}
	str := string(b)
	fmt.Println(str)
}

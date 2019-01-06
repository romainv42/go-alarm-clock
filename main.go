package main

import (
	"flag"
	"github.com/asticode/go-astilectron"
	"github.com/asticode/go-astilectron-bootstrap"

	"github.com/asticode/go-astilog"
)

// Vars
var (
	AppName string
	BuiltAt string
	debug   = flag.Bool("d", false, "enables the debug mode")
)

func main() {
	// Init
	flag.Parse()
	astilog.Out(astilog.Configuration{
		Out: astilog.OutStdOut,
	})
	astilog.FlagInit()

	// Run bootstrap
	if err := bootstrap.Run(bootstrap.Options{
		Asset: Asset,
		AstilectronOptions: astilectron.Options{
			AppName:            AppName,
		},
		Debug:         true,
		RestoreAssets: RestoreAssets,
		Windows: []*bootstrap.Window{{
			Homepage:       "index.html",
			MessageHandler: handleMessages,
			Options: &astilectron.WindowOptions{
				BackgroundColor: astilectron.PtrStr("#333"),
				Center:          astilectron.PtrBool(true),
				Height:          astilectron.PtrInt(360),
				Width:           astilectron.PtrInt(480),
				AlwaysOnTop:	 astilectron.PtrBool(true),
				Fullscreen:		 astilectron.PtrBool(true),
			},
		}},
	}); err != nil {
		astilog.Fatal(err)
	}
}

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/sunshineplan/metadata"
	"github.com/vharitonsky/iniflags"
)

const api = "https://api.ipdata.co/%s?api-key=%s"

var apiKey string
var config metadata.Config

func main() {
	self, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	flag.StringVar(&config.Server, "server", "", "Metadata Server Address")
	flag.StringVar(&config.VerifyHeader, "header", "", "Verify Header Header Name")
	flag.StringVar(&config.VerifyValue, "value", "", "Verify Header Value")
	unix := flag.String("unix", "", "Server Host")
	host := flag.String("host", "127.0.0.1", "Server Host")
	port := flag.String("port", "12345", "Server Port")
	logPath := flag.String("log", "/var/log/app/myip-go.log", "Log Path")
	iniflags.SetConfigFile(filepath.Join(filepath.Dir(self), "config.ini"))
	iniflags.SetAllowMissingConfigFile(true)
	iniflags.Parse()

	m, err := config.Get("myip_api_key")
	if err != nil {
		log.Fatal(err)
	}
	if err := json.Unmarshal(m, &apiKey); err != nil {
		log.Fatal(err)
	}

	if *logPath != "" {
		f, err := os.OpenFile(*logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0640)
		if err != nil {
			log.Fatalln("Failed to open log file:", err)
		}
		gin.DefaultWriter = f
		gin.DefaultErrorWriter = f
		log.SetOutput(f)
	}

	router := gin.Default()
	router.StaticFS("/static", http.Dir(filepath.Join(filepath.Dir(self), "static")))
	router.LoadHTMLGlob(filepath.Join(filepath.Dir(self), "templates/*"))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"key": apiKey})
	})

	router.GET("/query", func(c *gin.Context) {
		var resp *http.Response
		var body []byte
		remote := c.ClientIP()
		query := c.DefaultQuery("ip", "")
		if query == "" {
			resp, err = http.Get(fmt.Sprintf(api, remote, apiKey))
		} else {
			ip, err := net.LookupIP(query)
			if err != nil {
				c.JSON(400, gin.H{"message": err.Error()})
				return
			}
			resp, err = http.Get(fmt.Sprintf(api, ip[0], apiKey))
		}
		if err != nil {
			c.JSON(500, gin.H{"message": err.Error()})
			return
		}
		body, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			c.JSON(500, gin.H{"message": err.Error()})
			return
		}
		c.Data(resp.StatusCode, "application/json", body)
	})

	if *unix != "" && runtime.GOOS == "linux" {
		if _, err := os.Stat(*unix); err == nil {
			if err := os.Remove(*unix); err != nil {
				log.Fatal(err)
			}
		}

		listener, err := net.Listen("unix", *unix)
		if err != nil {
			log.Fatal(err)
		}

		idleConnsClosed := make(chan struct{})
		go func() {
			quit := make(chan os.Signal, 1)
			signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
			<-quit

			if err := listener.Close(); err != nil {
				log.Printf("HTTP Listener close: %v", err)
			}
			if err := os.Remove(*unix); err != nil {
				log.Printf("Remove socket file: %v", err)
			}
			close(idleConnsClosed)
		}()

		if err := os.Chmod(*unix, 0666); err != nil {
			log.Fatal(err)
		}

		http.Serve(listener, router)
		<-idleConnsClosed
	} else {
		router.Run(*host + ":" + *port)
	}
}

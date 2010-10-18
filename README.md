## What is this
View and debug webos applications installed on your emulator in your browser.

## How to get started
* rake generate - to generate sample hello world application
* rake tunnel - to create tunnel for emulators webserver
* rake server[hello] - to start monitoring (assumes you have nodejs and common libs)
* point your browser to http://localhost:3000

now if you modify files in ./hello your browser view should refresh automatically

## Features
* Allows you to use chrome js debugger 
* Gives you command line access to Mojo via Chrome js console
* Picks-up modifications you make to your application, autorefreshes view






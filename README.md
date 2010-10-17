## Instructions
Use this to run your webos applications in the browser

	* rake run to build, package, deploy and run application on emulator
	* mkdir remote - use as mountpoint for application on emulator
	* rake mountapp[hello]  - to mount app (assumes rails, i.e. active_support is present)
	* rake server[hello,remote]  - to start the monitoring  (assumes you have nodejs and common libs)
	* rake tunnel - to create tunnel for emulators webserver
	* point your browser to http://localhost:3000

now if you modify files in hello/ your browser view should refresh automatically



host = ENV['HOST'] || 'localhost'

desc "generate sample hello app"
task :generate do
	sh "palm-generate -t hello_app hello"
end

desc "package, install, run and log"
task :run do
	sh "palm-package hello"
	sh "palm-install com.yourdomain.hello_1.0.0_all.ipk"
	sh "palm-launch com.yourdomain.hello"
	sh "palm-log -f com.yourdomain.hello"
end

desc "mount a remote directory on the emulator"
task :mount, [:remote] do |t,args|
	exit unless args.remote
	sh "sshfs -p 5522 root@#{host}:#{args[:remote]} remote"
end


desc "mount a remote application"
task :mountapp, [:app] do |t,args|
	exit unless args.app
	require 'active_support'
	sh "mkdir -p remote"
	app_info_str = IO.read("#{args.app}/appinfo.json")
	app_info = ActiveSupport::JSON.decode(app_info_str)
	path = "/media/cryptofs/apps/usr/palm/applications/#{app_info['id']}"
	sh "sshfs -p 5522 root@#{host}:#{path} remote"
end

desc "umount a remote directory"
task :umount do |t, args|
	sh "fusermount -u remote"
end

desc "tunnel centaur to localhost:5581"
task "tunnel" do
	sh "ssh -p 5522  -L5581:#{host}:8080 root@#{host}"
	sh "rmdir remote"
end

desc "run the node server"
task :server, :app, :needs => :mountapp do |t,args|
	exit unless args[:app] 
	sh "node lib/app.js #{args[:app]} remote"
	at_exit do
		Rake::Task['umount'].invoke
		sh "rmdir remote"
	end
end


desc "rsync source to target"
task :rsync, [:source,:target] do |t,args|
	exit unless args[:source] and args[:target]
	sh "rsync -av #{args[:source]} #{args[:target]}"
end

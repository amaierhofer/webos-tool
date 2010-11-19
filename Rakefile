require 'active_support'
require 'active_support/hash_with_indifferent_access'

host = ENV['HOST'] || 'localhost'
remote = ENV['REMOTE'] || './remote'
app = ENV['APP'] || './hello'

string = <<EOF
  <script src="http://localhost:3000/javascripts/jquery.js" type="text/javascript"></script>
  <script src="http://localhost:3000/javascripts/socket.io.js" type="text/javascript"></script>
  <script src="http://localhost:3000/javascripts/ws.js" type="text/javascript"></script>
  </head>
EOF

def parse_appinfo(app)
  app_info_str = IO.read("#{app}/appinfo.json")
  ActiveSupport::JSON.decode(app_info_str)
end

task :default do
  sh "rake -T"
end

namespace :palm do
  desc "generate sample hello world to #{app}"
  task :generate do
    sh "palm-generate -t hello_app #{app}"
    str = IO.read "#{app}/index.html"
    str.gsub! /<\/head>/, string
    File.open("#{app}/index.html", "w") {|f| f.puts str}
    Rake::Task['palm:install'].invoke
    puts "Create new application #{app}"
  end

  desc "install application on emulator"
  task :install do
    sh "palm-package hello"
    sh "palm-install com.yourdomain.hello_1.0.0_all.ipk"
    sh "rm com.yourdomain.hello_1.0.0_all.ipk"
  end

  desc "package, install, run and log"
  task :run => :install do
    sh "palm-launch com.yourdomain.hello"
    sh "palm-log -f com.yourdomain.hello"
  end
end

namespace :ssh do
  desc "mount a directory on the emulator to #{remote}"
  task :mount, [:remote] do |t,args|
    exit unless args.remote
    sh "sshfs -p 5522 root@#{host}:#{args[:remote]} #{remote}"
  end

  desc "mount a application :appname to #{remote}"
  task :app, [:appname] do |t,args|
    exit unless args.appname
    sh "mkdir -p #{remote}"
    path = "/media/cryptofs/apps/usr/palm/applications/#{app_info['id']}"
    sh "sshfs -p 5522 root@#{host}:#{path} #{remote}"
  end

  desc "umount #{remote}"
  task :umount do |t, args|
    sh "fusermount -u #{remote}"
    sh "rmdir #{remote}"
  end

  desc "tunnel centaur to localhost:5581"
  task "tunnel" do
    sh "ssh -p 5522  -L5581:#{host}:8080 root@#{host}"
  end
end

namespace :node do
  desc "run the node server"
  task :run, :app do |t,args|
    #task :server, :app, :needs => :mountapp do |t,args|
    exit unless args[:app] 
    sh "node lib/app.js #{args[:app]} #{remote}"
  end
end


require_relative "../../api/server"

RSpec.configure do |config|
  config.before(:suite) do
    fork do
      Rackup::Server.start(app: ApiServer, Port: ApiServer::API_SERVER_PORT, pid: ApiServer::API_SERVER_PID,
                           daemonize: true)
    end
    sleep(1)
  end

  config.after(:suite) do
    Process.kill("HUP", File.read(ApiServer::API_SERVER_PID).to_i)
    FileUtils.rm_f(ApiServer::API_SERVER_PID)
  end
end

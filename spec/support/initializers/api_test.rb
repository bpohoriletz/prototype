require_relative "../../api/server"

RSpec.configure do |config|
  config.before(:suite) do
    fork { Rackup::Server.start(app: ApiServer, Port: ApiServer::API_SERVER_PORT, pid: ApiServer::API_SERVER_PID) }
  end

  config.after(:suite) do
    Process.kill("HUP", File.read(API_SERVER_PID).to_i)
    File.delete(API_SERVER_PID)
  end
end

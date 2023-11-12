require "rack/app"

# A replacement of actual server
class ApiServer < Rack::App
  API_SERVER_PID = Rails.root.join("spec/api/server.pid")
  API_SERVER_PORT = 9292

  desc "healthcheck"
  get "/up" do
    "Yup!"
  end

  get "/shutdown" do
    exit!
  end
end

require "rack/app"

# log to file
Rack::App::Extension.register(:file_logger) do
  require "logger"
  require "securerandom"

  define_method(:file_logger) do
    @file_logger ||= Rack::App::Logger.new(File.expand_path("#{__dir__}/test.log"), 1, 5_242_880).tap do |this|
      this.id = request.env["HTTP_X_REQUEST_ID"]
    end
  end

  before { file_logger }
end

# A replacement of actual server
class ApiServer < Rack::App
  API_SERVER_PID = File.expand_path("#{__dir__}/server.pid")
  API_SERVER_PORT = 9292
  apply_extensions :file_logger

  before { file_logger.info([ "#{request.request_method} #{request.path}", request.params ].join("\n")) }

  desc "healthcheck"
  get "/up" do
    "Yup!"
  end

  get "/shutdown" do
    exit!
  end
end

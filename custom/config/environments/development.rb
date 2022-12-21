# frozen_string_literal: true

Rails.application.configure do
  #######################################################################
  #                                                                     #
  #                                                                     #
  #                    Customization                                    #
  #                                                                     #
  #                                                                     #
  #######################################################################
  config.action_mailer.default_url_options = { host: "localhost", port: 3000 }
end

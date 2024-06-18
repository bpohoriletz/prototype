Rails.application.configure do
  ############################################################################
  #                                                                          #
  #                             CUSTOMIZATION                                #
  #                                                                          #
  ############################################################################
  config.action_mailer.default_url_options = { host: :localhost }
  config.action_mailer.raise_delivery_errors = false
end

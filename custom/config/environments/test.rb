# frozen_string_literal: true

Rails.application.configure do
  ############################################################################
  #                                                                          #
  #                             CUSTOMIZATION                                #
  #                                                                          #
  ############################################################################
  config.action_mailer.default_url_options = { host: :localhost }
end

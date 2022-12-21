# frozen_string_literal: true

# disable :reek:IrresponsibleModule
class ApplicationMailer < ActionMailer::Base # :nodoc:
  default from: "from@example.com"
  layout "mailer"
end

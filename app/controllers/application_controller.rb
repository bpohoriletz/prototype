# frozen_string_literal: true

# disable :reek:IrresponsibleModule
class ApplicationController < ActionController::Base # :nodoc:
  before_action :authenticate_account!
end

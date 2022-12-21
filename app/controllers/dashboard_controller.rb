# frozen_string_literal: true

# disable :reek:IrresponsibleModule
class DashboardController < ApplicationController # :nodoc:
  def index
    respond_to(&:html)
  end
end

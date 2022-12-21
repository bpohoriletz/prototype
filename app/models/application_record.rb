# frozen_string_literal: true

# disable :reek:IrresponsibleModule
class ApplicationRecord < ActiveRecord::Base # :nodoc:
  primary_abstract_class
end

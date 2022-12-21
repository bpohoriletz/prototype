# frozen_string_literal: true

module Prototype
  # disable :reek:IrresponsibleModule
  class Application < Rails::Application # :nodoc:
    ######################################################################
    #                                                                    #
    #                                                                    #
    #                        Customization                               #
    #                                                                    #
    #                                                                    #
    ######################################################################
    config.generators do |generators|
      generators.system_tests = nil
      generators.factory_bot dir: "spec/factories"
    end
  end
end

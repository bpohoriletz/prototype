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

    initializer "load_custom_initializers", after: :load_config_initializers do
      Dir[File.join(File.dirname(__FILE__), "initializers", "**", "*.rb")].each { |file| require file }
    end
  end
end

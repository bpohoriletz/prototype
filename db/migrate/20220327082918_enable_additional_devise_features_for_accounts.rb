# frozen_string_literal: true

# Enable additional features for Accont model
class EnableAdditionalDeviseFeaturesForAccounts < ActiveRecord::Migration[7.0]
  def change # rubocop:disable Metrics/MethodLength
    change_table :accounts, bulk: true do |table|
      # Trackable
      table.integer  :sign_in_count, default: 0, null: false
      table.datetime :current_sign_in_at
      table.datetime :last_sign_in_at
      table.string   :current_sign_in_ip
      table.string   :last_sign_in_ip
      # Confirmable
      table.string   :confirmation_token
      table.datetime :confirmed_at
      table.datetime :confirmation_sent_at
      table.string   :unconfirmed_email # Using reconfirmable
      # Lockable
      table.integer  :failed_attempts, default: 0, null: false # Lock strategy is :failed_attempts
      table.string   :unlock_token # Unlock strategy is :email or :both
      table.datetime :locked_at
    end

    add_index :accounts, :confirmation_token,   unique: true
    add_index :accounts, :unlock_token,         unique: true
  end
end

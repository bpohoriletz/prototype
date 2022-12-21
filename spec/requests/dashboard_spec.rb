# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Dashboard" do
  describe "GET /index" do
    it "renders status text" do
      sign_in create(:account)
      get "/"

      expect(response).to have_http_status(:ok)
    end
  end
end

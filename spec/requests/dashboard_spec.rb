require "rails_helper"

RSpec.describe "Dashboard" do
  describe "GET /index" do
    it "renders status text" do
      login_as create(:account), scope: :accounts
      get "/"

      expect(response).to have_http_status(:found)
    end
  end
end

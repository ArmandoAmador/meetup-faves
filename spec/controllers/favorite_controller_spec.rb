require 'rails_helper'

RSpec.describe FavoritesController, type: :controller do
  describe 'GET #index' do
    it 'assigns @favorites' do
      favorite = FactoryGirl.create(:favorite)
      get :index, format: :json
      expect(assigns(:favorites)).to eq([favorite])
    end
  end

  describe 'POST #create' do
    context 'when is not created' do
      before(:each) do
        @favorite_attributes = {
          month: 'May',
          date: 10,
          name: 'Est vel ut accusantium repellendus.',
          group_name: 'Rerum maiores omnis quos minus vel facilis culpa.',
          yes_rsvp_count: 70,
          who: 'Et quod et voluptatem sit unde est.'
        }
        post :create, favorite: @favorite_attributes, format: :json
      end

      it 'renders an error json' do
        favorite_response = json_response
        expect(favorite_response).to have_key(:errors)
      end

      it 'renders the json errors on why the favorite creation was unsuccessful' do
        favorite_response = json_response
        expect(favorite_response[:errors][:meetup_id]).to include(
          "can't be blank"
        )
      end

      it { should respond_with 422 }
    end

    context 'when it is successfully created' do
      before(:each) do
        @favorite_attributes = FactoryGirl.attributes_for(:favorite)
        post :create, favorite: @favorite_attributes, format: :json
      end

      it 'renders the json response for the favorite record just created' do
        favorite_response = json_response[:favorite]
        expect(favorite_response[:name]).to eql @favorite_attributes[:name]
      end

      it { is_expected.to respond_with 201 }
    end
  end

  describe 'DELETE #destroy' do
    before(:each) do
      @favorite = FactoryGirl.create :favorite
      delete :destroy, id: @favorite
    end

    it { is_expected.to respond_with 204 }
  end
end

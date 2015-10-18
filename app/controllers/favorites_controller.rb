class FavoritesController < ApplicationController
  respond_to :json

  def index
    @favorites = Favorite.all
    render json: @favorites, root: :results, meta: { count: @favorites.count }
  end

  def create
    favorite = Favorite.new(favorite_params)
    if favorite.save
      render json: favorite, status: 201, location: [favorite]
    else
      render json: { errors: favorite.errors }, status: 422
    end
  end

  def destroy
    Favorite.find_by(meetup_id: params[:id]).destroy
    head 204
  end

  private

  def favorite_params
    params.require(:favorite).permit(
      :month, :date, :name, :group_name, :yes_rsvp_count, :who, :meetup_id, :event_url
    )
  end
end

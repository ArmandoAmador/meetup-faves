class FavoriteSerializer < ActiveModel::Serializer
  attributes :id

  def id
    object.meetup_id
  end

end

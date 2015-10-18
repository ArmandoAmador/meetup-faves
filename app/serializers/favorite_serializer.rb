class FavoriteSerializer < ActiveModel::Serializer
  attributes :id, :month, :date, :event_url, :name, :group, :yes_rsvp_count

  def id
    object.meetup_id
  end

  def group
    {
      name: object.group_name,
      who: object.who
    }
  end
end

class Favorite < ActiveRecord::Base

  validates :meetup_id, uniqueness: true, presence: true

  def to_param
    meetup_id
  end
end

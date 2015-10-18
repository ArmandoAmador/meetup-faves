class Favorite < ActiveRecord::Base
  validates(
    :month, :date, :name, :group_name,
    :yes_rsvp_count, :who, :event_url, :meetup_id,
    presence: true
  )

  validates :meetup_id, uniqueness: true

  validates :month, inclusion: {
    in: Date::ABBR_MONTHNAMES.compact,
    message: '%{value} is not a valid month'
  }

  validates_numericality_of(
    :date,
    only_integer: true,
    greater_than_or_equal_to: 1, less_than_or_equal_to: 31
  )

  validates_numericality_of :yes_rsvp_count, only_integer: true

  def to_param
    meetup_id
  end
end

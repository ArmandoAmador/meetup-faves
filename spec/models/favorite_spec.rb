require 'rails_helper'

RSpec.describe Favorite, type: :model do
  let(:favorite) { FactoryGirl.build(:favorite) }

  subject { favorite }

  it { is_expected.to respond_to(:month) }
  it { is_expected.to respond_to(:date) }
  it { is_expected.to respond_to(:name) }
  it { is_expected.to respond_to(:group_name) }
  it { is_expected.to respond_to(:yes_rsvp_count) }
  it { is_expected.to respond_to(:who) }
  it { is_expected.to respond_to(:meetup_id) }
  it { is_expected.to respond_to(:event_url) }

  it { is_expected.to validate_presence_of(:month) }
  it { is_expected.to validate_presence_of(:date) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:group_name) }
  it { is_expected.to validate_presence_of(:yes_rsvp_count) }
  it { is_expected.to validate_presence_of(:who) }
  it { is_expected.to validate_presence_of(:event_url) }

  it { is_expected.to validate_uniqueness_of(:meetup_id) }

  it { is_expected.to validate_inclusion_of(:month).in_array(Date::ABBR_MONTHNAMES.compact) }

  it { is_expected.to validate_numericality_of(:date).only_integer }
  it { is_expected.to validate_numericality_of(:date).is_less_than_or_equal_to(31) }
  it { is_expected.to validate_numericality_of(:date).is_greater_than_or_equal_to(1) }
  it { is_expected.to validate_numericality_of(:yes_rsvp_count).only_integer }
end

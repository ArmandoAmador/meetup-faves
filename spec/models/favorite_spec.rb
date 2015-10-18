require 'rails_helper'

RSpec.describe Favorite, type: :model do
  let(:favorite) { FactoryGirl.build(:favorite) }

  subject { favorite }

  it { is_expected.to respond_to(:meetup_id) }
  it { is_expected.to validate_presence_of(:meetup_id) }
  it { is_expected.to validate_uniqueness_of(:meetup_id) }
end

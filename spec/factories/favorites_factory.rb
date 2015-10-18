FactoryGirl.define do
  factory :favorite do
    meetup_id { FFaker::Identification.ssn }
  end
end

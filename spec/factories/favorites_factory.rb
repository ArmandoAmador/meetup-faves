FactoryGirl.define do
  factory :favorite do
    month { Date::ABBR_MONTHNAMES[rand(1..12)] }
    date { rand(1..31) }
    name { FFaker::Lorem.sentence }
    group_name  { FFaker::Lorem.sentence }
    yes_rsvp_count { rand(1..100) }
    who { FFaker::Lorem.sentence }
    event_url { FFaker::InternetSE.http_url }
    meetup_id { FFaker::Identification.ssn }
  end
end

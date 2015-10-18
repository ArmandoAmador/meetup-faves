class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.string :meetup_id, null: false
      t.timestamps null: false
    end
    add_index :favorites, :meetup_id, unique: true
  end
end

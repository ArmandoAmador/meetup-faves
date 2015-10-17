class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.string :month, null: false
      t.integer :date, null: false
      t.string :name, null: false
      t.string :group_name, null: false
      t.integer :yes_rsvp_count, null: false
      t.string :who, null: false
      t.boolean :status, null: false, default: false
      t.timestamps null: false
    end
  end
end

class CreateHorses < ActiveRecord::Migration
  def self.up
    create_table :horses do |t|
      t.string :name
      t.string :color

      t.timestamps
    end
  end

  def self.down
    drop_table :horses
  end
end

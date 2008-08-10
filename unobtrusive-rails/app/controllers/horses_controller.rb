class HorsesController < ApplicationController


  def index
    @horses = Horse.all
  end


  def create
    @horse = Horse.create(params[:horse])
    
    if @horse.save
      respond_to do |format|
        format.html{ redirect_to horses_url }
        format.js{ render :json => @horse }
      end
    else
      respond_to do |format|
        format.html{ redirect_to horses_url }
        format.js{ render :json => @horse.errors, :status => 500 }
      end
    end
  end


  def update
    horse = Horse.find(params[:id])
    horse.update_attributes(params[:horse])

    respond_to do |format|
      format.html{ redirect_to horses_url }
      format.js{ render :json => horse.save ? horse : horse.errors }
    end
  end


  def destroy
    horse = Horse.find(params[:id])
    horse.destroy

    respond_to do |format|
      format.html{ redirect_to horses_url }
      format.js{ render :json => horse.to_json }
    end
  end


end

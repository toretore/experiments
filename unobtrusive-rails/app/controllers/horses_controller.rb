class HorsesController < ApplicationController


  def index
    @horses = Horse.all

    respond_to do |format|
      format.html
      format.js{ sleep 3; render :partial => "horse", :collection => @horses }
    end
  end


  def create
    @horse = Horse.create(params[:horse])
    
    if @horse.save
      respond_to do |format|
        format.html{ redirect_to horses_url }
        format.js{ render :partial => "horse", :object => @horse }
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
      format.js{ sleep 2; render :json => horse }
    end
  end


  def destroy
    horse = Horse.find(params[:id])
    horse.destroy

    respond_to do |format|
      format.html{ redirect_to horses_url }
      format.js{ sleep 2; render :json => horse.to_json }
    end
  end


end

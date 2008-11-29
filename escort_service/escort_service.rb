require "rubygems"
require "rack"
require "barby"
%w(ascii rmagick prawn cairo).each{|f| require "barby/outputter/#{f}_outputter" }

#Rack-compatible application that renders barcodes using Barby
class EscortService

  CLASS_MAP = {
    "code128a" => Barby::Code128A,
    "code128b" => Barby::Code128B,
    "code128c" => Barby::Code128C,
    "bookland" => Barby::Bookland,
    "code39" => Barby::Code39,
    "code93" => Barby::Code93,
    "ean13" => Barby::EAN13,
    "ean8" => Barby::EAN8,
    "gs1128" => Barby::GS1128,
    "qrcode" => Barby::QrCode
  }

  OUTPUTTER_MAP = {
    "png"   => {:class => Barby::RmagickOutputter, :method => "to_png",
                :options => %w(xdim ydim height margin), :mime => "image/png"},
    "gif"   => {:class => Barby::RmagickOutputter, :method => "to_gif",
                :options => %w(xdim ydim height margin), :mime => "image/gif"},
    "jpg"   => {:class => Barby::RmagickOutputter, :method => "to_jpg",
                :options => %w(xdim ydim height margin), :mime => "image/jpeg"},
    "ascii" => {:class => Barby::ASCIIOutputter, :method => "to_ascii",
                :options => %w(height xdim bar space), :mime => "text/plain"},
    "svg"   => {:class => Barby::CairoOutputter, :method => "to_svg",
                :options => %w(xdim height margin), :mime => "image/svg+xml"},
    "pdf"   => {:class => Barby::PrawnOutputter, :method => "to_pdf",
                :options => %w(x y height xdim), :mime => "application/pdf"}
  }


  def self.call(env)
    new(env).response
  end


  def initialize(env)
    @env = env
  end


  def response
    [200, {"Content-Type" => mime_type}, outputter_result]
  rescue => e
    [500, {"Content-Type" => "text/plain"}, "#{e.message}\n\n#{e.backtrace.join("\n")}"]
  end


private

  def barcode_class
    CLASS_MAP[params["type"]] || raise(ArgumentError, "Unknown barcode type \"#{params["type"]}\"")
  end

  def barcode
    barcode_class.new(data)
  end


  def outputter_class
    map[:class]
  end

  def outputter_mapping
    @outputter_mapping ||= OUTPUTTER_MAP[params["outputter"]] ||
      raise(ArgumentError, "unknown outputter \"#{params["outputter"]}\"")
  end
  alias map outputter_mapping

  def outputter_result
    if map[:options]
      outputter_class.new(barcode).send(outputter_mapping[:method], options)
    else
      outputter_class.new(barcode).send(outputter_mapping[:method])
    end
  end

  def options
    (map[:options] || []).inject({}) do |h,o|
      key = o.to_sym
      h[key] = params[o] if params[o]
      #HACK: Guess which options are supposed to be integers
      h[key] = h[key].to_i if h[key] && h[key] =~ /^\d+$/
      h
    end
  end

  def mime_type
    map[:mime]
  end

  def data
    params["data"] || raise(ArgumentError, "No data provided")
  end


  def request
    @request ||= Rack::Request.new(@env)
  end

  def params
    @params ||= request.params
  end


  def camelize(s)
    s.gsub(/_(.)/){ $1.upcase }.gsub(/^./){|s| s.upcase }
  end


end

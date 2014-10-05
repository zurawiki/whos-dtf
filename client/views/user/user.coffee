# api calls to uber on
Template.user.helpers(
  tele: () ->
    t = @username
    t1 = t.substring 0, 3
    t2 = t.substring 3, 6
    t3 = t.substring 6, 10
    "(#{t1}) #{t2}-#{t3}"
)

Template.user.uber = ->
  Session.get 'uber-prices'
Template.user.username = ->
  Meteor.user().username

Template.user.rendered = ->
#  console.error @
  latLng = Geolocation.latLng()
  if !latLng
    return
  lat = latLng.lat
  lng = latLng.lng
  $.getJSON('https://api.uber.com/v1/estimates/price',
    server_token: 'ViR0SvETjjSfaZzay5M2MeDdcWVWFoxpYXTwWG7e'
    start_latitude: lat
    start_longitude: lng
    end_latitude: @data.marker.lat
    end_longitude: @data.marker.lng

  ,
  (d) ->
    console.log d
    Session.set('uber-prices', d.prices)
  )



IronRouterProgress.configure
  spinner: false

Router.configure
  layoutTemplate: 'layout'
  loadingTemplate: 'loading'
# yieldTemplates:
#   header:
#     to: 'header'
#   footer:
#     to: 'footer'
#  onBeforeAction: ->
#    console.log 'Meteor user:', Meteor.user()

Router.map ->
  @route 'home',
    path: '/'
    waitOn: ->
      Meteor.subscribe "users"
      Meteor.subscribe "dtfers"
    onBeforeAction: ->
      if !Meteor.userId()
        @setLayout "signin"

  @route 'user',
    path: '/user/:_id'
    data: ->
      Meteor.users.findOne(@params._id)
    waitOn: ->
      Meteor.subscribe "users"
    onBeforeAction: ->
      if !Meteor.userId()
        @setLayout "signin"

#  @route 'conversation',
#    path: '/convo/:_id'
#    data: ->
#      Conversation.findOne(@params._id)
#    waitOn: ->
#      Meteor.subscribe 'message_for_convo', @params._id
#    onBeforeAction: ->
#      AccountsEntry.signInRequired @
# yieldTemplates:
#   header:
#     to: 'headerConversation'
#   footer:
#     to: 'footer'


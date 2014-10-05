Meteor.users.allow
  update: (userId, doc, fields, modifier) ->
    # can only change your own documents
    doc._id == userId

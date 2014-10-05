Meteor.publish("dtfers", function () {
    return Meteor.users.find({'visible': true});
});

Meteor.publish("users", function () {
    return Meteor.users.find();
});

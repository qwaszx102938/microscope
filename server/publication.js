Meteor.publish('posts', function (option) {
    check(option,{sort:Object,limit:Number});
  return Posts.find({},option);
});

Meteor.publish('comments', function (postId) {
    check(postId, String);
    return Comments.find({ postId: postId });
});

Meteor.publish('notifications', function () {
    return Notifications.find({ userId: this.userId, read: false });
});

Meteor.publish('singlePost', function(id) {
  check(id, String)
  return Posts.find(id);
});
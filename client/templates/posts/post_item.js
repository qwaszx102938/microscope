Template.postItem.helpers({
    domain: function () {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    ownPost: function () {
        return this.userId === Meteor.userId();
    },
   
}

    );

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
});


Template.postItem.helpers({
    upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});
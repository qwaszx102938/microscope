Template.postEdit.helpers({
    errorMessage: function (field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});

Template.postEdit.events({
    'submit .form': function (e, template) {
        e.preventDefault()
        var currentPostId = this._id;
        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }
        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set('postEditErrors', errors);
        Posts.update({ _id: currentPostId }, { $set: postProperties }, function (errors) {
            if (errors) {
                // 向用户显示错误信息
                throwError(error.reason);

            } else {
                Router.go('postPage', { _id: currentPostId });
            }
        });

    }, 'click .delete': function (e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
}); 

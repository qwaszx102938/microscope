

Template.postSubmit.events({
    'submit form': function (e, template) {
        e.preventDefault()
        var post = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };
        var errors = validatePost(post);
        if (errors.title || errors.url)
            return Session.set('postSubmitErrors', errors);
        //调用服务器提供的敏感操作方法。
        Meteor.call('postInsert', post, function (error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');
            Router.go('postPage', { _id: result._id });
        });
    }
});

Template.postSubmit.onCreated(function () {
    Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
    errorMessage: function (field) {
        return Session.get('postSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () { 
        return Meteor.subscribe('notifications') }
})
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    //return {sort: {submitted: -1}, limit: this.postsLimit()};
    //这里相当坑，this.sort的实现是在子类里面的，这里提醒下次看的时候
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
 
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      //这里的nextPath也是在子类里面的。
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});



Router.route('/posts/:_id', { name: 'postPage',
waitOn:function () {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
}
,data:function() {
    return Posts.findOne(this.params._id);
} });
Router.route('/posts/:_id/edit',{
    name: 'postEdit',
    waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
    data: function() { return Posts.findOne(this.params._id); }
});
Router.route('/submit', {name: 'postSubmit'});
//Router.route('/:postsLimit?', { name: 'postsList'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});
BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});
Router.route('/', {
  //这里如果不手动指定controler的话就会自动调用homeController了，所以就手工指定了。
  name: 'home',
  controller: NewPostsController
});
Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});
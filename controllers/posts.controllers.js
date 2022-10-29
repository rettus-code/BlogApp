const Post = require("../models/post");
const Redis = require("ioredis")
let redisClient = new Redis({
	host: 'cachetest.yrwyfy.ng.0001.usw2.cache.amazonaws.com',
	port: 6379
})

const homeStartingContent =
	'The home pages lists all the blogs from all the users.';

const composePost = (req, res) => {
	const post = new Post({
    username: req.user.username,
		title: req.body.postTitle,
		content: req.body.postBody
	});

	post.save();
	res.redirect('/post');
};

const displayAllPosts = (req, res) => {
	Post.find({}, function(err, posts) {
		res.render('home', {
			startingContent: homeStartingContent,
			posts: posts
		});
	});
};
async function displayPost (req, res)  {
	const requestedPostId = req.params.postId;
	post_record = await redisClient.get(requestedPostId);

	if(post_record == null){
		Post.findOne({ _id: requestedPostId }, function(err, post) {
			redisClient.set(
				requestedPostId, post, 3600
			)
			res.render('post', {
				title: post.title,
				content: post.content
			});
		});
	} else {
		console.log(post_record);
		res.render('post',{
			title: post_record.title,
			content: post_record.content
		})
	}
	
};

module.exports = {
	displayAllPosts,
	displayPost,
    composePost
};
const Post = require("../models/post");


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
	dbConnection.query('SELECT * FROM post', function(err, posts) {
		res.render('home', {
			startingContent: homeStartingContent,
			posts: posts
		});
	});
};
async function displayPost (req, res)  {
	const requestedPostId = req.params.postId;

	dbConnection.query('SELECT * FROM post where _id = ? ', [requestedPostId], function(err, post) {
		res.render('post', {
			title: post.title,
			content: post.content
		});
	});
};

module.exports = {
	displayAllPosts,
	displayPost,
    composePost
};
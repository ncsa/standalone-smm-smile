var {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLFloat,
	GraphQLBoolean
} = require('graphql');
var redditAPI = require('../../../API/redditAPI');
var replyLoader = require('../../../API/loader');

const redditLinkType = module.exports = new GraphQLObjectType({
	name:'redditLink',
	description:'',
	fields: () => ({
		approved_by:			{type:GraphQLString},
		archived:				{type:GraphQLBoolean},
		author_name:			{type:GraphQLString,
								resolve: ({author})=>{return author.name}},
		author_flair_css_class:	{type:GraphQLString},
		author_flair_text:		{type:GraphQLString},
		banned_by:				{type:GraphQLString},
		brand_safe:				{type:GraphQLBoolean},
		contest_mode:			{type:GraphQLBoolean},
		clicked:				{type:GraphQLBoolean},
		created:				{type:GraphQLString},
		created_utc:			{type:GraphQLString},
		domain:					{type:GraphQLString},
		downs:					{type:GraphQLInt},
		distinguished:			{type:GraphQLString},
		edited:					{type:GraphQLInt},					
		gilded:					{type:GraphQLInt},
		hidden:					{type:GraphQLBoolean},
		hide_score:				{type:GraphQLBoolean},
		id:						{type:GraphQLString},
		is_self:				{type:GraphQLBoolean},
		likes:					{type:GraphQLBoolean},
		link_flair_css_class:	{type:GraphQLString},
		link_flair_text:		{type:GraphQLString},
		locked:					{type:GraphQLBoolean},
		media:					{type:GraphQLString},
		//media_embed:			{type:GraphQLString},
		mod_reports:			{type:new GraphQLList(GraphQLString)},
		name:					{type:GraphQLString},
		num_comments:			{type:GraphQLInt},
		num_reports:			{type:GraphQLInt},
		over_18:				{type:GraphQLBoolean},
		post_hint:				{type:GraphQLString},
		/*preview_enabled:		{type:GraphQLBoolean,
								resolve:({preview}) =>{return preview.enabled}},
		preview_images:			{type:new GraphQLList(GraphQLString),
								resolve:({preview}) =>{return preview.images;
								console.log(preview.images);}},*/
		permalink:				{type:GraphQLString},
		quarantine:				{type:GraphQLBoolean},
		report_reasons:			{type:GraphQLString},
		removal_reason:			{type:GraphQLString},
		saved:					{type:GraphQLBoolean},
		score:					{type:GraphQLInt},
		selftext:				{type:GraphQLString},
		selftext_html:			{type:GraphQLString},
		secure_media:			{type:GraphQLString},
		secure_media_embed:		{type:GraphQLString},
		stickied:				{type:GraphQLBoolean},
		spoiler:				{type:GraphQLBoolean},
		subreddit_display_name:	{type:GraphQLString,
								resolve: ({subreddit})=>{return subreddit.display_name}},
		suggested_sort:			{type:GraphQLString},
		subreddit_id:			{type:GraphQLString},
		subreddit_type:			{type:GraphQLString},
		subreddit_name_prefixed:{type:GraphQLString},
		thumbnail:				{type:GraphQLString},
		title:					{type:GraphQLString},
		url:					{type:GraphQLString},
		ups:					{type:GraphQLInt},
		user_reports:			{type:new GraphQLList(GraphQLString)},
		visited:				{type:GraphQLBoolean},	
		/*--------------------------nested------------------------*/
		replies:				{type:new GraphQLList(redditCommentType),
									resolve: ({id},_,context) => replyLoader.load( JSON.stringify({'id':id,'token':context['redditaccesstoken']}) )}
		/*author_trophy:			{type:new GraphQLList(redditTrophyType),
									resolve: ({author}) => redditAPI(resolveName='trophy', id=author.name, args={})},
		author_overview:		{type:new GraphQLList(redditOverviewType),
									args:{extra:{type:GraphQLInt, defaultValue:0}},
									resolve: ({author},args) => redditAPI(resolveName='overview', id=author.name, args=args)},
		author_submission:		{type:new GraphQLList(redditLinkType),
									args:{extra:{type:GraphQLInt, defaultValue:0}},
									resolve: ({author},args) => redditAPI(resolveName='submission', id=author.name, args=args)},
		author_comment:			{type:new GraphQLList(redditCommentType),
									args:{extra:{type:GraphQLInt, defaultValue:0}},
									resolve: ({author},args) => redditAPI(resolveName='comment', id=author.name, args=args)},
		author_upvote:			{type:new GraphQLList(redditOverviewType),
									args:{extra:{type:GraphQLInt, defaultValue:0}},
									resolve: ({author},args) => redditAPI(resolveName='upvote', id=author.name, args=args)},
		author_downvote:		{type:new GraphQLList(redditOverviewType),
									args:{extra:{type:GraphQLInt, defaultValue:0}},
									resolve: ({author},args) => redditAPI(resolveName='downvote', id=author.name, args=args)},*/
		
	})
});

const redditTrophyType = require('./redditTrophyType');
const redditCommentType = require('./redditCommentType');
const redditOverviewType = require('./redditOverviewType');
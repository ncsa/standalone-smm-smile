// Global variables
currPreviewNum = 0;

//corresponding to query.pug and searchbox.pug
function init(){

    queryTerm = '';
    Query ='';
    parameters = {
    	tweet: {},
    	tweetV2: {},
        twtTimeline: {},
        rdSearch: {},
        rdComment:{},
        rdPost:{},
        psPost:{},
        psComment:{},
        youtubeSearchVideo:{},
		youtubeRandomVideos:{},
		youtubeSearchChannel:{},
		youtubeSearchPlaylist:{},
		youtubeMostPopular:{},
		youtubeCreatorVideos:{},
    };

    // initialization
	$("#searchbox").prop('disabled',true);
	$("#dropdownButton").prop('disabled',true);
	$("#simple-search-btn").prop('disabled',true);

	// notification
	$("#searchPage").find(".citation-notice button").on("click", function(e){
		var citationButton = $(e.target);
		citationButton.parents(".citation-notice").hide();
	});

	// save result
	$("#adv-search-btn").on('click', function(e){
		dryRun('#input');
	});	
	$("#simple-search-btn").on('click', function(e){
		dryRun('#searchbox');
	});
	$("#searchbox").on('keypress', function(e){
		if ( (e.keyCode == 13 || e.keycode == 10 )&& !$("#simple-search-btn").attr('disabled')){
			e.preventDefault();
			dryRun('#searchbox');
		}
	});
	
	// save button click
	$("#saveButton").on('click',function(e){
        e.preventDefault();
        saveButtonClick()
	});
	$("#sn-filename").on('keypress',function(e){
		if (e.keyCode === 13 || e.keycode == 10){
			e.preventDefault(); 
			saveButtonClick()
		}
	});
	
	$("#sn-filename").on("keyup",function(e){
		if (e.keyCode !== 13 && e.keyCode!== 10){
			$('#display-savefiles').empty();
			$('#display-savefiles').append(`<p style="text-align:left;padding-top:7px;">` + $(this).val() + '.csv' + `</p>` );
		}
	});
			
	// customize advance dropdown
	$('#dropdownButton').on('click',function(){
		if (($("#searchbox").val() !== '' && $("#searchbox").val() !== undefined)
			|| queryTerm ===  "youtubeMostPopular"
			|| queryTerm === "youtubeRandomVideos"){
			if (queryTerm !==  "queryTweetV2"){
				$(this).parent().toggleClass('open');
				if ($(this).parent().attr('class') === 'dropdown dropdown-lg open'){
					// disable search and enable advanced search
					$("#simple-search-btn").prop('disabled',true);
					pushAdvancedDropdown('on');
				}else{
					$("#simple-search-btn").prop('disabled',false);
					pushAdvancedDropdown('off');
				}

				// initialize the advanced panel
				// escape double quotation mark
				var keyword =  $("#searchbox").val().replace(/[\"]+/g, `\\"`);

				parameters['tweet']['q:'] = keyword;
				parameters['tweet']['fields'] = `\n\t\t\tid\n\t\t\tid_str\n\t\t\tcreated_at\n\t\t\ttext\n\t\t\tretweet_count`+
					`\n\t\t\tfavorite_count\n\t\t\tfavorited\n\t\t\ttruncated\n\t\t\tlang\n\t\t\tis_quote_status\n\t\t\tsource`+
					`\n\t\t\tin_reply_to_user_id_str\n\t\t\tin_reply_to_status_id_str\n\t\t\tin_reply_to_screen_name\n\t\t\tuser{`+
					`\n\t\t\t\tauthor_id\n\t\t\t\tauthor_id_str\n\t\t\t\tname\n\t\t\t\tscreen_name\n\t\t\t\tdescription\n\t\t\t\tauthor_created_at`+
					`\n\t\t\t\tprofile_image_url\n\t\t\t\tprofile_banner_url\n\t\t\t\turl\n\t\t\t\tlocation\n\t\t\t\ttweets_count`+
					`\n\t\t\t\tfollowers_count\n\t\t\t\tfriends_count\n\t\t\t\tstatuses_count\n\t\t\t\ttime_zone\n\t\t\t\tprotected`+
					`\n\t\t\t\tverified\n\t\t\t\tis_translator\n\t\t\t\tcontributors_enabled\n\t\t\t\tgeo_enabled\n\t\t\t\tauthor_lang\n\t\t\t}`+
					`\n\t\t\tentities{\n\t\t\t\tmedia{\n\t\t\t\t\tmedia_url\n\t\t\t\t}\n\t\t\t}`;

				parameters['twtTimeline']['screen_name:'] = keyword;
				parameters['twtTimeline']['fields'] = `\n\t\t\tid\n\t\t\tid_str\n\t\t\tcreated_at\n\t\t\ttext\n\t\t\tretweet_count`+
					`\n\t\t\tfavorite_count\n\t\t\tfavorited\n\t\t\ttruncated\n\t\t\tlang\n\t\t\tis_quote_status\n\t\t\tsource`+
					`\n\t\t\tin_reply_to_user_id_str\n\t\t\tin_reply_to_status_id_str\n\t\t\tin_reply_to_screen_name\n\t\t\tuser{`+
					`\n\t\t\t\tauthor_id\n\t\t\t\tauthor_id_str\n\t\t\t\tname\n\t\t\t\tscreen_name\n\t\t\t\tdescription\n\t\t\t\tauthor_created_at`+
					`\n\t\t\t\tprofile_image_url\n\t\t\t\tprofile_banner_url\n\t\t\t\turl\n\t\t\t\tlocation\n\t\t\t\ttweets_count`+
					`\n\t\t\t\tfollowers_count\n\t\t\t\tfriends_count\n\t\t\t\tstatuses_count\n\t\t\t\ttime_zone\n\t\t\t\tprotected`+
					`\n\t\t\t\tverified\n\t\t\t\tis_translator\n\t\t\t\tcontributors_enabled\n\t\t\t\tgeo_enabled\n\t\t\t\tauthor_lang\n\t\t\t}`+
					`\n\t\t\tentities{\n\t\t\t\tmedia{\n\t\t\t\t\tmedia_url\n\t\t\t\t}\n\t\t\t}`;

				parameters['rdSearch']['query:'] = keyword;
				parameters['rdSearch']['time:'] = parameters['rdSearch']['time:'] || 'all';
				parameters['rdSearch']['sort:'] = parameters['rdSearch']['sort:'] || 'relevance';
				parameters['rdSearch']['fields'] = `\n\t\t\tarchived\n\t\t\tauthor_name\n\t\t\tbrand_safe\n\t\t\tcontest_mode\n\t\t\tclicked`+
					`\n\t\t\tcreated\n\t\t\tcreated_utc\n\t\t\tdomain\n\t\t\tdowns\n\t\t\tedited\n\t\t\tgilded\n\t\t\thidden\n\t\t\thide_score`+
					`\n\t\t\tid\n\t\t\tis_self\n\t\t\tlink_flair_text\n\t\t\tlocked\n\t\t\tname\n\t\t\tover_18\n\t\t\tpermalink\n\t\t\tquarantine\n\t\t\tsaved\n\t\t\tscore`+
					`\n\t\t\tstickied\n\t\t\tspoiler\n\t\t\tsubreddit_display_name\n\t\t\tsubreddit_id\n\t\t\tsubreddit_type\n\t\t\tsubreddit_name_prefixed`+
					`\n\t\t\ttitle\n\t\t\turl\n\t\t\tups\n\t\t\tvisited`;

				parameters['rdPost']['subredditName:'] = keyword;
				parameters['rdPost']['extra:'] = parameters['rdPost']['extra:'] || 2000;
				parameters['rdPost']['fields'] = `\n\t\t\tarchived\n\t\t\tauthor_name\n\t\t\tbrand_safe\n\t\t\tcontest_mode\n\t\t\tclicked`+
					`\n\t\t\tcreated\n\t\t\tcreated_utc\n\t\t\tdomain\n\t\t\tdowns\n\t\t\tedited\n\t\t\tgilded\n\t\t\thidden\n\t\t\thide_score`+
					`\n\t\t\tid\n\t\t\tis_self\n\t\t\tlink_flair_text\n\t\t\tlocked\n\t\t\tname\n\t\t\tover_18\n\t\t\tpermalink\n\t\t\tquarantine\n\t\t\tsaved\n\t\t\tscore`+
					`\n\t\t\tstickied\n\t\t\tspoiler\n\t\t\tsubreddit_display_name\n\t\t\tsubreddit_id\n\t\t\tsubreddit_type\n\t\t\tsubreddit_name_prefixed`+
					`\n\t\t\ttitle\n\t\t\turl\n\t\t\tups\n\t\t\tvisited`;

				parameters['rdComment']['subredditName:'] = keyword;
				parameters['rdComment']['extra:'] = parameters['rdComment']['extra:'] || 2000;
				parameters['rdComment']['fields'] = `\n\t\t\tcomment_author_name\n\t\t\tarchived\n\t\t\tbody\n\t\t\tbody_html\n\t\t\tsubreddit_display_name`+
					`\n\t\t\tcreated_utc\n\t\t\tcomment_created\n\t\t\tcontroversiality\n\t\t\tcomment_downs\n\t\t\tedited\n\t\t\tgilded\n\t\t\tcomment_id`+
					`\n\t\t\tlink_id\n\t\t\tlink_author\n\t\t\tlink_title\n\t\t\tlink_permalink\n\t\t\tlink_url\n\t\t\tcomment_over_18\n\t\t\tparent_id`+
					`\n\t\t\tquarantine\n\t\t\tsaved\n\t\t\tcomment_score\n\t\t\tsubreddit_id\n\t\t\tsubreddit_display_name\n\t\t\tsubreddit_name_prefixed`+
					`\n\t\t\tscore_hidden\n\t\t\tstickied\n\t\t\tsubreddit_type\n\t\t\tcomment_ups`;

				parameters['psPost']['q:'] = keyword;
				parameters['psPost']['fields']=`\n\t\t\tauthor_name\n\t\t\tcreated_utc`+
					`\n\t\t\tdomain\n\t\t\tid\n\t\t\tis_self\n\t\t\tlocked\n\t\t\tnum_comments\n\t\t\tover_18\n\t\t\tpermalink\n\t\t\tfull_link`+
					`\n\t\t\tpinned\n\t\t\tretrieved_on\n\t\t\tscore\n\t\t\tstickied\n\t\t\tspoiler\n\t\t\tsubreddit_display_name\n\t\t\tsubreddit_id`+
					`\n\t\t\tsubreddit_name_prefixed\n\t\t\ttitle\n\t\t\turl`;

				parameters['psComment']['q:'] = keyword;
				parameters['psComment']['fields']=`\n\t\t\tcomment_author_name\n\t\t\tbody\n\t\t\tcomment_created\n\t\t\tid\n\t\t\tlink_id\n\t\t\tparent_id`+
					`\n\t\t\tcomment_score\n\t\t\tsubreddit_display_name\n\t\t\tsubreddit_name_prefixed\n\t\t\tsubreddit_id`;

				const youtubeCommonFields = "\n\t\t\tkind\n\t\t\tetag\n\t\t\tid{\n\t\t\t\tkind\n\t\t\t\tvideoId\n\t\t\t\tchannelId\n\t\t\t\tplaylistId\n\t\t\t}" +
					"\n\t\t\tsnippet{\n\t\t\t\tpublishedAt\n\t\t\t\tchannelId\n\t\t\t\ttitle\n\t\t\t\tdescription\n\t\t\t\tdefault_thumbnails_url" +
					"\n\t\t\t\tdefault_thumbnails_width\n\t\t\t\tdefault_thumbnails_height\n\t\t\t\tmedium_thumbnails_url\n\t\t\t\tmedium_thumbnails_width" +
					"\n\t\t\t\tmedium_thumbnails_height\n\t\t\t\thigh_thumbnails_url\n\t\t\t\thigh_thumbnails_width\n\t\t\t\thigh_thumbnails_height" +
					"\n\t\t\t\tstandard_thumbnails_url\n\t\t\t\tstandard_thumbnails_width\n\t\t\t\tstandard_thumbnails_height\n\t\t\t\tmaxres_thumbnails_url" +
					"\n\t\t\t\tmaxres_thumbnails_width\n\t\t\t\thigh_thumbnails_height\n\t\t\t\tchannelTitle\n\t\t\t\tliveBroadcastContent\n\t\t\t}";

				parameters['youtubeSearchVideo']['q:'] = keyword;
				parameters['youtubeSearchVideo']['order:'] = parameters['youtubeSearchVideo']['order:'] || "relevance";
				parameters['youtubeSearchVideo']['videoDuration:'] = parameters['youtubeSearchVideo']['videoDuration:'] || "any";
				parameters['youtubeSearchVideo']['fields'] = youtubeCommonFields;

				parameters['youtubeRandomVideos']['videoDuration:'] = parameters['youtubeRandomVideos']['videoDuration:'] || "any";
				parameters['youtubeRandomVideos']['maxTotalResults:'] = parameters['youtubeRandomVideos']['maxTotalResults:'] || 100;
				parameters['youtubeRandomVideos']['fields'] = youtubeCommonFields;

				parameters['youtubeSearchChannel']['q:'] = keyword;
				parameters['youtubeSearchChannel']['type:'] = parameters['youtubeSearchChannel']['type:'] || "channel";
				parameters['youtubeSearchChannel']['fields'] = youtubeCommonFields;

				parameters['youtubeSearchPlaylist']['q:'] = keyword;
				parameters['youtubeSearchPlaylist']['type:'] = parameters['youtubeSearchPlaylist']['type:'] || "playlist";
				parameters['youtubeSearchPlaylist']['fields'] = youtubeCommonFields;

				parameters['youtubeMostPopular']['regionCode:'] = keyword;
				parameters['youtubeMostPopular']['chart:'] = parameters['youtubeMostPopular']['chart:'] || "mostPopular";
				parameters['youtubeMostPopular']['fields'] = "\n\t\t\tkind\n\t\t\tetag\n\t\t\tid\n\t\t\tsnippet{\n\t\t\t\t" +
					"publishedAt\n\t\t\t\tchannelId\n\t\t\t\ttitle\n\t\t\t\tdescription\n\t\t\t\tdefault_thumbnails_url" +
					"\n\t\t\t\tdefault_thumbnails_width\n\t\t\t\tdefault_thumbnails_height\n\t\t\t\tmedium_thumbnails_url" +
					"\n\t\t\t\tmedium_thumbnails_width\n\t\t\t\tmedium_thumbnails_height\n\t\t\t\thigh_thumbnails_url" +
					"\n\t\t\t\thigh_thumbnails_width\n\t\t\t\thigh_thumbnails_height\n\t\t\t\tstandard_thumbnails_url" +
					"\n\t\t\t\tstandard_thumbnails_width\n\t\t\t\tstandard_thumbnails_height\n\t\t\t\tmaxres_thumbnails_url" +
					"\n\t\t\t\tmaxres_thumbnails_width\n\t\t\t\tmaxres_thumbnails_height\n\t\t\t\tchannelTitle\n\t\t\t\t" +
					"tags\n\t\t\t\tcategoryId\n\t\t\t\tliveBroadcastContent\n\t\t\t\tdefaultLanguage\n\t\t\t\t" +
					"localized_title\n\t\t\t\tlocalized_description\n\t\t\t\tlocalized_description\n\t\t\t\t" +
					"defaultAudioLanguage\n\t\t\t}\n\t\t\tcontentDetails{\n\t\t\t\tduration\n\t\t\t\tdimension" +
					"\n\t\t\t\tdefinition\n\t\t\t\tcaption\n\t\t\t\tlicensedContent\n\t\t\t\tregionRestriction_allowed" +
					"\n\t\t\t\tregionRestriction_blocked\n\t\t\t\tprojection\n\t\t\t\thasCustomThumbnail\n\t\t\t}\n\t\t\t" +
					"status{\n\t\t\t\tuploadStatus\n\t\t\t\tfailureReason\n\t\t\t\trejectionReason\n\t\t\t\tprivacyStatus" +
					"\n\t\t\t\tpublishAt\n\t\t\t\tlicense\n\t\t\t\tembeddable\n\t\t\t\tpublicStatsViewable\n\t\t\t\t" +
					"madeForKids\n\t\t\t\tselfDeclaredMadeForKids\n\t\t\t}\n\t\t\tstatistics{\n\t\t\t\tviewCount" +
					"\n\t\t\t\tlikeCount\n\t\t\t\tdislikeCount\n\t\t\t\tfavoriteCount\n\t\t\t\tcommentCount\n\t\t\t}" +
					"\n\t\t\tplayer{\n\t\t\t\tembedHtml\n\t\t\t\tembedHeight\n\t\t\t\tembedWidth\n\t\t\t}\n\t\t\t" +
					"topicDetails{\n\t\t\t\ttopicIds\n\t\t\t\trelevantTopicIds\n\t\t\t\ttopicCategories\n\t\t\t}" +
					"\n\t\t\trecordingDetails{\n\t\t\t\trecordingDate\n\t\t\t}\n\t\t\tliveStreamingDetails{\n\t\t\t\t" +
					"actualStartTime\n\t\t\t\tactualEndTime\n\t\t\t\tscheduledStartTime\n\t\t\t\tscheduledEndTime" +
					"\n\t\t\t\tconcurrentViewers\n\t\t\t\tactiveLiveChatId\n\t\t\t}"

				parameters['youtubeCreatorVideos']['handle:'] = keyword;
				parameters['youtubeCreatorVideos']['order:'] = parameters['youtubeCreatorVideos']['order:'] || "relevance";
				parameters['youtubeCreatorVideos']['videoDuration:'] = parameters['youtubeCreatorVideos']['videoDuration:'] || "any";
				parameters['youtubeCreatorVideos']['fields'] = youtubeCommonFields;

				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);

			}
			else {
				$("#modal-message").append(`<h4>We currently don't support advanced settings for this search function.</h4>`);
				$("#alert").modal('show');
				$("#searchbox").focus();
			}
		}
		else{
			$("#modal-message").append(`<h4>Advanced search disabled unless you provide some search keywords!</h4>`);
			$("#alert").modal('show');
			$("#searchbox").focus();
		}
	});
	
	// customize selectpicker
	$('.selectpicker').selectpicker({ style: 'btn-info', size: 10 });

	// customize multiselectbox
	$('.fields').multiselect({
		enableFiltering: true,
		filterBehavior: 'value',
		dropUp:true,
		maxHeight:600,
		buttonWidth:'600px',
		maxWidth:600,
		includeSelectAllOption: true,		
		enableCollapsibleOptGroups: true,			
		});

	$("#social-media").change(function(){
		$(".prompt").empty();

		$("#searchbox").val("").prop('disabled',false);
		$("#dropdownButton").prop('disabled',false).parent().removeClass('open');;
		$("#simple-search-btn").prop('disabled',false);
		pushAdvancedDropdown('off');


		$(".tweet").hide();
		$(".timeline").hide();
		$(".tweetV2").hide();
		$(".reddit-search").hide();
		$(".reddit-post").hide();
		$(".reddit-comment").hide();
		$(".pushshift-post").hide();
		$(".pushshift-comment").hide();
		$(".youtube-search-video").hide();
		$(".youtube-random-videos").hide();
		$(".youtube-search-playlist").hide();
		$(".youtube-search-channel").hide();
		$(".youtube-most-popular").hide();

		$(".form-group.geocode").hide();
		$(".form-group.dateRange").hide();
		$(".form-group.rd-subreddit").hide();
		$(".form-group.ps-subreddit").hide();
		$(".form-group.ps-author").hide();
		$(".form-group.ps-dateRange").hide();
		$(".form-group.ps-cm-subreddit").hide();
		$(".form-group.ps-cm-author").hide();
		$(".form-group.ps-cm-dateRange").hide();

        queryTerm = $(this).find(':selected').val();
		if ( queryTerm === 'queryTweet'){
			$(".tweet").show();
			$("#searchbox").attr("placeholder","Tweet keywords that you wish to search...");

			// tooltip to show twitter rules
            $("boolean").attr('data-original-title',
				"Twitter API supports a list of standard search operators to modify the behavior of the query. For example, " +
				"<b>SPACE, OR, MINUS SIGN, HASHTAG and etc</b>. <br>Details please refer to the&nbsp" +
				"<a href='https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators.html' target='_blank'>" +
				"standard operators</a>")
                .tooltip('fixTitle')
                .tooltip('show');
		}
		else if ( queryTerm === 'getTimeline'){
			$(".timeline").show();
			$("#searchbox").attr("placeholder","User screen name starting after @");
            $("boolean").tooltip('hide');
        }
		if ( queryTerm === 'queryTweetV2'){
			$(".tweetV2").show();
			$("#searchbox").attr("placeholder","Tweet keywords that you wish to search...");

			// tooltip to show twitter rules
			$("boolean").attr('data-original-title',
				"Twitter API supports a list of standard search operators to modify the behavior of the query. For example, " +
				"<b>SPACE, OR, MINUS SIGN, HASHTAG and etc</b>. <br>Details please refer to the&nbsp" +
				"<a href='https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators.html' target='_blank'>" +
				"standard operators</a>")
			.tooltip('fixTitle')
			.tooltip('show');
		}
        else if ( queryTerm === 'queryReddit'){
			$(".reddit-search").show();
			$("#searchbox").attr("placeholder","Keywords for the Reddit posts that you wish to search...");

            // tooltip to show twitter rules
            $("boolean").attr('data-original-title',
                "Reddit search supports the boolean operators <b>AND, OR, and NOT</b> (case sensitive) as well as parenthesis. Details please refer to the&nbsp" +
                "<a href='https://www.reddit.com/wiki/search' target='_blank'>" +
                "rules</a>")
                .tooltip('fixTitle')
                .tooltip('show');
		}
		else if ( queryTerm === 'redditPost'){
			$(".reddit-post").show();
			$("#searchbox").attr("placeholder","The subreddit name you wish to get posts from...");
            $("boolean").tooltip('hide');
		}
		else if ( queryTerm === 'redditComment'){
			$(".reddit-comment").show();
			$("#searchbox").attr("placeholder","The subreddit name you wish to get comments from...");
            $("boolean").tooltip('hide');
		}
		else if ( queryTerm === 'pushshiftPost'){
			$(".pushshift-post").show();
			$("#searchbox").attr("placeholder","Keyword that you wish to search...");
            $("boolean").tooltip('hide');
		}
		else if ( queryTerm === 'pushshiftComment'){
			$(".pushshift-comment").show();
			$("#searchbox").attr("placeholder","Keyword that you wish to search...");
            $("boolean").tooltip('hide');
		}
		else if ( queryTerm === 'youtubeSearchVideo'
			|| queryTerm === 'youtubeRandomVideos'
			|| queryTerm === 'youtubeSearchChannel'
			|| queryTerm === 'youtubeSearchPlaylist'
			|| queryTerm === 'youtubeCreatorVideos')
		{

			var placeholderText = "Keywords for the Youtube content that you wish to search...";
			if (queryTerm === 'youtubeSearchVideo') $(".youtube-search-video").show();
			if (queryTerm === 'youtubeRandomVideos') {
				$(".youtube-random-videos").show();
				placeholderText = "Click the search button to randomly gather YouTube videos."
				$("#searchbox").prop('disabled',true);
			}
			if (queryTerm === 'youtubeSearchChannel') $(".youtube-search-channel").show();
			if (queryTerm === 'youtubeSearchPlaylist') $(".youtube-search-playlist").show();
			if (queryTerm === 'youtubeCreatorVideos') {
				$(".youtube-creator-videos").show();
				placeholderText = "A single YouTuber creator handle. e.g. MrBeast"
			}
			$("#searchbox").attr("placeholder", placeholderText);

			// tooltip to show YouTube search rules
			if (queryTerm !== 'youtubeCreatorVideos' && queryTerm !== 'youtubeRandomVideos'){
				$("boolean").attr('data-original-title',
					"YouTube keyword search supports boolean NOT (-) and OR (|) operators to exclude videos or to find videos " +
					"that are associated with one of several search terms. Details please refer to the&nbsp" +
					"<a href='https://developers.google.com/youtube/v3/docs/search/list#parameters' target='_blank'>" +
					"API documentations</a>")
				.tooltip('fixTitle')
				.tooltip('show');
			}
			else{
				$("boolean").attr('data-original-title', "")
				.tooltip('fixTitle')
				.tooltip('hide');
			}
		}
		else if (queryTerm === 'youtubeMostPopular'){
			$(".youtube-most-popular").show();
			$("#searchbox").attr("placeholder","Enter region code or leave blank for worldwide videos...");

			// tooltip to show region code rules
			$("boolean").attr('data-original-title',
				"You can find the region code information in the ISO 3166-2 standard. For more details, please refer to the " +
				"<a href='https://en.wikipedia.org/wiki/ISO_3166-2' target='_blank'>" +
				"ISO 3166-2 Wikipedia page</a>.")
			.tooltip('fixTitle')
			.tooltip('show');
		}
	
		Query = updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

		if ( $('.dropdown.dropdown-lg.open').length ){
			pushAdvancedDropdown('on');
		}else{
			pushAdvancedDropdown('off');
		}
	});

	/* documentation */
	$("#expandDoc").click(function(){
		$("#documentation").toggleClass("expand");
		$("#docIframe").height($(window).height());
		$("#searchPage").toggleClass("shrink");
	});
	
	/* everything related to date!!!!!!!!! */
	var current = new Date();
	current.setDate(current.getDate()-6);
	var until_start = current.toISOString().slice(0,10);
	$("#until-start").val(until_start);
			
	/*---------------------------------------global search term---------------------------------------------------------------------------*/
	$("#searchbox").on('keyup', delay(function(e){
		
		if ( e.keyCode !== 13 && e.keycode !== 10 ){
			// user prompt
			if (queryTerm === 'getTimeline'){
                var $prompt = $(".prompt");
                if ($(this).val() !== ""){
                    $.ajax({
                        url: "prompt",
                        type: "post",
                        data: {"screenName": $(this).val()},
                        success: function (data) {
                            $prompt.empty();
                            $(data).each(function(i, user){
                                $prompt.append('<div class="prompt-user">' +
                                    '<img class="prompt-img" src="'+ user.profile_image_url + '"/>' +
                                    '<p class="prompt-screen-name">' + user.screen_name + '</p>' +
                                    '<p class="prompt-user-name">' + user.name + '</p>' +
                                    '<p class="prompt-user-description">' + user.description + '</p></div>')
                            });

                            $(".prompt-user").on("click", function(){
                                $("#searchbox").val($(this).find(".prompt-screen-name").text());

                                var keyword =  $("#searchbox").val().replace(/[\"]+/g, `\\"`);
                                parameters['twtTimeline']['screen_name:'] = keyword;
                                parameters['tweet']['q:'] = keyword;
                                parameters['twtTimeline']['screen_name:'] = keyword;
								parameters['tweetV2']['q:'] = keyword;
								parameters['rdSearch']['query:'] = keyword;
                                parameters['rdPost']['subredditName:']= keyword;
                                parameters['rdComment']['subredditName:'] = keyword;
                                parameters['psPost']['q:'] = keyword;
                                parameters['psComment']['q:'] = keyword;
                                Query =updateString(queryTerm,parameters);
                                $("#input").val(`{\n\n` + Query +`\n\n}`);

                                $prompt.hide();
                            });
                        },
                        error: function (jqXHR, exception) {
                            $("#error").val(jqXHR.responseText);
                            $("#warning").modal('show');
                        }
                    });
                }
                else{
                    $prompt.empty();
                }
            }

            // escape double quotation mark
            var keyword =  $("#searchbox").val().replace(/[\"]+/g, `\\"`);
            parameters['tweet']['q:'] = keyword;
            parameters['twtTimeline']['screen_name:'] = keyword;
			parameters['tweetV2']['q:'] = keyword;
            parameters['rdSearch']['query:'] = keyword;
            parameters['rdPost']['subredditName:']= keyword;
            parameters['rdComment']['subredditName:'] = keyword;
            parameters['psPost']['q:'] = keyword;
            parameters['psComment']['q:'] = keyword;
            parameters['youtubeSearchVideo']['q:'] = keyword;
            parameters['youtubeSearchChannel']['q:'] = keyword;
            parameters['youtubeSearchPlaylist']['q:'] = keyword;
            parameters['youtubeMostPopular']['regionCode:'] = keyword;

            Query =updateString(queryTerm,parameters);
            $("#input").val(`{\n\n` + Query +`\n\n}`);
		}
	}, 300))
	.click(function(){
        $(this).siblings(".prompt").show();
    });

	// Update keywords
	$("#searchbox").change(function() {
		var keyword =  $("#searchbox").val().replace(/[\"]+/g, `\\"`);
		parameters['tweet']['q:'] = keyword;
		parameters['twtTimeline']['screen_name:'] = keyword;
		parameters['tweetV2']['q:'] = keyword;
		parameters['rdSearch']['query:'] = keyword;
		parameters['rdPost']['subredditName:']= keyword;
		parameters['rdComment']['subredditName:'] = keyword;
		parameters['psPost']['q:'] = keyword;
		parameters['psComment']['q:'] = keyword;
		parameters['youtubeSearchVideo']['q:'] = keyword;
		parameters['youtubeSearchChannel']['q:'] = keyword;
		parameters['youtubeSearchPlaylist']['q:'] = keyword;
		parameters['youtubeMostPopular']['regionCode:'] = keyword;
		parameters['youtubeCreatorVideos']['handle:'] = keyword;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	})

	/*---------------------------------------------query tweet ------------------------------------------------------------------------*/
	// toggle date range checkbox
	$("#dateRange").change(function(){
		
		parameters['tweet']['until:'] = $("#until").val();
		
		if ($("#dateRange").is(':checked')){
			$(".form-group.dateRange").show();
			
			$("#until").change(function(){
				parameters['tweet']['until:'] = $("#until").val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			parameters['tweet']['until:'] = '';	
			$(".form-group.dateRange").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}	
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	// toggle geocode checkbox
	$("#geocode").change(function(){
		
		parameters['tweet']['geocode:'] = $("#lat").val() + `,`+ $("#lon").val() + `,`+ $("#radius").val() +`mi`;;
		
		if ($("#geocode").is(':checked')){
			$(".form-group.geocode").show();
			
			lat = lon = radius = '';
			$("#lat").change(function(){
				lat = $("#lat").val();
				parameters['tweet']['geocode:'] = lat + `,`+ lon + `,`+ radius +`mi`;
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#lon").change(function(){
				lon = $("#lon").val();
				parameters['tweet']['geocode:'] = lat + `,`+ lon + `,`+ radius +`mi`;
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#radius").change(function(){
				radius = $("#radius").val();
				parameters['tweet']['geocode:'] = lat + `,`+ lon + `,`+ radius +`mi`;
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		
		}else{
			parameters['tweet']['geocode:'] = '';
			$(".form-group.geocode").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	// tweet
	$("#tweet-count").change(function(){
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	
	$("#twtTweetFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[],AuthorInformation:[], Entities:[]};
		$.each($(this).find(':selected'),function(i,val){
			var label = $(val.parentNode)[0].label;
			fields[label].push(val.value);
		});
		
		if(fields['BasicFields'].length !== 0){
			$.each(fields['BasicFields'],function(i,val){
				fields_string += '\n\t\t\t' + val;
			});
		}
		if (fields['AuthorInformation'].length !== 0){
			fields_string += '\n\t\t\tuser{' ;
			$.each(fields['AuthorInformation'],function(i,val){
				fields_string += '\n\t\t\t\t' + val;
			});
			fields_string += '\n\t\t\t}' ;
		}
		if (fields['Entities'].length !== 0){
            fields_string += '\n\t\t\tentities{\n\t\t\t\tmedia{\n\t\t\t\t\tmedia_url\n\t\t\t\t}\n\t\t\t}';
		}
		
		parameters['tweet']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	/*----------------------------------------------------- twitter timeline -------------------------------------------------------*/
	$("#twtTimeline-count").change(function(){
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	$("#twtTimeline-exclude-replies").change(function(){
        if ($("#twtTimeline-exclude-replies").is(":checked")){
            parameters['twtTimeline']['exclude_replies:'] = true;
        }
        else{
            parameters['twtTimeline']['exclude_replies:'] = false;
        }
        Query =updateString(queryTerm,parameters);
        $("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	$("#twtTimeline-exclude-rts").change(function(){
		if ($("#twtTimeline-exclude-rts").is(":checked")){
			parameters['twtTimeline']['include_rts:'] = false;
		}
		else{
            parameters['twtTimeline']['include_rts:'] = true;
		}
        Query =updateString(queryTerm,parameters);
        $("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	
	$("#twtTimelineFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[],AuthorInformation:[], Entities:[]};
		$.each($(this).find(':selected'),function(i,val){
			var label = $(val.parentNode)[0].label;
			fields[label].push(val.value);
		});
		
		if(fields['BasicFields'].length !== 0){
			$.each(fields['BasicFields'],function(i,val){
				fields_string += '\n\t\t\t' + val;
			});
		}
        if (fields['AuthorInformation'].length !== 0){
            fields_string += '\n\t\t\tuser{' ;
            $.each(fields['AuthorInformation'],function(i,val){
                fields_string += '\n\t\t\t\t' + val;
            });
            fields_string += '\n\t\t\t}' ;
        }

        if (fields['Entities'].length !== 0){
            fields_string += '\n\t\t\tentities{\n\t\t\t\tmedia{\n\t\t\t\t\tmedia_url\n\t\t\t\t}\n\t\t\t}';
        }
		
		parameters['twtTimeline']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});

	/*----------------------------------------------------- Reddit Search-------------------------------------------------------*/
	$("input[name='time']").change(function(){
		parameters['rdSearch']['time:'] = $(this).val();
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	
	$("input[name='sort']").change(function(){
		parameters['rdSearch']['sort:'] = $(this).val();
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	
	//toggle restrict to subreddit checkbox
	$("#rd-subreddit").change(function(){
		if ($("#rd-subreddit").is(':checked')){
			
			$(".form-group.rd-subreddit").show();
			
			parameters['rdSearch']['restrictSr:'] = true;
			$("#subreddit").change(function(){
				parameters['rdSearch']['subreddit:'] = $(this).val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			$("#subreddit").val("");
			parameters['rdSearch']['restrictSr:'] = '';
			parameters['rdSearch']['subreddit:'] =  '';
			$(".form-group.rd-subreddit").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});	
	
	$("#redditSearchFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[]};
		$.each($(this).find(':selected'),function(i,val){
			fields_string += '\n\t\t\t' + val.value;
		});		
		parameters['rdSearch']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});

	/*------------------------------pushshift Post ------------------------------------*/
	$("#ps-subreddit").change(function(){
		if ($("#ps-subreddit").is(':checked')){
			$(".form-group.ps-subreddit").show();
			
			$("#ps-subreddit-name").change(function(){
				parameters['psPost']['subreddit:'] = $(this).val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			$("#ps-subreddit-name").val("");
			parameters['psPost']['subreddit:'] =  '';
			$(".form-group.ps-subreddit").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	$("#ps-author").change(function(){
		if ($("#ps-author").is(':checked')){
			$(".form-group.ps-author").show();
			
			$("#ps-author-name").change(function(){
				parameters['psPost']['author:'] = $(this).val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			$("#ps-author-name").val("");
			parameters['psPost']['author:'] =  '';
			$(".form-group.ps-author").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	$("#ps-dateRange").change(function(){
		if ($("#ps-dateRange").is(':checked')){
			$(".form-group.ps-dateRange").show();
			
			$("#ps-start").change(function(){
				parameters['psPost']['after:'] = epochTime($("#ps-start").val());
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#ps-end").change(function(){
				parameters['psPost']['before:'] = epochTime($("#ps-end").val());
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			parameters['psPost']['before:'] =  '';
			parameters['psPost']['after:'] =  '';
			$(".form-group.ps-dateRange").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	$("#psPostFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[]};
		$.each($(this).find(':selected'),function(i,val){
            fields_string += '\n\t\t\t' + val.value;
		});

		if(fields['BasicFields'].length !== 0){
			fields_string += '\n\t\t\t_source{' ;
			$.each(fields['BasicFields'],function(i,val){
				fields_string += '\n\t\t\t\t' + val;
			});
			fields_string += '\n\t\t\t}' ;
		}
		
		parameters['psPost']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});

		/*------------------------------pushshift Comment ------------------------------------*/
	$("#ps-cm-subreddit").change(function(){
		if ($("#ps-cm-subreddit").is(':checked')){
			$(".form-group.ps-cm-subreddit").show();
			
			$("#ps-cm-subreddit-name").change(function(){
				parameters['psComment']['subreddit:'] = $(this).val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}else{
			$("#ps-cm-subreddit-name").val("");
			parameters['psComment']['subreddit:'] =  '';
			$(".form-group.ps-cm-subreddit").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});	
	$("#ps-cm-author").change(function(){
		if ($("#ps-cm-author").is(':checked')){
			$(".form-group.ps-cm-author").show();
			
			$("#ps-cm-author-name").change(function(){
				parameters['psComment']['author:'] = $(this).val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
			
		}else{
			$("#ps-author-name").val("");
			parameters['psComment']['author:'] =  '';
			$(".form-group.ps-cm-author").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	$("#ps-cm-dateRange").change(function(){
		if ($("#ps-cm-dateRange").is(':checked')){
			$(".form-group.ps-cm-dateRange").show();
			$("#ps-cm-start").change(function(){
				parameters['psComment']['after:'] = epochTime($("#ps-cm-start").val());
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#ps-cm-end").change(function(){
				parameters['psComment']['before:'] = epochTime($("#ps-cm-end").val());
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
			
		}else{
			parameters['psComment']['before:'] =  '';
			parameters['psComment']['after:'] =  '';
			$(".form-group.ps-cm-dateRange").hide();
			
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
		
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	$("#psCommentFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[]};
		$.each($(this).find(':selected'),function(i,val){
			fields_string += '\n\t\t\t' + val.value;
		});		
		parameters['psComment']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});
	/*------------------------------Reddit Post-----------------------------------------*/
	$("#rdPostCount").change(function(){
		parameters['rdPost']['extra:'] = parseInt($("#rdPostCount").val());
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	
	$("#redditPostFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[]};
		$.each($(this).find(':selected'),function(i,val){
			fields_string += '\n\t\t\t' + val.value;
		});		
		parameters['rdPost']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});
	
	/*------------------------------Reddit Comment-----------------------------------------*/
	$("#rdCommentCount").change(function(){
		parameters['rdComment']['extra:'] = parseInt($("#rdCommentCount").val());
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	$("#redditCommentFields").change(function(){
		fields_string = '';
		
		fields = {BasicFields:[]};
		$.each($(this).find(':selected'),function(i,val){
			fields_string += '\n\t\t\t' + val.value;
		});		
		parameters['rdComment']['fields'] = fields_string;
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);

	});

	/*--------------------- Youtube Search Videos, channel, playlist, video by creator-----------------------------*/
	// count
	$("#youtube-count").change(function(){
		parameters['youtubeRandomVideos']['maxTotalResults:'] = parseInt($("#youtube-count").val());
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});
	// order
	$("input[name='ytOrder']").change(function(){
		parameters['youtubeSearchVideo']['order:'] = $(this).val();
		parameters['youtubeCreatorVideos']['order:'] = $(this).val();
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	// duration
	$("input[name='ytDuration']").change(function(){
		parameters['youtubeSearchVideo']['videoDuration:'] = $(this).val();
		parameters['youtubeRandomVideos']['videoDuration:'] = $(this).val();
		parameters['youtubeCreatorVideos']['videoDuration:'] = $(this).val();
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	// advanced
	$("#ytFilters").change(function() {
		if ($("#ytFilters").is(':checked')) {
			$(".form-group.ytFilters").show();
			$("#channelId").change(function () {
				parameters['youtubeSearchVideo']['channelId:'] = $(this).val();
				parameters['youtubeRandomVideos']['channelId:'] = $(this).val();
				parameters['youtubeSearchChannel']['channelId:'] = $(this).val();
				parameters['youtubeSearchPlaylist']['channelId:'] = $(this).val();
				Query = updateString(queryTerm, parameters);
				$("#input").val(`{\n\n` + Query + `\n\n}`);
			});
			$("#regionCode").change(function () {
				parameters['youtubeSearchVideo']['regionCode:'] = $(this).val();
				parameters['youtubeRandomVideos']['regionCode:'] = $(this).val();
				parameters['youtubeSearchChannel']['regionCode:'] = $(this).val();
				parameters['youtubeSearchPlaylist']['regionCode:'] = $(this).val();
				Query = updateString(queryTerm, parameters);
				$("#input").val(`{\n\n` + Query + `\n\n}`);
			});
			$("#relevanceLanguage").change(function () {
				parameters['youtubeSearchVideo']['relevanceLanguage:'] = $(this).val();
				parameters['youtubeRandomVideos']['relevanceLanguage:'] = $(this).val();
				parameters['youtubeSearchChannel']['relevanceLanguage:'] = $(this).val();
				parameters['youtubeSearchPlaylist']['relevanceLanguage:'] = $(this).val();
				Query = updateString(queryTerm, parameters);
				$("#input").val(`{\n\n` + Query + `\n\n}`);
			});
		}
		else{
			$(".form-group.ytFilters").hide();
			parameters['youtubeSearchVideo']['channelId:'] = '';
			parameters['youtubeRandomVideos']['channelId:'] = '';
			parameters['youtubeSearchChannel']['channelId:'] = '';
			parameters['youtubeSearchPlaylist']['channelId:'] = '';
			parameters['youtubeSearchVideo']['regionCode:'] = '';
			parameters['youtubeRandomVideos']['regionCode:'] = '';
			parameters['youtubeSearchChannel']['regionCode:'] = '';
			parameters['youtubeSearchPlaylist']['regionCode:'] = '';
			parameters['youtubeSearchVideo']['relevanceLanguage:'] = '';
			parameters['youtubeRandomVideos']['relevanceLanguage:'] = '';
			parameters['youtubeSearchChannel']['relevanceLanguage:'] = '';
			parameters['youtubeSearchPlaylist']['relevanceLanguage:'] = '';
			Query =updateString(queryTerm,parameters);
			$("#input").val(`{\n\n` + Query +`\n\n}`);
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
	});

	// published range
	$("#ytDateRange").change(function() {
		if ($("#ytDateRange").is(':checked')) {
			$(".form-group.ytDateRange").show();
			$("#publishedAfter").change(function(){
				let publishedAfter = new Date($("#publishedAfter").val());
				parameters['youtubeSearchVideo']['publishedAfter:'] =  publishedAfter.toISOString();
				parameters['youtubeRandomVideos']['publishedAfter:'] =  publishedAfter.toISOString();
				parameters['youtubeSearchChannel']['publishedAfter:'] =  publishedAfter.toISOString();
				parameters['youtubeSearchPlaylist']['publishedAfter:'] =  publishedAfter.toISOString();
				parameters['youtubeCreatorVideos']['publishedAfter:'] =  publishedAfter.toISOString();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#publishedBefore").change(function(){
				let publishedBefore = new Date($("#publishedBefore").val());
				parameters['youtubeSearchVideo']['publishedBefore:'] =  publishedBefore.toISOString();
				parameters['youtubeRandomVideos']['publishedBefore:'] =  publishedBefore.toISOString();
				parameters['youtubeSearchChannel']['publishedBefore:'] =  publishedBefore.toISOString();
				parameters['youtubeSearchPlaylist']['publishedBefore:'] =  publishedBefore.toISOString();
				parameters['youtubeCreatorVideos']['publishedBefore:'] =  publishedBefore.toISOString();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
		}
		else{
			$(".form-group.ytDateRange").hide();
			parameters['youtubeSearchVideo']['publishedAfter:'] = '';
			parameters['youtubeRandomVideos']['publishedAfter:'] = '';
			parameters['youtubeSearchChannel']['publishedAfter:'] = '';
			parameters['youtubeSearchPlaylist']['publishedAfter:'] = '';
			parameters['youtubeCreatorVideos']['publishedAfter:'] = '';

			parameters['youtubeSearchVideo']['publishedBefore:'] = '';
			parameters['youtubeRandomVideos']['publishedBefore:'] = '';
			parameters['youtubeSearchChannel']['publishedBefore:'] = '';
			parameters['youtubeSearchPlaylist']['publishedBefore:'] = '';
			parameters['youtubeCreatorVideos']['publishedBefore:'] = '';

			Query =updateString(queryTerm,parameters);
			$("#input").val(`{\n\n` + Query +`\n\n}`);
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}
	});


	// location
	$("#ytGeoSearch").change(function(){
		if ($("#ytGeoSearch").is(':checked')) {
			$(".form-group.ytGeoSearch").show();
			$("#ytLocation").change(function(){
				parameters['youtubeSearchVideo']['location:'] = $("#ytLocation").val();
				parameters['youtubeRandomVideos']['location:'] = $("#ytLocation").val();
				parameters['youtubeCreatorVideos']['location:'] = $("#ytLocation").val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
			$("#ytLocationRadius").change(function(){
				parameters['youtubeSearchVideo']['locationRadius:'] = $("#ytLocationRadius").val();
				parameters['youtubeRandomVideos']['locationRadius:'] = $("#ytLocationRadius").val();
				parameters['youtubeCreatorVideos']['locationRadius:'] = $("#ytLocationRadius").val();
				Query =updateString(queryTerm,parameters);
				$("#input").val(`{\n\n` + Query +`\n\n}`);
			});
		}
		else {
			$(".form-group.ytGeoSearch").hide();
			parameters['youtubeSearchVideo']['location:'] = '';
			parameters['youtubeRandomVideos']['location:'] = '';
			parameters['youtubeCreatorVideos']['location:'] = '';
			parameters['youtubeSearchVideo']['locationRadius:'] = '';
			parameters['youtubeRandomVideos']['locationRadius:'] = '';
			parameters['youtubeCreatorVideos']['locationRadius:'] = '';
			Query =updateString(queryTerm,parameters);
			$("#input").val(`{\n\n` + Query +`\n\n}`);
			if ( $('.dropdown.dropdown-lg.open').length ){
				pushAdvancedDropdown('on');
			}
		}

	});

	/*---------------------------------------------- Youtube most popular---------------------------------------*/
	$("#youtube-most-popular-count").change(function(){
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	// localized language
	$("#ytHl").change(function(){
		parameters['youtubeMostPopular']['hl:'] = $(this).val();
		Query =updateString(queryTerm,parameters);
		$("#input").val(`{\n\n` + Query +`\n\n}`);
	});

	// video category
	$("#ytVideoCategoryId").change(function () {
		parameters['youtubeMostPopular']['videoCategoryId:'] = $(this).val();
		Query = updateString(queryTerm, parameters);
		$("#input").val(`{\n\n` + Query + `\n\n}`);
	});


	/*----------------------set intervals--------------------------------------------*/
	$('input[name=histogram-interval]').change(function(){
		setHitogramInterval($("input[name=histogram-interval]:checked").val());
	});
}

function epochTime(datestring){
	return new Date(datestring).getTime() / 1000
}

function constructQuery(parameterObj){
	var keys = [];
	$.each(Object.keys(parameterObj),function(i,item){
		if (item !== 'fields' && parameterObj[item] !== '' && item !=='pageNum:'){
			keys.push(item);
		}
	});
	
	var query = '';
	$.each(keys, function(i,key){
		if (typeof parameterObj[key] === 'string'){
			query += key + `"` + parameterObj[key] + `"`;
		}else{
			query += key + parameterObj[key];
		}
	
		if (i!==keys.length-1){
			query += `,`;
		}
	});
	
	query +=  `){` + parameterObj.fields;

	return query;

}
		
function updateString(queryTerm, parameters){
	var query = '';
	if (queryTerm === 'getTimeline'){
		query = `\ttwitter{\n\t\t${queryTerm}(${constructQuery(parameters.twtTimeline)}\n\t\t}\n\t}`;
	}
	else if(queryTerm === 'queryTweet'){
		query =  `\ttwitter{\n\t\t${queryTerm}(${constructQuery(parameters.tweet)}\n\t\t}\n\t}`;
	}
	else if(queryTerm === 'queryTweetV2'){
		query =  `\ttwitter{\n\t\t${queryTerm}(${constructQuery(parameters.tweetV2)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'queryReddit'){
		query =  `\treddit{\n\t\tsearch(${constructQuery(parameters.rdSearch)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'redditPost'){
		query =  `\treddit{\n\t\tgetNew(${constructQuery(parameters.rdPost)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'redditComment'){
		query =  `\treddit{\n\t\tgetNewComments(${constructQuery(parameters.rdComment)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'pushshiftPost'){
		query =  `\treddit{\n\t\tpushshiftPost(${constructQuery(parameters.psPost)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'pushshiftComment'){
		query =  `\treddit{\n\t\tpushshiftComment(${constructQuery(parameters.psComment)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeSearchVideo'){
		query = `\tyoutube{\n\t\tsearch(${constructQuery(parameters.youtubeSearchVideo)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeRandomVideos'){
		query = `\tyoutube{\n\t\trandomSearch(${constructQuery(parameters.youtubeRandomVideos)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeSearchChannel'){
		query = `\tyoutube{\n\t\tsearch(${constructQuery(parameters.youtubeSearchChannel)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeSearchPlaylist'){
		query = `\tyoutube{\n\t\tsearch(${constructQuery(parameters.youtubeSearchPlaylist)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeMostPopular'){
		query = `\tyoutube{\n\t\tvideos(${constructQuery(parameters.youtubeMostPopular)}\n\t\t}\n\t}`;
	}
	else if (queryTerm === 'youtubeCreatorVideos'){
		query = `\tyoutube{\n\t\tvideosByHandle(${constructQuery(parameters.youtubeCreatorVideos)}\n\t\t}\n\t}`;
	}
	
	return query;
}

/* submit a one page dry run search to allow the user see results */
function dryRun(searchID){
	if ( formValid(searchID)){
        $("#saveButton").attr('name',searchID);
		if (searchID === '#searchbox'){
			submitSearchbox('#searchbox','#sn-filename', dryrun = true)
		}
		else if (searchID === '#input'){
            submitQuery('#input','#sn-filename', dryrun = true);
		}
	}
}

/* save file modal click events */
function saveButtonClick(){
	var searchID = $("#saveButton").attr('name');
	if (searchID === '#searchbox'){
		if (saveValid('#sn-filename')){ 
			submitSearchbox('#searchbox','#sn-filename', dryrun = false);
		}
					
	}
	else if (searchID === '#input'){
		if (saveValid('#sn-filename')){
			submitQuery('#input','#sn-filename', dryrun = false);
		}
	}
}

/* until setting */
function setDate(){
	var current = new Date();
	var max = current.toISOString().slice(0,10);
	current.setDate(current.getDate()-6);
	var min = current.toISOString().slice(0,10);
	
	$("#until").attr('min', min);
	$("#until").attr('max', max);
}


function setHitogramInterval(freq){
	var filename = $("#sn-filename").val();
	
	var queryTerm = $("#social-media").find(':selected').val();
	var prefix ;
	if (queryTerm === 'queryTweet'){
		prefix = 'twitter-Tweet';
	}else if (queryTerm === 'queryTweetV2'){
		prefix = 'twitterV2-Tweet';
	}else if (queryTerm === 'getTimeline'){
		prefix = 'twitter-Timeline';
	}else if (queryTerm === 'queryReddit'){
		prefix = 'reddit-Search';
	}else if (queryTerm === 'redditPost'){
		prefix = 'reddit-Post';
	}else if (queryTerm === 'redditComment'){
		prefix = 'reddit-Comment';
	}else if (queryTerm === 'pushshiftPost'){
		prefix = 'reddit-Historical-Post';
	}else if (queryTerm === 'pushshiftComment'){
		prefix = 'reddit-Historical-Comment';
	}else if (queryTerm === 'youtubeSearchVideo') {
		prefix = 'youtube-Search-Video';
	}else if (queryTerm === 'youtubeRandomVideos'){
		prefix = 'youtube-Random-Videos';
	}else if (queryTerm === 'youtubeSearchChannel'){
		prefix = 'youtube-Search-Channel';
	}else if (queryTerm === 'youtubeSearchPlaylist'){
		prefix = 'youtube-Search-Playlist';
	}else if (queryTerm === 'youtubeMostPopular'){
		prefix = 'youtube-Most-Popular';
	}else if (queryTerm === 'youtubeCreatorVideos'){
		prefix = 'youtube-Creator-Videos'
	}
	
	if (prefix === undefined || filename === '' || filename === undefined){
		$("#modal-message").append(`<h4>Incomplete information for histogram. Please make sure you have specified a data source, as well as retrieved data first.</h4>`);
		$("#alert").modal('show');
	}else{
		
		$("#img-container").empty();
		$("#histogram-panel .loading").show();
		
		$.ajax({
			type:'POST',
			url:'histogram', 
			data: JSON.stringify({
					'filename':filename + '.csv',
					'remoteReadPath': '/GraphQL/' + prefix + '/' + filename,
					'interval': freq }),	
			contentType: "application/json",			
			success:function(data){
				$("#histogram-panel .loading").hide();
				if ('ERROR' in data){
					$("#error").val(JSON.stringify(data));
					$("#warning").modal('show');
				}else{
					$("#img-container").append(`<div class="x_content">
									<div class="note">
										<li><b>click, drag, and mouseover</b> the graph will give you more information</li>
										<li><b>hover</b> over top-right corner of the chart will present various operations</li>
										<li>details please consult 
											<a href="https://plot.ly/" target="_blank">
												<img src="bootstrap/img/logo/plotly.png" width="18px"/>Plotly
											</a>
										</li>
									</div>
								</div>
								<div class="x_content">`+data.histogram+`</div>`);
				}
			},
			error: function(jqXHR, exception){
				$("#error").val(jqXHR.responseText);
				$("#warning").modal('show');				
			} 
		}); 
	}
}

function pushAdvancedDropdown(state){
	if (state === 'on'){
		var height = $('.input-group-addon-btn').find('.dropdown-menu.dropdown-menu-right').height();
		$(".input-group-addon-btn").css('margin-bottom',height);
	}else if (state === 'off'){
		$(".input-group-addon-btn").css('margin-bottom','0px');
	}
}

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}


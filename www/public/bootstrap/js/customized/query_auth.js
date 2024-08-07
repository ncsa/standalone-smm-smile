function authorize(platform){
    // showing the check mark
    $(`#${platform}-auth`).find(".export-success").show();

    // toggle the second auth panel
    $("#unauthorized").find("." + platform + "-auth").hide();
    $("#authorized").find("#" + platform + "-authorized").show();

    // enable the authorized platform selection
    if (platform === 'twitter') {
        $("#social-media option[value='queryTweet']").removeAttr('disabled');
        $("#social-media option[value='getTimeline']").removeAttr('disabled');
    }
    else if (platform === 'twitterV2') {
        $("#social-media option[value='queryTweetV2']").removeAttr('disabled');
        $("#social-media option[value='getTimelineV2']").removeAttr('disabled');
    }
    else if (platform === 'reddit') {
        $("#social-media option[value='queryReddit']").removeAttr('disabled');
        $("#social-media option[value='redditPost']").removeAttr('disabled');
        $("#social-media option[value='redditComment']").removeAttr('disabled');
    }
    else if (platform === 'youtube') {
        $("#social-media option[value='youtubeSearchVideo']").removeAttr('disabled');
        $("#social-media option[value='youtubeRandomVideos']").removeAttr('disabled');
        $("#social-media option[value='youtubeSearchChannel']").removeAttr('disabled');
        $("#social-media option[value='youtubeSearchPlaylist']").removeAttr('disabled');
        $("#social-media option[value='youtubeMostPopular']").removeAttr('disabled');
        $("#social-media option[value='youtubeCreatorVideos']").removeAttr('disabled');
    }
}

$(document).ready(function () {
    $.ajax({
        type: 'get',
        url: "authorized",
        success: function(data) {
            if ('ERROR' in data) {
                $("#error").val(JSON.stringify(data));
                $("#warning").modal("show");
            } else {
                // Dynamically find authorization elements
                $('[id$="-auth"]').each(function () {
                    var platformId = $(this).attr('id'); // e.g., "reddit-auth"
                    var platform = platformId.replace('-auth', ''); // Removes '-auth', leaves "reddit"

                    // Check if data contains the platform and if it is authorized
                    if (data[platform]) {
                        authorize(platform);
                    }
                });
            }
        }
    });
});


$("#auth-next").on("click", function () {
    $("#auth-panel").hide();
    $("#searchPage").show();
});


/****************************** TWITTER ******************************/
$("#twitter-pin-submit").on('click', function () {
    console.log('clicked');
    $.ajax({
        type: 'post',
        url: 'login/twitter',
        data: {
            "twt_pin": $("#twitter-pin").val(),
        },
        success: function (data) {
            if ('ERROR' in data) {
                $("#error").val(JSON.stringify(data));
                $("#warning").modal('show');
            }
            else {
                location.reload(true);
            }
        },
        error: function (jqXHR, exception) {
            $("#error").val(jqXHR.responseText);
            $("#warning").modal('show');
        }
    });
});
$("#twitter-pin").on('keyup', function (e) {
    if (e.keyCode == 13 || e.keyCode == 10) {
        $.ajax({
            type: 'post',
            url: 'login/twitter',
            data: {"twt_pin": $("#twitter-pin").val()},
            success: function (data) {
                if ('ERROR' in data) {
                    $("#error").val(JSON.stringify(data));
                    $("#warning").modal('show');
                }
                else {
                    location.reload(true);
                }
            },
            error: function (jqXHR, exception) {
                $("#error").val(jqXHR.responseText);
                $("#warning").modal('show');
            }
        });
    }
});
$(".twitter-auth").find('a').on('click', function () {
    $("#twitter-callback").modal('show');
});


/****************************** Youtube ******************************/
$("#submitYoutubeApiKey").on('click', function () {
    console.log('clicked');
    $.ajax({
        type: 'post',
        url: 'login/google/apikey',
        data: {
            "apiKey": $("#youtubeApiKey").val(),
        },
        success: function (data) {
            if ('ERROR' in data) {
                $("#error").val(JSON.stringify(data));
                $("#warning").modal('show');
            }
            else {
                location.reload(true);
            }
        },
        error: function (jqXHR, exception) {
            $("#error").val(jqXHR.responseText);
            $("#warning").modal('show');
        }
    });
});

$("#youtubeApiKeyLink").on('click', function () {
    $("#youtube-apikey-modal").modal('show');
});

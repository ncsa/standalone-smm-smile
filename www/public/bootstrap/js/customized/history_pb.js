$.getScript("bootstrap/js/customized/view_helperFunc.js", function(){

    $(document).ready(function () {

        // google chart
        google.charts.load('current', {packages: ['wordtree']});

        $.ajax({
            type: 'POST',
            url: 'list-all',
            data: {},
            success: function (data) {
                if (data) {
                    if ('ERROR' in data) {
                        $("#loading").hide();
                        $("#search-tag-results").empty();
                        $("#import-background").hide();
                        $("#search-background").show();
                        $("#error").val(JSON.stringify(data));
                        $("#warning").modal('show');
                    } else {
                        console.log(data);

                        // first level setup
                        $.each(data, function (key, val) {
                            var firstLevel;
                            if (key === 'ML') {
                                firstLevel = 'Machine Learning';
                            } else if (key === 'NLP') {
                                firstLevel = 'Nature Language Processing';
                            } else if (key === 'NW') {
                                firstLevel = 'Network Visualization and Analysis';
                            } else if (key === 'GraphQL') {
                                firstLevel = 'Social Media Data';
                            } else {
                                firstLevel = key;
                            }

                            $(".nav.nav-sidebar").append(
                                `<li>
                                    <a onclick="toggle(this,${key});" id="${key}-btn">
                                        <i class="fas fa-minus"></i>&nbsp${firstLevel}
                                    </a>
                                </li>
                                <ul class="nav child_menu" style="display:block;" id="${key}"></ul>`);

                            // Setup second level for GraphQL
                            if (key === 'GraphQL') {
                                $("#" + key).append(
                                    `<li>
                                        <a onclick="toggle(this,'#GraphQL-Reddit');" id="GraphQL-Reddit-btn">
                                            <i class="fas fa-plus"></i>&nbsp;Reddit
                                        </a>
                                        <ul class="nav child_menu" style="display:none;" id="GraphQL-Reddit"></ul>
                                    </li>
                                    <li>
                                        <a onclick="toggle(this,'#GraphQL-YouTube');" id="GraphQL-YouTube-btn">
                                            <i class="fas fa-plus"></i>&nbsp;YouTube
                                        </a>
                                        <ul class="nav child_menu" style="display:none;" id="GraphQL-YouTube"></ul>
                                    </li>
                                    <li>
                                        <a onclick="toggle(this,'#GraphQL-Twitter');" id="GraphQL-Twitter-btn">
                                            <i class="fas fa-plus"></i>&nbsp;Twitter
                                        </a>
                                        <ul class="nav child_menu" style="display:none;" id="GraphQL-Twitter"></ul>
                                    </li>`);
                                    }
                                });

                        // Fill in each category
                        $.each(data, function (key, val) {
                            if (key === 'GraphQL') {
                                $.each(val, function (key1, val1) {
                                    var secondLevel, parentElement;
                                    if (key1.toLowerCase().includes('twitter')) {
                                        secondLevel = 'Twitter';
                                        parentElement = '#GraphQL-Twitter';
                                    } else if (key1.toLowerCase().includes('reddit')) {
                                        secondLevel = 'Reddit';
                                        parentElement = '#GraphQL-Reddit';
                                    } else if (key1.toLowerCase().includes('youtube')) {
                                        secondLevel = 'YouTube';
                                        parentElement = '#GraphQL-YouTube';
                                    } else {
                                        secondLevel = key1;
                                        parentElement = '#' + key;
                                    }
                                    var secondLevelEntryNum = Object.keys(val1).length || 0;

                                    $(parentElement).append(
                                        `<li>
                                            <a onclick="toggle(this,'#GraphQL-${secondLevel}-${key1}');" id="GraphQL-${secondLevel}-${key1}-btn">
                                                <i class="fas fa-plus"></i>&nbsp;${key1} (${secondLevelEntryNum})
                                            </a>
                                            <ul class="nav child_menu" style="display:none;" id="GraphQL-${secondLevel}-${key1}"></ul>
                                        </li>`);

                                    $.each(val1, function (key2, val2) {
                                        $("#GraphQL-" + secondLevel + "-" + key1).append(
                                            `<li id="GraphQL-${key1}-${key2}">
                                                <a class="historyTabs" onclick="submitHistory(this, '${val2}');">${key2}</a>
                                            </li>`);
                                    });
                                });
                            } else {
                                $.each(val, function (key1, val1) {
                                    var secondLevelEntryNum = Object.keys(val1).length || 0;
                                    $("#" + key).append(
                                        `<li>
                                            <a onclick="toggle(this,'#${key1}');" id="${key1}-btn">
                                                <i class="fas fa-plus"></i>&nbsp;${key1} (${secondLevelEntryNum})
                                            </a>
                                            <ul class="nav child_menu" style="display:none;" id="${key1}"></ul>
                                        </li>`);

                                    $.each(val1, function (key2, val2) {
                                        $("#" + key1).append(
                                            `<li id="${key1}-${key2}">
                                                <a class="historyTabs" onclick="submitHistory(this, '${val2}');">${key2}</a>
                                            </li>`);
                                    });
                                });
                            }
                        });

                        $("#historyListLoading").hide();
                        $("#historyLogo").show();
                        listTag();
                    }
                }
            },
            error: function (jqXHR, exception) {
                $("#error").val(jqXHR.responseText);
                $("#warning").modal('show');
            }
        });

    });

    $("#deleteButton").on('click', function (e) {
        e.preventDefault();
        var folderURL = $(this).attr('folder-url');
        deleteHistory(folderURL);
    });

    /* search tag */
    $("#search-tag").on("keyup", function (e) {
        if (e.keyCode == 13 || e.keyCode == 10) {

            var tagName = $("#search-tag").val();
            $("#search-tag-results").empty();

            $.ajax({
                type: 'GET',
                url: 'tag',
                data: {tagName: tagName},
                success: function (data) {
                    if (Object.keys(data).length === 0) {
                        $("#search-tag-results").append(`<div class="list-container">
                                                <cite>cannot find matching tag</cite></div>`);
                    }
                    else {
                        for (var uuid in data) {
                            $("#search-tag-results").append(
                                `<div class="list-container">
                                            <h4>
                                                <a class="page-title" onclick="submitHistory(this, '` + uuid + `')">` + uuid + `</a>
                                            </h4>
                                            <cite>` + data[uuid] + `</cite>
                                        </div>`
                            );
                        }
                    }
                },
                error: function (jqXHR, exception) {
                    $("#error").val(jqXHR.responseText);
                    $("#warning").modal('show');
                }
            });
        }
    });

    $("#search-tag-btn").on("click", function (e) {

        var tagName = $("#search-tag").val();
        $("#search-tag-results").empty();
        $.ajax({
            type: 'GET',
            url: 'tag',
            data: {tagName: tagName},
            success: function (data) {
                if (Object.keys(data).length === 0) {
                    $("#search-tag-results").append(`<div class="list-container">
                                            <cite>cannot find matching tag</cite></div>`);
                }
                else {
                    for (var uuid in data) {
                        $("#search-tag-results").append(
                            `<div class="list-container">
							<h4>
								<a class="page-title" onclick="submitHistory(this, '` + uuid + `')">` + uuid + `</a>
							</h4>
							<cite>` + data[uuid] + `</cite>
						</div>`
                        );
                    }
                }
            },
            error: function (jqXHR, exception) {
                $("#error").val(jqXHR.responseText);
                $("#warning").modal('show');
            }
        });
    });

    $("#search-tag-invoke").on("click", function (e) {
        $("#title-container").empty();
        $("#overview-title").hide();
        $("#overview-container").empty();
        $("#img-container").empty();
        $("#result-container").empty();
        $("#gaudge").empty();
        $("#title").empty();
        $("#d3js-container").hide();
        $("#loading").hide();
        $("#import-background").hide();

        $("#search-tag-results").empty();
        $("#search-background").show();
    });

    $("#import-invoke").on("click", function (e) {
        $("#title-container").empty();
        $("#overview-title").hide();
        $("#overview-container").empty();
        $("#img-container").empty();
        $("#result-container").empty();
        $("#gaudge").empty();
        $("#title").empty();
        $("#d3js-container").hide();
        $("#loading").hide();
        $("#search-background").hide();


        $("#import-background").show();
    });

});

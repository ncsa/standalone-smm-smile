$("#datasrc-category").on("change", function(){
    // TODO: need to think other features such as get comments feature in Reddit, which has to require a "id"

    $("#userspec-Others-metadata").hide();

    var selectedItem = $(this).find("option:selected").val();

    if (selectedItem === 'twitter-Tweet' || selectedItem === 'twitterV2-Tweet' || selectedItem === 'twitter-Timeline'){
        $("#datasrc-criteria").html("<p>Make sure your file has column <u>text</u>.</p>")
    }
    else if (selectedItem === 'reddit-Post') {
        $("#datasrc-criteria").html("<p>Make sure your file has column <u>title</u> " +
            "and/or column <u>description</u>.</p>")
    }
    else if (selectedItem === 'reddit-Comment') {
        $("#datasrc-criteria").html("<p>Make sure your file has column <u>body</u>.</p>")
    }
    else if (selectedItem === 'youtube-Search-Video' || selectedItem === 'youtube-Search-Channel'|| selectedItem === 'youtube-Search-Playlist') {
        $("#datasrc-criteria").html("<p>Make sure your file has column <u>title</u>, <u>description</u>, " +
            "<u>snippet.title</u>, or <u>snippet.description</u>.</p>")
    }
    else if (selectedItem === 'userspec-Others') {
        $("#datasrc-criteria").html("<p>You provide the <u>column headers</u> that you would like to analyze, as well as select " +
            "the <u>analyses</u> you would like to perform.</p>")

        $("#userspec-Others-metadata").show();
    }
    else{
        $("#datasrc-criteria").text("");
    }

});

$("#userspec-Others-setHeaders").find('button').on('click', function(){
    if (headerFormValidate()){
        var analyses = [];
        $("#datasrc-analyses").find('input[name=datasrc-analyses]:checked').each(function(){
            analyses.push($(this).val());
        });

        var customColumnHeaders = [];
        $("#column-header-selection").find("input[type=checkbox]:checked").each(function(i, val){
            customColumnHeaders.push($(val).val());
        });

        $.ajax({
            type:'POST',
            url:'add-columnHead',
            data: JSON.stringify({
                analyses:analyses,
                customColumnHeaders: customColumnHeaders
            }),
            contentType: "application/json;charset=utf-8",
            dataType:"json",
            success:function(data){
                $("#userspec-Others-setHeaders").find("button").hide();
                $("#userspec-Others-setHeaders").find("img").show();
            },
            error: function(jqXHR, exception){
                $("#error").val(jqXHR.responseText);
                $("#warning").modal('show');
            }
        });
    }
});

$("#import-btn").on("click", function(){
    if (importFormValidate()) {

        $(this).hide();
        $("#import-btn-loading").show();

        var selectedItem = $("#datasrc-category").find("option:selected").val();
        var importFile = $("#importFile").get(0).files[0];

        var keywords = [];
        $("#datasrc-keywords").parent().find(".tag.label.label-info").each(function(i, val){
            keywords.push($(val).text());
        });


        var formData = new FormData();
        formData.append('importFile', importFile, importFile.name);
        formData.append('selectedItem', selectedItem);
        formData.append('keywords', keywords);

        $.ajax({
            type: 'POST',
            url: 'import',
            data: formData,
            processData: false,
            contentType: false,
            async: true,
            cache: false,
            success: function (data) {
                $("#import-btn-loading").hide();
                if ('ERROR' in data) {
                    $(".loading").hide();
                    $(this).show();
                    $("#error").val(JSON.stringify(data));
                    $("#warning").modal('show');
                } else {
                    $(".loading").hide();
                    $("#import-cloud-confirmation").modal('show');
                }
            },
            error: function (jqXHR, exception) {
                $("#import-btn-loading").hide();
                $(this).show();
                $("#error").val(jqXHR.responseText);
                $("#warning").modal('show');
            }
        });
    }
});

$("#import-cloud-confirmation").find('button').on('click', function(){
    location.reload();
});

function importFormValidate(){

    if ($("#importFile").get(0).files[0] === undefined){
        $("#modal-message").append(`<h4>You have to upload a file!</h4>`);
        $("#alert").modal('show');
        return false;
    }

    var category = $("#datasrc-category").find("option:selected").val();
    if (category === 'Please Select...'){
        $("#modal-message").append(`<h4>You have to pick a category!</h4>`);
        $("#alert").modal('show');
        return false;
    }

    if ($("#datasrc-keywords").parent().find(".tag.label.label-info").length === 0){
        $("#modal-message").append(`<h4>You have to give at least one keyword!</h4>`);
        $("#alert").modal('show');
        return false;
    }

    // check if category is valid or not (use the select box generated by column header)
    var importedColumnHeaders = [];
    $("#column-header-selection").find("input[type=checkbox]").each(function(i, val){
        importedColumnHeaders.push($(val).val());
    });
    if (category === "twitter-Tweet" || category === 'twitterV2-Tweet' || category === "twitter-Timeline"){
        if (importedColumnHeaders.indexOf('text') === -1){
            $("#modal-message").append(`<h4>Your file must have <u>text</u> column to be categorized ` +
                `as Twitter Tweet.</h4>`);
            $("#alert").modal('show');
            return false;
        }
    }
    else if (category === 'reddit-Post'){
        if (importedColumnHeaders.indexOf('title') === -1 && importedColumnHeaders.indexOf('description') === -1 ){
            $("#modal-message").append(`<h4>Your file must have <u>title</u> and/or <u>description</u> column to be ` +
                `categorized as Reddit submission (post) collection.</h4>`);
            $("#alert").modal('show');
            return false;
        }
    }
    else if (category === 'reddit-Comment'){
        if (importedColumnHeaders.indexOf('body') === -1){
            $("#modal-message").append(`<h4>Your file must have <u>body</u> column to be ` +
                `categorized as Reddit comment collection.</h4>`);
            $("#alert").modal('show');
            return false;
        }
    }
    else if (category === 'youtube-Search-Video' || category === 'youtube-Search-Channel'|| category === 'youtube-Search-Playlist') {
        if (importedColumnHeaders.indexOf('title') === -1
            && importedColumnHeaders.indexOf('description') === -1
            && importedColumnHeaders.indexOf('snippet.description') === -1
            && importedColumnHeaders.indexOf('snippet.description') === -1
        ){
            $("#modal-message").append("<h4>Your file must have <u>title</u> and/or <u>description</u> " +
                "and/or <u>snippet.title</u> and/or <u>snippet.description</u> column to be " +
                "categorized as YouTube video/channel/playlist search collection.</h4>");
            $("#alert").modal('show');
            return false;
        }
    }

    return true;
}

function headerFormValidate(){
    // must provide column headers
    if ($("#column-header-selection").find("input[type=checkbox]:checked").length === 0){
        $("#modal-message").append(`<h4>You have to provide at least one column header!</h4>`);
        $("#alert").modal('show');
        return false;
    }

    // must select an analyses
    if ($("#datasrc-analyses").find('input[name=datasrc-analyses]:checked').length <= 0){
        $("#modal-message").append(`<h4>You have to select at least one analysis you want to perform!</h4>`);
        $("#alert").modal('show');
        return false;
    }

    return true;
}

function listColumnHeadersRules(){
    $.ajax({
        type:'GET',
        url:'list-columnHead',
        data: {},
        success:function(data){
            if ('ERROR' in data){
                $("#error").val(JSON.stringify(data));
                $("#warning").modal('show');
            }else{

                $("#column-headers-area").empty();

                var tableContent = `<div class="table-responsive"><table class="table table-striped table-bordered"><tbody>`;
                $.each(data, function(key,value){
                    tableContent += `<tr><th>` + key + `</th><td>` + JSON.stringify(value) + `</td></tr>`;
                });
                tableContent += `</td></tr></tbody></table></div>`;

                $("#column-headers-area").append(tableContent);
            }
        },
        error: function(jqXHR, exception){
            $("#error").val(jqXHR.responseText);
            $("#warning").modal('show');
        }
    });
}

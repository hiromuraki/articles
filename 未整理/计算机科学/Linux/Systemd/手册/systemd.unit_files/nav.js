
$(document).ready(function() {
    $.getJSON("../index.json", function(data) {
        data.sort().reverse();

        var [filename, dirname] = window.location.pathname.split("/").reverse();

        var items = [];
        $.each( data, function(_, version) {
            if (version == dirname) {
                items.push( "<option selected value='" + version + "'>" + "systemd " + version + "</option>");
            } else if (dirname == "latest" && version == data[0]) {
                items.push( "<option selected value='" + version + "'>" + "systemd " + version + "</option>");
            } else {
                items.push( "<option value='" + version + "'>" + "systemd " + version + "</option>");
            }
        });

        $("span:first").html($( "<select/>", {
            id: "version-selector",
            html: items.join( "" )
        }));

        $("#version-selector").on("change", function() {
            window.location.assign("../" + $(this).val() + "/" + filename);
        });
    });
});

$(function () {
    var bar = '<nav class="navbar navbar-expand-sm navbar-light justify-content-between sticky-top" style="background-color: #F1F1F1">\
    <a class="navbar-brand head_typo" href="main">OTOG<span> - One Tambon One Grader</span></a>\
    <ul class="navbar-nav">\
        <li class="nav-item">\
            <a id="main" class="nav-link head_typo" href="/main">\
                <i class="fa fa-home"></i> <span>Main</span>\
            </a>\
        </li>\
        <li class="nav-item">\
            <a id="prob" class="nav-link head_typo" href="/problems">\
                <i class="fa fa-puzzle-piece"></i> <span>Problems</span>\
            </a>\
        </li>\
        <li class="nav-item">\
            <a id="contest" class="nav-link head_typo" href="/contest">\
                <i class="fa fa-trophy"></i> <span>Contest</span>\
                <!-- contest notification \
                <sup class="notif blink"><span class="badge badge-warning\
                    badge-pill d-none d-lg-inline-block">New</span>\
                </sup>-->\
            </a>\
        </li>\
        <li class="nav-item">\
            <a id="rate" class="nav-link head_typo" href="/ratings">\
                <i class="fa fa-bar-chart"></i> <span>Ratings</span>\
            </a>\
        </li>\
        <li class="nav-item">\
            <a id="login_but" class="nav-link head_typo" href="/login">\
                <i class="fa fa-sign-in"></i> <span>Login</span>\
            </a>\
        </li>\
    </ul>\
</nav>';
    $("#navbar-frame").html(bar);
    $("#navbar-frame").addClass("sticky-top");
 
    var id = getValueByName("id");
    $("#" + id).addClass("active");
});
 
function getValueByName(name) {
    var url = document.getElementById('nav-bar').getAttribute('src');
    if (url.indexOf("?") != -1) {
        var source = url.split("?")[1];
        items = source.split("&");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var parameters = item.split("=");
            if (parameters[0] == name) {
                return parameters[1];
            }
        }
    }
}
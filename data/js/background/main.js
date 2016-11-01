$(document).ready(function () {
//    var xhttp = new XMLHttpRequest();
//    xhttp.open('GET', config.service.pop, true);
//    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//    xhttp.withCredentials = "true";
//    xhttp.onreadystatechange = function () {
//        if (xhttp.readyState == 4 && xhttp.status == 200) {
//            var htmlObject = document.createElement('div');
//            $(htmlObject).html(xhttp.responseText);
//            $("body").html(htmlObject);
//        } else {
////            console.log("Submit error", xhttp);
//        }
//    };
//    xhttp.send();

    $.get(config.service.pop, function (data) {
        $("body").html(data);
        $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });
    });
});
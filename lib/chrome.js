var main = {};

main.onload = function () {
    var uri = window.location.hostname;
    $.each(config.domains, function (_domain, _val) {
        if (uri.indexOf(_domain) > 0) {
            console.log("---> domain: ", _domain);
            //Cau hinh su kien
            action.init(_val, _domain, "chrome");
            //Dừng lệnh khi gặp dúng domain
            return false;
        }
    });
};

$(document).ready(function () {
    main.onload();
});
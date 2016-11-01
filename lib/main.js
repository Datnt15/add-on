var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
//var buttons = require("sdk/ui/button/action");
var panels = require("sdk/panel");
var buttons = require('sdk/ui/button/toggle');

var button = buttons.ToggleButton({
    id: "attach-script",
    label: "Alodathang",
    icon: {
        "16": data.url("icon/logo_16.png"),
        "32": data.url("icon/logo_32.png"),
        "64": data.url("icon/logo_64.png")
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: data.url("index.html"),
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

tabs.activeTab.on('ready', function (tab) {
//    console.log("--------> ", tab);
    var domains = {
		"taobao.com": "taobao",
        "tmall.com": "tmall",
        "1688.com": "web1688",
        "jd.com": "jd",
        "amazon.cn": "amazoncn",
        "aliexpress.com": "aliexpress",
        "alibaba.com": "alibaba",
        "amazon.com": "amazoncom",
        "ebay.com": "ebaycom",
        "drugstore.com": "drugstore",
        "zappos.com": "zappos",
        "6pm.com": "sixpm",
        "wayfair.com": "wayfair",
        "bhphotovideo.com": "bhphotovideo",
        "forever21.com": "forever21",
        "toysrus.com": "toysrus",
        "gymboree.com": "gymboree",
        "childrensplace.com": "childrensplace",
        "perfume.com": "perfume",
        "fragrancenet.com": "fragrancenet",
        "victoriassecret.com": "victoriassecret",
    };

    var uri = extractDomain(tab.url);
    var js_include = null;
    var js_value = null;
    var domain = null;
    for (var _domain in domains) {
        var _val = domains[_domain];
        if (uri.indexOf(_domain) > 0) {
            domain = _domain;
            js_value = _val;
            js_include = "js/bin/" + _val + ".js";
            break;
        }
    }

    if (js_include == null) {
        console.log("Site not found");
        return false;
    }

    console.log("Use js file: " + js_include);

    pageMod.PageMod({
        include: "*",
        contentScriptFile: [
            data.url("js/plugin/jquery/jquery.min.js"),
            data.url("js/plugin/utils/textutils.js"),
            data.url("js/conf/config.js"),
            data.url("js/conf/action.js"),
            data.url(js_include)
        ],
        contentScript: ['action.init("' + js_value + '", "' + domain + '", "firefox");']
    });
});
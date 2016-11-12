var action = {};
/**
 *
 * @type type
 */
action.params = null;
action.translateElements = [];
action.translated = false;
/**
 *
 * @param {type} _objectId
 * @param {type} _domain
 * @returns {Boolean}
 */
action.init = function (_objectId, _domain, _browse) {
    //use browse
    config.browse = _browse;
    //Auto load init file js
    var e = window[_objectId];
    var data = e.init();
    data.id = e.getId();
    data.options = typeof data.options == 'undefined' ? {} : data.options;
    //Dừng thực hiện lệnh khi không tìm thấy id
    if (typeof data.id == 'undefined' || data.id == null) {
        console.log("Dừng thực hiện lệnh khi không tìm thấy id");
        return false;
    }
    if (typeof data.options.css != 'undefined') {
        action.addGlobalStyle(data.options.css);
    }
    data.options.domain = _domain;
    data.options.objectId = _objectId;
    data.options.currency = e.getCurrency();
    //Set vào biến global
    action.params = data;

    if(e.getTranslateElements){
        action.translateElements = e.getTranslateElements();
    }
    //get rate service
    action.getRate();

    //insert note DOM
    var div = document.createElement('div');
//    div.innerHTML = "";
    $(div).append("");
    if (typeof action.params.element.html_before != 'undefined') {
        $(div).append(action.params.element.html_before);
    }
    $(div).append(action.getHtml(typeof action.params.options.boxComment != 'undefined' ? action.params.options.boxComment : true));
    if (typeof action.params.element.html_after != 'undefined') {
        $(div).append(action.params.element.html_after);
    }
    switch (action.params.element.insert) {
        case "after":
            $(action.params.element.node).after($(div).html());
            break;
        case "before":
        default :
            $(action.params.element.node).before($(div).html());
    }

    //append params
    var price = e.getPrice();
    if (typeof price != 'undefined') {
        $("#addon-hangnhap-price").html('<span style="font-weight: initial;">Giá tạm tính:</span>' + Number(price * action.params.rate).toMoney() + " vnđ (" + Number(price).toMoney() + e.getCurrency() + ")");
    }

    //add event
    $("#addon_add_cart").click(function () {
        //check if website is translated by google translate
        if(e.useGoogleTranslate()){
          action.showError("Xin vui lòng tắt Google Translate hoặc chuyển đổi về ngôn ngữ mặc định trước khi nhấn 'Đặt hàng'.");
          return;
        }

        var item = e.getItem(function (_mess) {
            action.showError(_mess);
        });
        if (!item || item == null) {
            console.log("Sản phẩm trống");
            return false;
        }
        item.ct = action.getCookie("t");
        item.currency = e.getCurrency();
        item.is_addon = "1";
        item.version = action.getVersion();
        item.comment = action.getComment();

		item.note = action.getComment();

        // console.log(item);
        var url = config.service.http.addCart;
        if (window.location.protocol == 'https:') {
            url = config.service.https.addCart;
        }
        ajax.submit(url, item, function (xhr) {
            var stt = xhr.responseText;
            if (stt == 'success') {
                action.showSuccess("BẠN ĐÃ CHO SẢN PHẨM VÀO GIỎ HÀNG THÀNH CÔNG",
                        'SL:&nbsp;' + item.quantity + '&nbsp;&nbsp;Giá SP:&nbsp;' + item.item_price + '&nbsp;' + e.getCurrency());
            }else {
                if (stt == 'not_logged_in') {
                    action.showError("Bạn cần login trên trang Nhaphangsieutoc để sử dụng tính năng này.");
                }else if (stt == 'balance_not_enought') {
                    action.showError("Số dư tài khoản không đủ để đặt hàng!");
                }else if (stt == 'failured') {
                    action.showError("Có lỗi xảy ra trong quá trình thêm sản phẩm vào giỏ hàng. Vui lòng thử lại. Xin lỗi về sự gián đoạn này!");
                }
            }

        });
        return false;
    });

    // $("#addon_view_cart").click(function () {
    //     action.showCart();
    // });
    $("#addon-cal").click(function () {
        action.calPrice();
    });

    $("#addon_translate").click(function () {
        var elems = action.translateElements;

        if(elems.length <=0 ){
            return;
        }

        if(action.translated){
            for(var i = 0; i< elems.length; i++){
                elems[i].html(elems[i].origin);
            }
            action.translated = false;

            $("#addon_translate").val("Dịch: Tiếng Việt");
        }
        else{
            var firstElem = action.translateElements[0];

            //kiem tra xem da duoc dich lan nao chua
            if(firstElem.translated){
                for(var i=0;i < elems.length; i++){
                    elems[i].html(elems[i].translated);
                }
            }
            /*else{
                //goi gooogle translate lan dau tien
                //var query = 'source=en&target=vi'
                var query = 'source=zh&target=vi'

                for(var i=0;i < elems.length; i++){
                    query += "&q=" + escape(elems[i].origin);
                }

                ajax.translate(query, function(responseData){
                    console.log(responseData);
                    var translations = responseData.data.translations;

                    action.translated = true;

                    for(var i=0;i < translations.length; i++){
                        var translation = translations[i];
                        var elem = action.translateElements[i];
                        //luu ket qua dich vao dom element
                        elem.translated = translation.translatedText;
                        //hien thi ket qua dich
                        elem.html(translation.translatedText);
                    }
                });
            }*/
            else{
                for(var i=0;i < elems.length; i++){
                    var elemHtml = elems[i].html();
                    var translated = config.dictionary[elemHtml];
                    if(translated){
                        elems[i].html(translated);
                        elems[i].translated = translated;
                    }
                }
            }

            action.translated = true;

            $("#addon_translate").val("Dịch: Nguyên bản");
        }
        return false;
    });

    //action.createModal();

    e.setWarehouse();
};

/**
 * Comment
 * @returns {undefined}
 */
action.getComment = function () {
    var comment = document.getElementById("txtBz");
    if (comment != null) {
        comment = comment.value;
    } else {
        comment = "";
    }
    return comment;
};

/**
 * Phiên bản
 * @returns {String}
 */
action.getVersion = function () {
    return '20161102'; // nam-thang-ngay
};


/**
 * Get rate service
 * @returns {undefined}
 */
action.getRate = function () {
    var e = window[action.params.options.objectId];
    action.params.rate = config.rate[e.getCurrency()];
    //if (window.location.protocol == 'http:') {
        //Gọi service với giao thức http
        var rate = textutils.getCookie("addon_rate");
        if (typeof rate != 'undefined' && rate != null && rate != "") {
            action.params.rate = rate;
            return;
        }
        ajax.get(config.service.http.rate, function (data) {
            //rate = Number(data[e.getCurrency().toLowerCase()]);
            rate = Number(data.Rate);
            if (typeof rate != 'undefined' && rate != null && rate != "") {
                action.params.rate = rate;
                textutils.saveCookie(1, 'addon_rate', action.params.rate);

                $("#block_button_cnporder #rate_value").html(rate);
            }
        });
    //}
};

/**
 *
 * @param {type} boxComment
 * @returns {String}
 */
action.getHtml = function (boxComment) {
    var s = '<div id="addon_body" style="max-height: 318px;text-align: left;width:400px; padding:10px; background:#f7f7f7; border:3px solid #aaa;">';
    s += '      <div style="font-size:130%; font-weight:bold; margin-bottom:10px;" id="addon-hangnhap-price"></div>';
    if (boxComment) {
        s += '      <div> <label>Ghi chú</label>';
        s += '         <textarea style="width:380px; height:70px; border:1px solid #ccc;" id="txtBz" name="txtBz"></textarea>';
        s += '      </div>';
    }
    s += '      <div id="block_button_cnporder">';
    s += '          <div style="padding-top: 2px;font-size: 10px;float: right;"> ';       
    s += '              <div style="color: #999;">Tỉ giá ' + action.params.options.currency;
    s += '                  hiện tại: <span id="rate_value">' + Number(action.params.rate).toMoney();
    s += '                  </span>';
    s += '              </div>';
    s += '              <a href="' + config.service.website + '" data-spm-anchor-id="a312a.7728556.2015080704.1" style="color: #518cdc;text-decoration: initial;">';
    s += '                  Mua hàng tại Nhaphangsieutoc</a><br />';
    s += '              <input id="addon_translate"  type="button" value="Dịch: Tiếng Việt" style="cursor: pointer;background:#0275d8;border:none; padding:5px 10px; color:#fff; text-transform:uppercase; margin-top:5px;-moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px;" /></div>';
    s += '              <input id="addon_add_cart"  type="button" value="Đặt hàng" style="cursor: pointer;background:#278900;border:none; padding:5px 10px; color:#fff; text-transform:uppercase; margin-top:5px;-moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px;" />';
    s += '    <a href="' + config.service.cartLink + '" target="_blank" id="addon_view_cart" style="cursor: pointer;background: rgb(91, 192, 222);border: none;padding: 6px 10px;color: #fff;text-transform: uppercase;margin-top: 5px;-moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px;">Xem giỏ hàng</a>';
    s += '  </div>';
    s += '  <hr style="margin-top:10px;" /><div style="display:none" >\
            <div style="font-size:130%; font-weight:bold; margin-bottom:10px;">\
		<span style="font-weight: initial;">Phí vận chuyển </span><span id="addon-ship-price" >...</span> vnđ<span style="font-weight: initial;">, khoảng </span><span id="addon-day-price" >...</span></div>   \
            <div>\
            <div style="float:left" id="addon_block_weight" > \
                    <label style="display:block; margin-top:5px;" >Khối lượng dự tính (Kg)</label>\
                    <input style="width: 200px;height: 22px; text-align:right" id="addon-weight" placeholder="Nhập khối lượng dự tính" type="number" />\
            </div>\
            <div style="float:left; margin-left:10px;" > \
                    <label style="display:block; margin-top:5px;" >Khu vực nhận hàng</label>\
                    <select id="addon-area-group" style="width: 100px;height: 26px;" >\
                            <option value="HN" >Hà Nội</option>\
                            <option value="HCM" >Hồ Chí Minh</option>\
                    </select>\
            </div>\
            <p id="addon-clear-both" style="clear:both"></p>\
            <button id="addon-cal" type="button" style="cursor: pointer;background:#278900;border:none; padding:5px 10px; color:#fff; text-transform:uppercase; margin-top:5px;-moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px;" >Tạm tính phí vận chuyển</button></div>';
    s += '</div>';
    return s;
};


// action.showCart = function () {
//     //var url = config.service.http.viewCart;

//     if ($("#box_overlay").length > 0) {
//         return false;
//     }
//     var s = '<div id="box_overlay" style="background: none repeat scroll 0 0 #000000;height: 1000px;left: 0;opacity: 0.5;position: fixed;top: 0;width: 100%; z-index: 2147483646;"></div>\
//                 <div id="box-confirm-order" style="position:fixed; top:150px; left: 400px;z-index:2147483647;width:820px; border:1px solid #47b200; background:#fff; padding:15px;-moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px;">\
//                     <a style="float:right; width:15px; height: 15px; border:1px solid #DDD; margin-right:2px;background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAABkCAMAAAD+BCFrAAABgFBMVEXlXADw/+X/8PD/ehf/mDn/uV//okb/gyH/awb/jS3/w2z/cg7/rlOZmZn/QgH/WwH+TAH/cwD/YQCAgIBnwA9uwxD+VAGk4Rf+OwCq5Bh1yRFxxhGH0xR7zROf3xj84tJYrA2b3Rax6BTsYQL/bQDs/dqAzxPrNgJkuA7U77CW2xn2xaWJ1gOU2RWP1xf/eQD/6NP/MwDlLgHwPwHpaA/+6t3/rnXr+saP1C7+3Ml4zgGs5hP+5N3/aQB/0QCf3S3/4b/X83/3kWv/067/hxeZzmzy+9vL73Pc9Zjh9cdqxQLxhkf/yZr/xKST2wX/yIX/za3/6uXwcErU8KBpsipuyAH0SAH9vJP71r256yup4ynoSRtewADC7Uiq4jq25zf/lCr//PpjwwDk967tdBj3YwD/zaP7wq7/wVz+8+z6ZQuAyiT/fga65nj/bQP/0pyAvU+05VOo2nb6aR7/aw6j3FL3z7TpdSfv+OGp5Q33Xh7/pDCU0VH/////ZgD///+nXlx9AAAAgHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADgFS2cAAAWnSURBVHja7Nr5U9poGAdwqDctSYgSoyBEJRJoQA4BEVRAELxKve+7tfe93W13N/iv73sEiO7sD3Qms48z+eKQwE8fv/ME8r6DTdNSazM20zKzdqBpt53E3o4sLy8v25dlWTa8adMOJrt7HKalp/fF08tfEsuZ5eXMda1YrF3jM7kt/qO7x9T0zrz5FXFGzhRPDydIDk+L6GVTnJp5YnJe/N65WM5kijo3N5H7+TN3WM2s6GL/TK/JefG0Y7F8XTvFVpSRXG4EJTdyXruWdXG3yelcLNeKh6jaiZGJEfxHMjx8VNyWiXhywOTMdCxG4IkWFWNJfEfVGhX3mZyOxbXi+UjuLnb4GYrvrLpNxF0mp1OxXD29q/X5htWzle0IJstY/NjkTHYorp4etbBI6xv3jauLmqatqJHwlyoW95ucTsXn581qMReHgDXtWSS8eIbEtobJ6VAcOj/y0WYpNxzWwdsLkWh4MYQ6BiauHjWtCIuzQMGhBTXqjS5+gNfxFzwKYVVVn4UjOG2wF4m93+F1vBgeD4+rZ9sfVDUSiUYXwhQ8t+AlmYXXMW5WjRAkGoO5O+Ap79Q7eB1Ho5Go+oUy1blZCt6dQ1ycsXfwOp6NRr2ql0KvWuAp6h0bA9jxdy+6vhYodfsHAa/OYSuJ5294HX8YwxO7S8k6WOeOjo66v8LrOOSZwuTV2RZ4l1hJPErIljK/4w7XIO4xMrM6OXS12/R6PB63gtd5L80Fv+x0nVdxk0ts7ASTQye7OpZEqeC1tM1U8svJ/Q5X/7IySmcWkVdOVnWtG0eR0N2mpvmh7Vd8VfQpOJn1XOlWkiFUsd12Cy1oYbQz5KHNXq22tSjKjh2oWJYUt9tjtJJIkgxVbF+RlKG7WlSwJJEdC5hiu7yDzEauokg7dCMLqNhur0iSQtEK8kqSVGnuYkEV2+XPEolCnisrdvBilFDl844k7XyuhH4YdmNvH1os8f8idrafnQ+kY2fbig5OEkDiwUFy1A//FVjiQQJuiZ3NGEcDkphgB+9V7DQewYkx9/5MtMV63bDEdxt2Og1j8RA7xv/CA5hjp/HDDVzH//qsMI6B89Z5C1B8//P43ncevKm4/13hNJw4W1ejdSdkiS2xJbbEltgSW2JLbIktsSW2xJbYEuviR+2k/LFYKhWL+VOGN+GKN7OxWOFT3VGvfyrEYtlN8OJsoeDoLr+fdrlc78vdjoL/ALZ4c6nQU8baaRd+DrjKPYWlTcDi1Kf6xTTCTk9TMTZf1NdTYMWbdQcqOKBjqTgQKDvqm1DFjtdlV2De1Qg0vfM8SqDrdRqoeP11H+p0PXUT4Gm7PO94dPORn+/q2Qcpzj+5cLn4tKZpsQYfwGB2Cb1YEhrzA70piOL0X9Ouj2xMI2Q2EGAJWLtEg/Fbdxqg+M1F30fUa5r8HC7Gs7RhTVsXeL7R1QdQ/Lz8GM1ug72hZJajYD/L4pK7XsETp9+75lF4YZ1Il+ihwHK4bv5tGp54oL9/Hv/2jxVuWr9G1QoCApOswRN3IS+P/niWW2+CswJHvazwDZ74Ld/gaQRmn4KfMwgs4IcgsADF+ArDI9sWHzAMxtLAE3/DWjwAHPe8ORV+jtG93J/wxGv6xBrAiMwwAidwKFvwxCWBgBkdvLGvtyxiL7dXAvgNsoevr2bDWSa+QU7yDIPFSYDfII/2OEQW05cUzDAiJW/EEZgJQrwTWkMlc3E/BaNZ0Fu+FJE+uQXybjO5J3BiugnmOJGQN+IIHMyDvKMvJXGxaX+aQYPAoEdcLOX3GdRxsAR01XSc3ENkURQ5dLkxOHExHmfE4DHUdV4+mNSlzSA9AifyYFf/2UQyaeDih4jAWcA7LPnjYNKAJd7jPOxdrFIimEyKujcYDCZK4HcK81uJRCJIgk62/PD3NlFelbaOg8HjrdIryLux/wgwACdpOfG0o37PAAAAAElFTkSuQmCC\') no-repeat 3px -34px transparent;" id="box-nh-box-close" href="javascript:void(0);" onclick="document.getElementById(\'box-confirm-order\').parentNode.removeChild(document.getElementById(\'box-confirm-order\'));var boxOverlay = document.getElementById(\'box_overlay\');if(boxOverlay != null) {boxOverlay.parentNode.removeChild(boxOverlay);}" data-spm-anchor-id="a220o.1000855.0.0"></a>\
//                     <div style="background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTQtMDMtMjhUMTU6MzI6MTQrMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE0LTAzLTI4VDE1OjM3OjM2KzA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE0LTAzLTI4VDE1OjM3OjM2KzA3OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNkRCQjUwQUI2NTQxMUUzQkM3OEZFRTYzREM3MzFCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNkRCQjUwQkI2NTQxMUUzQkM3OEZFRTYzREM3MzFCRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM2REJCNTA4QjY1NDExRTNCQzc4RkVFNjNEQzczMUJFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM2REJCNTA5QjY1NDExRTNCQzc4RkVFNjNEQzczMUJFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+8PDIQAAAA1dJREFUeNq0V19IU2EUP7vbBP+lRDoRSlRGUkMLZkIyFMRARj4MpKdKSXrLkqCoCIJegrKoqB6y0v7oUxITX6zJCEzMQTW1NHMiPbjhTC1t4ubW+dx3r3fz3u3u7nbGD+69++79ne/3nXO+86lO9teCRNMjKhFGhAFRiNDR/zyIGcQYwoEYRExJ+ahGwphqhAVRjygQGbOHoorezyKsiB6EXa4DRYhmRBMiDxIz4ugZRAPiGaId4UrEgRpEK8IMyRlx/BKiFHEHYYsewAi8RKS+oQA538z0m/XxHCAzv0oDTWkz0m/XiDlQRGVXhDxdmwG5qflCTrRSrm0x0Kyk7CdKWsCYYwK1Wr153/j2CH85nIjLfAWqabQrYmW7KuDgzsOgUokOaaKcnAMWGakmaGmaDDi1/zxotRpgmPDsh912oeywsA7ohaJTrjXtOweZ2iycfXhuv9eX4PnEPRDJNj1Dy2uBUtIbc01IHtY+hL+nX9tg1b8iVqwqGaWinpVexVv4obkB+Dw/HDM1GbqxKCB9K+xIyebuifSvJh/Ee83A0F0taenLdaaIZ+3jN8Wk51shw9tSZRccIj3fPsy9A6d3RMrrOtHdsKO2n7u2/eyF7u+PIBAMCBScs1HSL8LLiYeSJ8DQZiKm1ew+Ci1l1yKIWOkr8qoinj0euwV/AytS+T0M7WS2Wc90J3cdDG6APt0Apw0XoTirRFR6EvWjCyOJrOCM+sDxYpKGh6L/mVwcBcCM2ptdCsvLS+Dz+SAnNQ/K802wsDYPdQUNnDNs1N/+dAX8wfVEHOjT0B5O0N5Mv4BgaAPq8o+Fcz0tDctrJipxAX3b2khDoRA8GW9LRHrWHBraQM6KVUOrq2uTwFLcyBUZLZMSQf7R8x6+eIcTJSecgwztXq2xRvbOdEfExBZ5EP74l6Hz2105GUw4p1gdSffqju1EF7z+0RERmH5/QK70bsrJLaSddq8Q3wl2mArs7j450gPlskd3RO20ezXHW44h98BmcP5a88oh76Nc21oyF22ddfF2SK/PI7dyOyiHS6wrJn379VipmYQ56Ldt8Q4mJDpXFTqY8GUXPJiIbUY2WqKdMo9m/GiXdTRjY4K0zv0SDqdCRSbpwynwUpTg/v84nv8TYAAfigu/FNklSwAAAABJRU5ErkJggg==\') no-repeat 0 0; padding-left:45px;">\
//                         <h4 style="font-size: 12px;margin:0 0 10px 0;text-transform:uppercase; color:#47b200">' + "Giỏ hàng" + '</h4>\
//                         <div>'
//                         +  '<iframe src="' + config.service.https.viewCart + '" width="100%" height="400px" frameborder="0"></iframe>'
//                         + '</div>';

//     action.updatepage(s);
// };

action.calPrice = function () {
    var areaGroup = $("#addon-area-group").val();
    var weight = $("#addon-weight").val();
    if (typeof weight == 'undefined' || weight == null || weight == '' || Number(weight) <= 0) {
        return false;
    }

    var url = config.service.http.calPrice;
    if (window.location.protocol == 'https:') {
        url = config.service.https.calPrice;
    }
    $.get(url + '&weight=' + weight, function (data) {
//        console.log(data);
        try {
            data = JSON.parse(data);
            $("#addon-ship-price").html(Number(data[areaGroup].price).toMoney());
            $("#addon-day-price").html(data[areaGroup].Day);
        }
        catch (err) {

        }
    });
};

/**
 *
 * @param {type} s
 * @returns {undefined}
 */
action.updatepage = function (s) {
    var htmlObject = document.createElement('div');
    $(htmlObject).html(s);
    document.body.appendChild(htmlObject);
};

action.createModal = function(){
    

var cartModal = '<div id="animatedModal">'
            +'<div class="close-animatedModal"> '
            +'CLOSE MODAL'
            +'</div>'

            +'<div class="modal-content">Your modal content goes here</div>'
            +'</div>';

    $(cartModal).appendTo('body');
}
/**
 *
 * @param {type} mess
 * @returns {undefined}
 */
action.showError = function (mess) {
    var s = '<div id="box_overlay" style="background: none repeat scroll 0 0 #000000;height: 1000px;left: 0;opacity: 0.5;position: fixed;top: 0;width: 100%; z-index: 2147483646;"></div>';
    s += '   <div id="box-confirm-order" style="position:fixed; top:150px; left: 400px;z-index:2147483647;width:400px; border:1px solid #eb0000; background:#fff; padding:15px;">';
    s += '   <a style="float:right; width:15px; height: 15px; border:1px solid #DDD; margin-right:2px;background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAABkCAMAAAD+BCFrAAABgFBMVEXlXADw/+X/8PD/ehf/mDn/uV//okb/gyH/awb/jS3/w2z/cg7/rlOZmZn/QgH/WwH+TAH/cwD/YQCAgIBnwA9uwxD+VAGk4Rf+OwCq5Bh1yRFxxhGH0xR7zROf3xj84tJYrA2b3Rax6BTsYQL/bQDs/dqAzxPrNgJkuA7U77CW2xn2xaWJ1gOU2RWP1xf/eQD/6NP/MwDlLgHwPwHpaA/+6t3/rnXr+saP1C7+3Ml4zgGs5hP+5N3/aQB/0QCf3S3/4b/X83/3kWv/067/hxeZzmzy+9vL73Pc9Zjh9cdqxQLxhkf/yZr/xKST2wX/yIX/za3/6uXwcErU8KBpsipuyAH0SAH9vJP71r256yup4ynoSRtewADC7Uiq4jq25zf/lCr//PpjwwDk967tdBj3YwD/zaP7wq7/wVz+8+z6ZQuAyiT/fga65nj/bQP/0pyAvU+05VOo2nb6aR7/aw6j3FL3z7TpdSfv+OGp5Q33Xh7/pDCU0VH/////ZgD///+nXlx9AAAAgHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADgFS2cAAAWnSURBVHja7Nr5U9poGAdwqDctSYgSoyBEJRJoQA4BEVRAELxKve+7tfe93W13N/iv73sEiO7sD3Qms48z+eKQwE8fv/ME8r6DTdNSazM20zKzdqBpt53E3o4sLy8v25dlWTa8adMOJrt7HKalp/fF08tfEsuZ5eXMda1YrF3jM7kt/qO7x9T0zrz5FXFGzhRPDydIDk+L6GVTnJp5YnJe/N65WM5kijo3N5H7+TN3WM2s6GL/TK/JefG0Y7F8XTvFVpSRXG4EJTdyXruWdXG3yelcLNeKh6jaiZGJEfxHMjx8VNyWiXhywOTMdCxG4IkWFWNJfEfVGhX3mZyOxbXi+UjuLnb4GYrvrLpNxF0mp1OxXD29q/X5htWzle0IJstY/NjkTHYorp4etbBI6xv3jauLmqatqJHwlyoW95ucTsXn581qMReHgDXtWSS8eIbEtobJ6VAcOj/y0WYpNxzWwdsLkWh4MYQ6BiauHjWtCIuzQMGhBTXqjS5+gNfxFzwKYVVVn4UjOG2wF4m93+F1vBgeD4+rZ9sfVDUSiUYXwhQ8t+AlmYXXMW5WjRAkGoO5O+Ap79Q7eB1Ho5Go+oUy1blZCt6dQ1ycsXfwOp6NRr2ql0KvWuAp6h0bA9jxdy+6vhYodfsHAa/OYSuJ5294HX8YwxO7S8k6WOeOjo66v8LrOOSZwuTV2RZ4l1hJPErIljK/4w7XIO4xMrM6OXS12/R6PB63gtd5L80Fv+x0nVdxk0ts7ASTQye7OpZEqeC1tM1U8svJ/Q5X/7IySmcWkVdOVnWtG0eR0N2mpvmh7Vd8VfQpOJn1XOlWkiFUsd12Cy1oYbQz5KHNXq22tSjKjh2oWJYUt9tjtJJIkgxVbF+RlKG7WlSwJJEdC5hiu7yDzEauokg7dCMLqNhur0iSQtEK8kqSVGnuYkEV2+XPEolCnisrdvBilFDl844k7XyuhH4YdmNvH1os8f8idrafnQ+kY2fbig5OEkDiwUFy1A//FVjiQQJuiZ3NGEcDkphgB+9V7DQewYkx9/5MtMV63bDEdxt2Og1j8RA7xv/CA5hjp/HDDVzH//qsMI6B89Z5C1B8//P43ncevKm4/13hNJw4W1ejdSdkiS2xJbbEltgSW2JLbIktsSW2xJbYEuviR+2k/LFYKhWL+VOGN+GKN7OxWOFT3VGvfyrEYtlN8OJsoeDoLr+fdrlc78vdjoL/ALZ4c6nQU8baaRd+DrjKPYWlTcDi1Kf6xTTCTk9TMTZf1NdTYMWbdQcqOKBjqTgQKDvqm1DFjtdlV2De1Qg0vfM8SqDrdRqoeP11H+p0PXUT4Gm7PO94dPORn+/q2Qcpzj+5cLn4tKZpsQYfwGB2Cb1YEhrzA70piOL0X9Ouj2xMI2Q2EGAJWLtEg/Fbdxqg+M1F30fUa5r8HC7Gs7RhTVsXeL7R1QdQ/Lz8GM1ug72hZJajYD/L4pK7XsETp9+75lF4YZ1Il+ihwHK4bv5tGp54oL9/Hv/2jxVuWr9G1QoCApOswRN3IS+P/niWW2+CswJHvazwDZ74Ld/gaQRmn4KfMwgs4IcgsADF+ArDI9sWHzAMxtLAE3/DWjwAHPe8ORV+jtG93J/wxGv6xBrAiMwwAidwKFvwxCWBgBkdvLGvtyxiL7dXAvgNsoevr2bDWSa+QU7yDIPFSYDfII/2OEQW05cUzDAiJW/EEZgJQrwTWkMlc3E/BaNZ0Fu+FJE+uQXybjO5J3BiugnmOJGQN+IIHMyDvKMvJXGxaX+aQYPAoEdcLOX3GdRxsAR01XSc3ENkURQ5dLkxOHExHmfE4DHUdV4+mNSlzSA9AifyYFf/2UQyaeDih4jAWcA7LPnjYNKAJd7jPOxdrFIimEyKujcYDCZK4HcK81uJRCJIgk62/PD3NlFelbaOg8HjrdIryLux/wgwACdpOfG0o37PAAAAAElFTkSuQmCC\') no-repeat 3px -34px transparent;" id="box-nh-box-close" href="javascript:void(0);" onclick="document.getElementById(\'box-confirm-order\').parentNode.removeChild(document.getElementById(\'box-confirm-order\'));var boxOverlay = document.getElementById(\'box_overlay\');if(boxOverlay != null) {boxOverlay.parentNode.removeChild(boxOverlay);}" data-spm-anchor-id="a220o.1000855.0.0"></a>';
    s += '    <div style="background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTQtMDMtMjhUMTU6MzI6MTQrMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE0LTAzLTI4VDE1OjM4OjI2KzA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE0LTAzLTI4VDE1OjM4OjI2KzA3OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NEJDNzVDOEI2NTQxMUUzQTExMkU1NkU4MjAxRkZCOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NEJDNzVDOUI2NTQxMUUzQTExMkU1NkU4MjAxRkZCOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU0QkM3NUM2QjY1NDExRTNBMTEyRTU2RTgyMDFGRkI5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU0QkM3NUM3QjY1NDExRTNBMTEyRTU2RTgyMDFGRkI5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+IaVNQwAAAkhJREFUeNrElztIXFEQhu9uNkTXxzbxsUbQwiaiUZCopAisQQNpTCOonUQDWtiLWMa0PlIm1oKVqQxEG0HjtVOxi5hidX10oojBmH/kv3C5rNlzZnfNwLdc3J2Z33PPmZkT2neMrRS8Bc9BI3gMyvndMTgF2+AH+ArOTIKGDAQ8Be+ZvNZQrIRdBFN8VgkoA6NgEFQ6OkuBOfABXNgIkGUeB91ObkxW4yPYCH4RTvPjV+BTDpM7jDXDvfNPAS1gErQ6uTeJ+RnU3CUgDibylNwvYhoUpxMwYrnsS2CYLFm+jrHgJqwHy5a7vQ24fG4H65anoxPseCswpDhqhb7nAktfyfXOewUxFhlbK/E9xxT+kjMmAt5YVLh0Ah6AJwp/ydklAl4od3QJk1cEVsPGXoqABqVzjMkfgqgyRqMIqFY6VzL5b3CjjBEPswBprJTJj7JYgVsBIaVzIZNf+yubpYVEwIHSWfbOIwppU8Y4jOAjCeoUzk3gPMvekAxzjPpfdluK15TO4tcBEpZ9wG+r0oykiGxZVkM5dlVsKlKMmsGm5YaWPtgQ5vS6aKn8gifAq4QyEV8qxrRzrxvO8r8xtSL2da8SJgLd0aQdy8TsRPiHn+ALB1FTWwAr4A/nSBub88Z1/1QsPX0+x8NoOpNLSw+4Co5klxxI3Twmd3nXuLprKnY5Hbl5Sj4AfmW6F8iR7FecjEw7vg/smlxMvE3Zy1eSyiJxijEk1p72cvqMS3fvl9OgRXncXrMT+q/nJ0T6yjfw3bQw/RVgANvHcTg/x5orAAAAAElFTkSuQmCC\') no-repeat 0 0; padding-left:45px;">';
    s += '       <h4 style="font-size: 12px;margin:0 0 10px 0; text-transform:uppercase; color:#eb0000">' + mess + '</h4>';
    s += '       <div><a onclick="document.getElementById(\'box-confirm-order\').parentNode.removeChild(document.getElementById(\'box-confirm-order\'));var boxOverlay = document.getElementById(\'box_overlay\');if(boxOverlay != null) {boxOverlay.parentNode.removeChild(boxOverlay);}" data-spm-anchor-id="a220o.1000855.0.0" href="javascript:void(0);" style="color:#007cbc; text-decoration:none;">&laquo; Quay lại</a></div>';
    s += '     </div>';
    s += '</div>';
    action.updatepage(s);
};

/**
 *
 * @param {type} mess
 * @returns {undefined}
 */
action.showSuccess = function (mess, _data) {
    if ($("#box_overlay").length > 0) {
        return false;
    }
    var s = '<div id="box_overlay" style="background: none repeat scroll 0 0 #000000;height: 1000px;left: 0;opacity: 0.5;position: fixed;top: 0;width: 100%; z-index: 2147483646;"></div>\
                <div id="box-confirm-order" style="position:fixed; top:150px; left: 400px;z-index:2147483647;width:400px; border:1px solid #47b200; background:#fff; padding:15px;-moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px;">\
                    <a style="float:right; width:15px; height: 15px; border:1px solid #DDD; margin-right:2px;background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAABkCAMAAAD+BCFrAAABgFBMVEXlXADw/+X/8PD/ehf/mDn/uV//okb/gyH/awb/jS3/w2z/cg7/rlOZmZn/QgH/WwH+TAH/cwD/YQCAgIBnwA9uwxD+VAGk4Rf+OwCq5Bh1yRFxxhGH0xR7zROf3xj84tJYrA2b3Rax6BTsYQL/bQDs/dqAzxPrNgJkuA7U77CW2xn2xaWJ1gOU2RWP1xf/eQD/6NP/MwDlLgHwPwHpaA/+6t3/rnXr+saP1C7+3Ml4zgGs5hP+5N3/aQB/0QCf3S3/4b/X83/3kWv/067/hxeZzmzy+9vL73Pc9Zjh9cdqxQLxhkf/yZr/xKST2wX/yIX/za3/6uXwcErU8KBpsipuyAH0SAH9vJP71r256yup4ynoSRtewADC7Uiq4jq25zf/lCr//PpjwwDk967tdBj3YwD/zaP7wq7/wVz+8+z6ZQuAyiT/fga65nj/bQP/0pyAvU+05VOo2nb6aR7/aw6j3FL3z7TpdSfv+OGp5Q33Xh7/pDCU0VH/////ZgD///+nXlx9AAAAgHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADgFS2cAAAWnSURBVHja7Nr5U9poGAdwqDctSYgSoyBEJRJoQA4BEVRAELxKve+7tfe93W13N/iv73sEiO7sD3Qms48z+eKQwE8fv/ME8r6DTdNSazM20zKzdqBpt53E3o4sLy8v25dlWTa8adMOJrt7HKalp/fF08tfEsuZ5eXMda1YrF3jM7kt/qO7x9T0zrz5FXFGzhRPDydIDk+L6GVTnJp5YnJe/N65WM5kijo3N5H7+TN3WM2s6GL/TK/JefG0Y7F8XTvFVpSRXG4EJTdyXruWdXG3yelcLNeKh6jaiZGJEfxHMjx8VNyWiXhywOTMdCxG4IkWFWNJfEfVGhX3mZyOxbXi+UjuLnb4GYrvrLpNxF0mp1OxXD29q/X5htWzle0IJstY/NjkTHYorp4etbBI6xv3jauLmqatqJHwlyoW95ucTsXn581qMReHgDXtWSS8eIbEtobJ6VAcOj/y0WYpNxzWwdsLkWh4MYQ6BiauHjWtCIuzQMGhBTXqjS5+gNfxFzwKYVVVn4UjOG2wF4m93+F1vBgeD4+rZ9sfVDUSiUYXwhQ8t+AlmYXXMW5WjRAkGoO5O+Ap79Q7eB1Ho5Go+oUy1blZCt6dQ1ycsXfwOp6NRr2ql0KvWuAp6h0bA9jxdy+6vhYodfsHAa/OYSuJ5294HX8YwxO7S8k6WOeOjo66v8LrOOSZwuTV2RZ4l1hJPErIljK/4w7XIO4xMrM6OXS12/R6PB63gtd5L80Fv+x0nVdxk0ts7ASTQye7OpZEqeC1tM1U8svJ/Q5X/7IySmcWkVdOVnWtG0eR0N2mpvmh7Vd8VfQpOJn1XOlWkiFUsd12Cy1oYbQz5KHNXq22tSjKjh2oWJYUt9tjtJJIkgxVbF+RlKG7WlSwJJEdC5hiu7yDzEauokg7dCMLqNhur0iSQtEK8kqSVGnuYkEV2+XPEolCnisrdvBilFDl844k7XyuhH4YdmNvH1os8f8idrafnQ+kY2fbig5OEkDiwUFy1A//FVjiQQJuiZ3NGEcDkphgB+9V7DQewYkx9/5MtMV63bDEdxt2Og1j8RA7xv/CA5hjp/HDDVzH//qsMI6B89Z5C1B8//P43ncevKm4/13hNJw4W1ejdSdkiS2xJbbEltgSW2JLbIktsSW2xJbYEuviR+2k/LFYKhWL+VOGN+GKN7OxWOFT3VGvfyrEYtlN8OJsoeDoLr+fdrlc78vdjoL/ALZ4c6nQU8baaRd+DrjKPYWlTcDi1Kf6xTTCTk9TMTZf1NdTYMWbdQcqOKBjqTgQKDvqm1DFjtdlV2De1Qg0vfM8SqDrdRqoeP11H+p0PXUT4Gm7PO94dPORn+/q2Qcpzj+5cLn4tKZpsQYfwGB2Cb1YEhrzA70piOL0X9Ouj2xMI2Q2EGAJWLtEg/Fbdxqg+M1F30fUa5r8HC7Gs7RhTVsXeL7R1QdQ/Lz8GM1ug72hZJajYD/L4pK7XsETp9+75lF4YZ1Il+ihwHK4bv5tGp54oL9/Hv/2jxVuWr9G1QoCApOswRN3IS+P/niWW2+CswJHvazwDZ74Ld/gaQRmn4KfMwgs4IcgsADF+ArDI9sWHzAMxtLAE3/DWjwAHPe8ORV+jtG93J/wxGv6xBrAiMwwAidwKFvwxCWBgBkdvLGvtyxiL7dXAvgNsoevr2bDWSa+QU7yDIPFSYDfII/2OEQW05cUzDAiJW/EEZgJQrwTWkMlc3E/BaNZ0Fu+FJE+uQXybjO5J3BiugnmOJGQN+IIHMyDvKMvJXGxaX+aQYPAoEdcLOX3GdRxsAR01XSc3ENkURQ5dLkxOHExHmfE4DHUdV4+mNSlzSA9AifyYFf/2UQyaeDih4jAWcA7LPnjYNKAJd7jPOxdrFIimEyKujcYDCZK4HcK81uJRCJIgk62/PD3NlFelbaOg8HjrdIryLux/wgwACdpOfG0o37PAAAAAElFTkSuQmCC\') no-repeat 3px -34px transparent;" id="box-nh-box-close" href="javascript:void(0);" onclick="document.getElementById(\'box-confirm-order\').parentNode.removeChild(document.getElementById(\'box-confirm-order\'));var boxOverlay = document.getElementById(\'box_overlay\');if(boxOverlay != null) {boxOverlay.parentNode.removeChild(boxOverlay);}" data-spm-anchor-id="a220o.1000855.0.0"></a>\
                    <div style="background:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTQtMDMtMjhUMTU6MzI6MTQrMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE0LTAzLTI4VDE1OjM3OjM2KzA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE0LTAzLTI4VDE1OjM3OjM2KzA3OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNkRCQjUwQUI2NTQxMUUzQkM3OEZFRTYzREM3MzFCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNkRCQjUwQkI2NTQxMUUzQkM3OEZFRTYzREM3MzFCRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM2REJCNTA4QjY1NDExRTNCQzc4RkVFNjNEQzczMUJFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM2REJCNTA5QjY1NDExRTNCQzc4RkVFNjNEQzczMUJFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+8PDIQAAAA1dJREFUeNq0V19IU2EUP7vbBP+lRDoRSlRGUkMLZkIyFMRARj4MpKdKSXrLkqCoCIJegrKoqB6y0v7oUxITX6zJCEzMQTW1NHMiPbjhTC1t4ubW+dx3r3fz3u3u7nbGD+69++79ne/3nXO+86lO9teCRNMjKhFGhAFRiNDR/zyIGcQYwoEYRExJ+ahGwphqhAVRjygQGbOHoorezyKsiB6EXa4DRYhmRBMiDxIz4ugZRAPiGaId4UrEgRpEK8IMyRlx/BKiFHEHYYsewAi8RKS+oQA538z0m/XxHCAzv0oDTWkz0m/XiDlQRGVXhDxdmwG5qflCTrRSrm0x0Kyk7CdKWsCYYwK1Wr153/j2CH85nIjLfAWqabQrYmW7KuDgzsOgUokOaaKcnAMWGakmaGmaDDi1/zxotRpgmPDsh912oeywsA7ohaJTrjXtOweZ2iycfXhuv9eX4PnEPRDJNj1Dy2uBUtIbc01IHtY+hL+nX9tg1b8iVqwqGaWinpVexVv4obkB+Dw/HDM1GbqxKCB9K+xIyebuifSvJh/Ee83A0F0taenLdaaIZ+3jN8Wk51shw9tSZRccIj3fPsy9A6d3RMrrOtHdsKO2n7u2/eyF7u+PIBAMCBScs1HSL8LLiYeSJ8DQZiKm1ew+Ci1l1yKIWOkr8qoinj0euwV/AytS+T0M7WS2Wc90J3cdDG6APt0Apw0XoTirRFR6EvWjCyOJrOCM+sDxYpKGh6L/mVwcBcCM2ptdCsvLS+Dz+SAnNQ/K802wsDYPdQUNnDNs1N/+dAX8wfVEHOjT0B5O0N5Mv4BgaAPq8o+Fcz0tDctrJipxAX3b2khDoRA8GW9LRHrWHBraQM6KVUOrq2uTwFLcyBUZLZMSQf7R8x6+eIcTJSecgwztXq2xRvbOdEfExBZ5EP74l6Hz2105GUw4p1gdSffqju1EF7z+0RERmH5/QK70bsrJLaSddq8Q3wl2mArs7j450gPlskd3RO20ezXHW44h98BmcP5a88oh76Nc21oyF22ddfF2SK/PI7dyOyiHS6wrJn379VipmYQ56Ldt8Q4mJDpXFTqY8GUXPJiIbUY2WqKdMo9m/GiXdTRjY4K0zv0SDqdCRSbpwynwUpTg/v84nv8TYAAfigu/FNklSwAAAABJRU5ErkJggg==\') no-repeat 0 0; padding-left:45px;">\
                        <h4 style="font-size: 12px;margin:0 0 10px 0;text-transform:uppercase; color:#47b200">' + mess + '</h4>\
                        <div>' + (typeof _data != 'undefined' ? _data : "") + '\
                    </div>\
                </div>';
    action.updatepage(s);
};

/**
 *
 * @param {type} css
 * @returns {undefined}
 */
action.addGlobalStyle = function (css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    $(style).html(css)
//    style.innerHTML = css;
    head.appendChild(style);
};

action.getCookie = function (c_name)
{
    var i, x, y, ARRcookies = document.cookie.split(";");

    for (i = 0; i < ARRcookies.length; i++)
    {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return unescape(y);
};

var ajax = {};

/**
 *
 * @param {type} _item
 * @returns {String}
 */
ajax.endcode = function (_item) {
    var params = "";
    $.each(_item, function (_key, _val) {
        if (params == "") {
            params += "";
        } else {
            params += "&";
        }
        params += _key + "=" + encodeURIComponent(_val);
    });
    return params;
};

/**
 * Post request
 * @param {type} _url
 * @param {type} _params
 * @param {type} fn
 * @returns {undefined}
 */
ajax.submit = function (_url, _params, fn) {
    // alert( $("#first_iframe").contents().find("body").html() );
    // chrome.runtime.sendMessage({
    //     method: 'POST',
    //     action: 'xhttp',
    //     url: _url,
    //     data: ajax.endcode(_params)
    // }, function(responseText) {
    //     fn(responseText);
    // });
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', _url, true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.withCredentials = "true";
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            fn(xhttp);
        } else {
           console.log("Submit error", xhttp);
        }
    };
    xhttp.send(ajax.endcode(_params));
    // 
};

/**
 *
 * @param {type} _url
 * @param {type} _params
 * @param {type} fn
 * @returns {undefined}
 */
ajax.post = function (_url, _params, fn) {
    $.ajax({
        type: 'POST',
        url: _url,
        crossDomain: true,
        data: _params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            fn(responseData, textStatus, jqXHR);
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log(responseData, textStatus, errorThrown);
        }
    });
};

/**
 * Get
 * @param {type} _url
 * @param {type} _params
 * @param {type} fn
 * @returns {undefined}
 */
ajax.get = function (_url, fn) {
    $.ajax({
        type: 'GET',
        url: _url,
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            fn(data);
        }
    });
};

/*ajax.translate = function (params, fn) {
    $.ajax({
        type: 'GET',
        url: config.service.translate,
        data: params,
        crossDomain: true,
        //dataType: 'json',
        success: function (data) {
            fn(data);
        }
    });
};*/
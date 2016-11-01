var jd = {};

/**
 * Init load
 * @returns {undefined}
 */
jd.init = function () {
    return {
        element: {
            node: 'div#name > h1',
            insert: "after",
//            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana ! important; }"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {jd.getId.jdAnonym$1}
 */
jd.getId = function () {
    var pathname = window.location.pathname;
    var re = /\/(.+)\.html/i;
    var id = re.exec(pathname);
    return (id == null || id.length == 0) ? null : id[1];
};

jd.getCurrency = function () {
    return "CNY";
};

jd.getQuantity = function () {
    var quantity = '';
    var qElement = $("input#buy-num");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity == '' || quantity <= 0 ? 1 : quantity;
};

jd.getImage = function () {
    var img_src = $('#spec-n1 img').attr("jqimg");
    return img_src;
};

jd.getTitle = function () {
    var tb = $('div#name > h1').text().trim();
    return tb;
};

jd.getPrice = function () {
    var price = "";
    price = $('#summary-price strong#jd-price').text().trim().replace(/[^0-9\.\,]/g, '');
    return price == '' ? 0 : price;
};

jd.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
jd.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
jd.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "jd";
    item.item_id = jd.getId();
    item.item_price = jd.getPrice();
    item.item_image = jd.getImage();
    item.seller_name = jd.getSellerName();
    item.seller_id = jd.getSellerId();
    item.quantity = jd.getQuantity();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var __subs = $("div#choose div.p-choose");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            var keyword = $(_element).children("div.dt").text().trim().replace(":", "");
            var value;
            $(_element).find("div.dd > div.item").each(function () {
                var _c = $(this).attr("class");
                if (typeof _c != 'undefined' && _c.indexOf("selected") >= 0) {
                    value = $(this).find("a").attr("title");
                }
            });
            if (typeof keyword != 'undefined' && typeof value != 'undefined' && value != null && value != "") {
                color_size += ';' + value;
            }
        });
        if (color_size == '') {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
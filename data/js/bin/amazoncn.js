var amazoncn = {};

/**
 * Init load
 * @returns {undefined}
 */
amazoncn.init = function () {
    return {
        element: {
            node: '#canvasCaption',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana ! important; }\
                  #addon_view_cart {display: block;width: 119px;float: left;margin-right: 5px;padding: 5px 10px!important;} \
                  #box-confirm-order h4 {font-size: 13px;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {amazoncn.getId.amazoncnAnonym$1}
 */
amazoncn.getId = function () {
    var id = $("input#ASIN").val();
    if (typeof id == 'undefined' || id == null || id == '') {
        var pathname = window.location.pathname;
        var re = /dp\/(.+)/i;
        var id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return id;
};

amazoncn.getCurrency = function () {
    return "CNY";
};

amazoncn.getQuantity = function () {
    var quantity = '';
    var qElement = $("div#selectQuantity select#quantity");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity;
};

amazoncn.getImage = function () {
    var img_src = $("[data-old-hires]").attr("data-old-hires");
    if (typeof img_src == 'undefined' || img_src == null || img_src == "") {
        $("div.imgTagWrapper img").each(function () {
            img_src = $(this).attr("src");
            if (typeof img_src != 'undefined' && img_src != "") {
                return false;
            }
        });
    }
    return img_src;
};

amazoncn.getTitle = function () {
    var tb = $('h1#title').text().trim();
    return tb;
};

amazoncn.getPrice = function () {
    var price = "";
    price = $('span#priceblock_saleprice').text().trim();
    if (typeof price == 'undefined' || price == null || price == '') {
        price = $('span#priceblock_ourprice').text().trim();
        if (typeof price == 'undefined' || price == null || price == '') {
            price = $("span#priceblock_dealprice").text().trim();
        }
    }
    if (typeof price != 'undefined' && price.indexOf("-") > -1) {
        price = price.split("-");
        if (price.length > 0) {
            price = String(price[0]).trim();
        }
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

amazoncn.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
amazoncn.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
amazoncn.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "amazoncn";
    item.item_id = amazoncn.getId();
    item.item_price = amazoncn.getPrice();
    item.item_image = amazoncn.getImage();
    item.seller_name = amazoncn.getSellerName();
    item.seller_id = amazoncn.getSellerId();
    item.quantity = amazoncn.getQuantity();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    //Danh sách thuộc tính
    var __subs = $("form#twister > div.a-section");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            var keyword, value;

            //TRường hợp là thẻ select
            var select = $(_element).find("select");
            var ul = $(_element).find("ul");
            if (select.length > 0) {
                select = select[0];
                var option = $(select).val();
                if (option != "-1") {
                    value = $('option[value="' + option + '"]').text().trim();
                    keyword = $(select).attr("data-a-touch-header");
                }
            } else if (ul.length > 0) {
                ul = ul[0];
                var label = $(_element).find("label");
                keyword = $(label[0]).text().trim();
                $(ul).find("li").each(function () {
                    var li = this;
                    //Tìm li đang được select
                    if ($(li).attr("class") == 'swatchSelect') {
                        value = $(li).attr("title");
                        //Đừng khi có 1 class select
                        return false;
                    }
                });
                //Trường hợp không phải select, còn lại thường lại list hình ảnh - color
            }
            if (typeof keyword != 'undefined' && typeof value != 'undefined' && value != null && value != "") {
                color_size += ';' + value;
            }
        });

        if (color_size == '') {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    if (typeof item.quantity == 'undefined' || Number(item.quantity) < 0) {
        _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
        return false;
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
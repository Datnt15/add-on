var aliexpress = {};

/**
 * Init load
 * @returns {undefined}
 */
aliexpress.init = function () {
    return {
        element: {
            node: 'h1.product-name',
            insert: "after",
//            html_before: '<br/>'
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
 * @returns {aliexpress.getId.aliexpressAnonym$1}
 */
aliexpress.getId = function () {
    var id = $("input[name=objectId]").val();
    if (typeof id == 'undefined') {
        var pathname = window.location.pathname;
        var re = /\/(.+)\.html/i;
        var id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return id;
};

aliexpress.getCurrency = function () {
    return "USD";
};

aliexpress.getQuantity = function () {
    var quantity = '';
    var qElement = $("input#product-info-txt-quantity");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity == '' || quantity <= 0 ? 1 : quantity;
};

aliexpress.getImage = function () {
    var img_src = $('meta[property="og:image"]').attr("content");
    return img_src;
};

aliexpress.getTitle = function () {
    var tb = $('h1.product-name').text().trim();
    return tb;
};

aliexpress.getPrice = function () {
    var price = $('span#sku-discount-price').text().trim().replace(/[^0-9\.\,]/g, '');
    if (typeof price == 'undefined' || price == null || price == '') {
        price = $("span#sku-price").text().trim().replace(/[^0-9\.\,]/g, '');
    }
    if (typeof price == 'undefined' || $("span#j-sku-discount-price").length >= 1) {
        price = $("span#j-sku-discount-price").text().trim().replace(/[^0-9\.\,]/g, '');
    }
    return price;
};

aliexpress.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
aliexpress.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
aliexpress.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "aliexpress";
    item.item_id = aliexpress.getId();
    item.item_price = aliexpress.getPrice();
    item.item_image = aliexpress.getImage();
    item.seller_name = aliexpress.getSellerName();
    item.seller_id = aliexpress.getSellerId();
    item.quantity = aliexpress.getQuantity();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    //Danh sách thuộc tính
    var __subs = $("div#product-info-sku > dl");

    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            var keyword, value;
            keyword = $(_element).find("dt").text().trim();

            //TRường hợp là thẻ select
            var ul = $(_element).find("dd > ul");

            if (ul.length > 0) {
                ul = ul[0];
                $(ul).find("li").each(function () {
                    var li = this;
                    //Tìm li đang được select
                    if ($(li).attr("class") == 'active') {
                        value = $(li).find("a").attr("title");
                        if (typeof value == 'undefined') {
                            value = $(li).find("a").text();
                        }
                        //Đừng khi có 1 class select
                        value = value.trim();
                        return false;
                    }
                });
                //Trường hợp không phải select, còn lại thường lại list hình ảnh - color
            }

            if (typeof keyword != 'undefined' && typeof value != 'undefined') {
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
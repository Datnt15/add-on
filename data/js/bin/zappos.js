var zappos = {};

/**
 * Init load
 * @returns {undefined}
 */
zappos.init = function () {
    return {
        element: {
            node: 'div#transBtns',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{width: 212px!important;max-height: 460px!important;}\
                  #addon_view_cart{display: block!important;width: 100px!important;}\
                  #txtBz{width:209px!important;}\
                  #addon_block_weight {margin-left:10px!important;}\
                  #addon-cal{margin-left: 10px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {zappos.getId.zapposAnonym$1}
 */
zappos.getId = function () {
    var id = '';
    if ($("input[name=productId]").length >= 1) {
        id = $("input[name=productId]");
        id = $(id[0]).val();
    }
    if ($("span#sku span[itemprop=sku]").length === 1) {
        id = $("span#sku span[itemprop=sku]").text().trim();
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

zappos.getCurrency = function () {
    return "USD";
};

zappos.getQuantity = function () {
    var quantity = '1';
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : quantity;
};

zappos.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    if ((typeof productImage == 'undefined' || productImage == '') && $('div#detailImage img').length == 1) {
        productImage = $('div#detailImage img').attr("src");
    }
    return productImage;
};

zappos.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('div#productStage > h1.title > a[itemprop=name]').length == 1) {
        productName = $.trim($('div#productStage > h1.title > a[itemprop=name]').attr("content"));
    }
    return productName;
};

zappos.getPrice = function () {
    var price = "";
    if ($('#priceSlot .price').length === 1) {
        price = $.trim($('#priceSlot .price').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

zappos.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

zappos.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
zappos.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
zappos.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if ($("#transBtns button#addToCart").text() == 'Out of Stock') {
        _fn_select_specific("Sản phẩm bạn chọn đã hết hàng, vui lòng chọn sản phẩm khác");
        return false;
    }

    var item = {};
    item.type = "zappos";
    item.item_id = zappos.getId();
    item.item_name = zappos.getTitle();
    item.item_price = zappos.getPrice();
    item.item_image = zappos.getImage();
    item.seller_name = zappos.getSellerName();
    item.seller_id = zappos.getSellerId();
    item.quantity = zappos.getQuantity();
    item.shippingWeight = zappos.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    //Danh sách thuộc tính
    var __subs = $("#purchaseOptions select");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            var keyword, value;

            //TRường hợp là thẻ select
            var keyword = $(_element).val();
            if (keyword == -1 || keyword == '-1_size') {
                color_size = '';
                return false;
            }
            value = $(_element).find('option[value=' + keyword + ']').text();
            if (typeof value != 'undefined') {
                color_size += ';' + value;
                data_value += ';' + ($(_element).parent().find("label").text().replace(":", "").trim()) + ":" + keyword;
            }
        });
        if (color_size == '') {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    item.color_size = color_size;
    item.data_value = data_value;

    //Get max quantity
    item.maxQuantity = -1;
    if (typeof $("div#transBtns > #oosLimitedTag") != undefined && $("div#transBtns > #oosLimitedTag").attr("class").indexOf("hide") == -1) {
        item.maxQuantity = $("div#transBtns > #oosLimitedTag").text().replace(/[^0-9\.]/g, '');
    }
    return item;
};
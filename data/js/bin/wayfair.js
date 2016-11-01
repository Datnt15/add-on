var wayfair = {};

/**
 * Init load
 * @returns {undefined}
 */
wayfair.init = function () {
    return {
        element: {
            node: 'div#atc_btn_wrap',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{margin-top: 34px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {wayfair.getId.wayfairAnonym$1}
 */
wayfair.getId = function () {
    var id = '';
    if ($('meta[property="og:upc"]').length == 1) {
        id = $('meta[property="og:upc"]').attr('content');
    }
    if (typeof id == undefined || id == '') {
        var pathname = window.location.pathname;
        var re = /(.+)\-(.+).html/i;
        var id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[2];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

wayfair.getCurrency = function () {
    var currency = 'USD';
    if ($('meta[property="og:price:currency"]').length == 1) {
        currency = $('meta[property="og:price:currency"]').attr('content');
    }
    return currency;
};

wayfair.getQuantity = function () {
    var quantity = '';
    if ($("form#AddToCartForm select[name=tmp_qty]").length == 1) {
        quantity = $("form#AddToCartForm select[name=tmp_qty]").val();
    }
    return typeof quantity == 'undefined' || quantity == '' || Number(quantity) <= 0 ? 1 : quantity;
};

wayfair.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    return productImage;
};

wayfair.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('h1.product__nova__title').length == 1) {
        productName = $.trim($('h1.product__nova__title').attr("content"));
    }
    return productName;
};

wayfair.getPrice = function () {
    var price = "";
    if ($('input#pdp_price').length === 1) {
        price = $.trim($('input#pdp_price').val());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : Number(price.replace(/[^0-9\.]/g, '')) / wayfair.getQuantity();
};

wayfair.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

wayfair.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
wayfair.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
wayfair.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if ($("#transBtns button#addToCart").text() == 'Out of Stock') {
        _fn_select_specific("Sản phẩm bạn chọn đã hết hàng, vui lòng chọn sản phẩm khác");
        return false;
    }

    var item = {};
    item.type = "wayfair";
    item.item_id = wayfair.getId();
    item.item_name = wayfair.getTitle();
    item.item_price = wayfair.getPrice();
    item.item_image = wayfair.getImage();
    item.seller_name = wayfair.getSellerName();
    item.seller_id = wayfair.getSellerId();
    item.quantity = wayfair.getQuantity();
    item.shippingWeight = wayfair.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    //Danh sách thuộc tính
    var __subs = $("div.option_select_wrap a.js-visual-option");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            if ($(_element).attr("class").indexOf("visual_option_selected") != -1) {
                color_size += ';' + $(_element).attr("data-option-name").trim();
                data_value += ';' + ($(_element).attr("data-name").trim()) + ":" + $(_element).attr("prsku").trim();
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
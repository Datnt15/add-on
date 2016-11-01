var forever21 = {};

/**
 * Init load
 * @returns {undefined}
 */
forever21.init = function () {
    var elm = $("div#divAddWishList");
    if (typeof elm == 'undefined' || $(elm).length == 0) {
        elm = $("button#addtobag");
    }
    return {
        element: {
            node: elm,
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #txtBz {margin-bottom: 5px!important;} #addon-weight{height: 26px!important; margin-bottom: 5px!important;}\
                  #addon_add_cart {margin-top: -1px!important; width: 105px!important;height: 25px !important;vertical-align: middle!important;}\
                  #addon-cal {font-size: 12px!important;font-size: 12px!important; margin-top: -1px!important; width: 220px!important;height: 25px !important;vertical-align: middle!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {forever21.getId.forever21Anonym$1}
 */
forever21.getId = function () {
    var id = $("input.hdProductId").val();
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.pathname;
        var re = /ProductID\=(.+)\&/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

forever21.getCurrency = function () {
    return "USD";
};

forever21.getQuantity = function () {
    var quantity = '1';
    if ($("form#aspnetForm div.pdp_qty dl.dropdown span#span_qty").length == 1) {
        quantity = $("form#aspnetForm div.pdp_qty dl.dropdown span#span_qty").text().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

forever21.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    if ($('form#aspnetForm img').length > 1) {
        if ($('form#aspnetForm img#ctl00_MainContent_productImage').length == 1) {
            productImage = $('form#aspnetForm img#ctl00_MainContent_productImage');
            productImage = $(productImage[0]).attr("src");
        } else {
            productImage = $('form#aspnetForm img');
            productImage = $(productImage[0]).attr("src");
        }

    }
    return productImage;
};

forever21.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('form#aspnetForm h1.item_name_p').length == 1) {
        productName = $.trim($('form#aspnetForm h1.item_name_p').text());
    }
    return productName;
};

forever21.getPrice = function () {
    var price = "-1";
    var e_price = $('form#aspnetForm div.price_p span[itemprop="price"]');
    if ($(e_price).length === 1) {
        price = $.trim($(e_price).text());
        if ($(e_price).find("span.sale").length == 1) {
            price = $(e_price).find("span.sale").text();
        }
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

forever21.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

forever21.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
forever21.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
forever21.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(forever21.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "forever21";
    item.item_id = forever21.getId();
    item.item_name = forever21.getTitle();
    item.item_price = forever21.getPrice();
    item.item_image = forever21.getImage();
    item.seller_name = forever21.getSellerName();
    item.seller_id = forever21.getSellerId();
    item.quantity = forever21.getQuantity();
    item.shippingWeight = forever21.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var ul_color = $("ul#ulProductColor");
    if ($(ul_color).length > 0 && $(ul_color).find("li").length > 0) {
        var isColor = false;
        $(ul_color).find("li").each(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                color_size += ";" + $(this).find("img").attr("alt");
                data_value += ";color:" + $(this).find("img").attr("alt");
                isColor = true;
                return false;
            }
        });
        if (!isColor) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    var ul_color = $("ul#ulProductSize");
    if ($(ul_color).length > 0 && $(ul_color).find("li").length > 0) {
        var isSize = false;
        var elm = $('input#ctl00_MainContent_hdSelectedSizeName');
        if (typeof elm != 'undefined' && $(elm).val() != '') {
            color_size += ";" + $(elm).val();
            data_value += ";size:" + $(elm).val();
            isSize = true;
        }
        if (!isSize) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
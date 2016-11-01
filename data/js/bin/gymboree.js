var gymboree = {};

/**
 * Init load
 * @returns {undefined}
 */
gymboree.init = function () {
    return {
        element: {
            node: '#pdp-bv-rating',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body {font-size: 11px;height: 350px!important;max-height: 500px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {gymboree.getId.gymboreeAnonym$1}
 */
gymboree.getId = function () {
    var id = $("meta[itemprop=productID]").attr('content');
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.href;
        var re = /(.+)-(.+)/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[2];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

gymboree.getCurrency = function () {
    return "USD";
};

gymboree.getQuantity = function () {
    var quantity = '1';
    if ($("input#pdp-quantity-value").length == 1) {
        quantity = $("input#pdp-quantity-value").val().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

gymboree.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    return productImage;
};

gymboree.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('h1#pdp-product-title').length == 1) {
        productName = $.trim($('h1#pdp-product-title').text());
    }
    return productName;
};

gymboree.getPrice = function () {
    var price = "-1";
    if ($('div#pdp-price span#pdp-sale-price').length === 1) {
        price = $.trim($('div#pdp-price span#pdp-sale-price').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

gymboree.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

gymboree.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
gymboree.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
gymboree.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(gymboree.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "gymboree";
    item.item_id = gymboree.getId();
    item.item_name = gymboree.getTitle();
    item.item_price = gymboree.getPrice();
    item.item_image = gymboree.getImage();
    item.seller_name = gymboree.getSellerName();
    item.seller_id = gymboree.getSellerId();
    item.quantity = gymboree.getQuantity();
    item.shippingWeight = gymboree.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var ul_color = $("div#pdp-color-options");
    if ($(ul_color).length > 0 && $(ul_color).find("label").length > 0) {
        var isColor = false;
        $(ul_color).find("label").each(function () {
            if ($(this).attr("class").indexOf("active") != -1) {
                color_size += ";" + $(this).find("input").val();
                data_value += ";color:" + $(this).find("input").val();
                isColor = true;
                return false;
            }
        });
        if (!isColor) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    var ul_color = $("div#pdp-product-size");
    if ($(ul_color).length > 0 && $(ul_color).find("label").length > 0) {
        var isColor = false;
        $(ul_color).find("label").each(function () {
            if ($(this).attr("class").indexOf("active") != -1) {
                color_size += ";" + $(this).find("input").val();
                data_value += ";size:" + $(this).find("input").val();
                isColor = true;
                return false;
            }
        });
        if (!isColor) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
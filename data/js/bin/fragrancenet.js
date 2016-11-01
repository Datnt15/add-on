var fragrancenet = {};

/**
 * Init load
 * @returns {undefined}
 */
fragrancenet.init = function () {
    return {
        element: {
            node: '#contentPane div.rightZone div.left',
            insert: "after",
            html_before: '<br/><div style="clear: both;"></div>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{width: 408px!important;max-height: 392px!important; font-size: 12px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {fragrancenet.getId.fragrancenetAnonym$1}
 */
fragrancenet.getId = function () {
    var id = $("input#mvOrderItem").val();
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.href;
        var re = /(.+)#(.+)/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[2];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

fragrancenet.getCurrency = function () {
    return "USD";
};

fragrancenet.getQuantity = function () {
    var quantity = '1';
    if ($("input#quantBox").length == 1) {
        quantity = $("input#quantBox").val().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

fragrancenet.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
        if (productImage.indexOf("http") == -1) {
            productImage = "http://" + productImage;
        }
    }
    return productImage;
};

fragrancenet.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('div#contentPane h1.brandTitle').length == 1) {
        productName = $.trim($('div#contentPane h1.brandTitle').text());
    }
    return productName;
};

fragrancenet.getPrice = function () {
    var price = "-1";
    if ($('form#prodSubmit div.ourPrice p.price').length === 1) {
        price = $.trim($('form#prodSubmit div.ourPrice p.price').attr("data-price"));
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

fragrancenet.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

fragrancenet.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
fragrancenet.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
fragrancenet.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(fragrancenet.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "fragrancenet";
    item.item_name = fragrancenet.getTitle();
    item.item_id = fragrancenet.getId();
    item.item_price = fragrancenet.getPrice();
    item.item_image = fragrancenet.getImage();
    item.seller_name = fragrancenet.getSellerName();
    item.seller_id = fragrancenet.getSellerId();
    item.quantity = fragrancenet.getQuantity();
    item.shippingWeight = fragrancenet.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
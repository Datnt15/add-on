var toysrus = {};

/**
 * Init load
 * @returns {undefined}
 */
toysrus.init = function () {
    var elm = $("div#cartButtons");
    return {
        element: {
            node: elm,
            insert: "before",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {toysrus.getId.toysrusAnonym$1}
 */
toysrus.getId = function () {
    var id = $("input[name=productId]").val();
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.pathname;
        var re = /productId\=(.+)\&/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

toysrus.getCurrency = function () {
    return "USD";
};

toysrus.getQuantity = function () {
    var quantity = '1';
    if ($("div#qty input#quantity").length == 1) {
        quantity = $("div#qty input#quantity").val();
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

toysrus.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    return productImage;
};

toysrus.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('div#lTitle h1').length == 1) {
        productName = $.trim($('div#lTitle h1').text());
    }
    return productName;
};

toysrus.getPrice = function () {
    var price = "-1";
    if ($('div#price > ul > li.retail').length > 0) {
        price = $.trim($('div#price > ul > li.retail').find("span").text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

toysrus.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

toysrus.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
toysrus.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
toysrus.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(toysrus.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "toysrus";
    item.item_id = toysrus.getId();
    item.item_name = toysrus.getTitle();
    item.item_price = toysrus.getPrice();
    item.item_image = toysrus.getImage();
    item.seller_name = toysrus.getSellerName();
    item.seller_id = toysrus.getSellerId();
    item.quantity = toysrus.getQuantity();
    item.shippingWeight = toysrus.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    item.color_size = color_size;
    item.data_value = data_value;
//    console.log(item);
    return item;
};
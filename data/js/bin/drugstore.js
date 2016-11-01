var drugstore = {};

/**
 * Init load
 * @returns {undefined}
 */
drugstore.init = function () {
    return {
        element: {
            node: 'div#divCaption h1',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{width: 325px!important;max-height: 375px!important;}\
                  #addon_view_cart{display: block!important;width: 100px!important;}\
                  #txtBz{width:320px!important;}\
                  #addon_block_weight {margin-left:10px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {drugstore.getId.drugstoreAnonym$1}
 */
drugstore.getId = function () {
    var id = '';
    var url = $('meta[property="og:url"]').attr("content");
    if (typeof url != 'undefined') {
        var re = /\/(.*)\/(.+)/i;
        var id = re.exec(url);
    }
    if (id == '') {
        var pathname = window.location.pathname;
        var re = /\/(.*)\/(.+)/i;
        var id = re.exec(pathname);
    }
    return (id == null || id.length == 0) ? null : id[2];
};

drugstore.getCurrency = function () {
    return "USD";
};

drugstore.getQuantity = function () {
    var quantity = '';
    var qElement = $("div#divQuantity input#txtQuantity");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : quantity;
};

drugstore.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    if ((typeof productImage == 'undefined' || productImage == '') && $('div#divPImage img').length == 1) {
        productImage = $('div#divPImage img').attr("src");
    }
    return productImage;
};

drugstore.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('div#divCaption h1').length === 1) {
        productName = $.trim($('div#divCaption h1').text());
    }
    return productName;
};

drugstore.getPrice = function () {
    var price = "";
    if ($('meta[name="twitter:data1"]').length === 1) {
        price = $('meta[name="twitter:data1"]').attr("content");
    }
    if ($("div#productprice .price").length == 1) {
        var html = $("div#productprice .price");
        if ($(html).find(".unitPrice").length > 0) {
            $(html).find(".unitPrice").remove();
        }
        price = $(html).text();
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

drugstore.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

drugstore.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
drugstore.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
drugstore.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "drugstore";
    item.item_id = drugstore.getId();
    item.item_name = drugstore.getTitle();
    item.item_price = drugstore.getPrice();
    item.item_image = drugstore.getImage();
    item.seller_name = drugstore.getSellerName();
    item.seller_id = drugstore.getSellerId();
    item.quantity = drugstore.getQuantity();
    item.shippingWeight = drugstore.getshippingWeight();
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
var bhphotovideo = {};

/**
 * Init load
 * @returns {undefined}
 */
bhphotovideo.init = function () {
    return {
        element: {
            node: 'div[data-selenium="productRating"]',
            insert: "after",
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
 * @returns {bhphotovideo.getId.bhphotovideoAnonym$1}
 */
bhphotovideo.getId = function () {
    var id = $("div.top-right table-cell form[name=addItemToCart] input[name=sku]").val();
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.pathname;
        var re = /product\/(.+)\-(.+)\/(.+).html/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

bhphotovideo.getCurrency = function () {
    return "USD";
};

bhphotovideo.getQuantity = function () {
    var quantity = '1'; 
    if ($("div[data-selenium=PriceZoneRight] form[name=addItemToCart] input[name=q]").length == 1) {
        quantity = $("div[data-selenium=PriceZoneRight] form[name=addItemToCart] input[name=q]").val();
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : quantity;
};

bhphotovideo.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
    }
    if ((typeof productImage == 'undefined' || productImage == '') && $('img#mainImage').length == 1) {
        productImage = $('img#mainImage').attr("src");
    }
    return productImage;
};

bhphotovideo.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('h1.pProductName span[itemprop="name"]').length == 1) {
        productName = $.trim($('h1.pProductName span[itemprop="name"]').text());
    }
    return productName;
};

bhphotovideo.getPrice = function () {
    var price = "-1";
    if ($('div.youPay').length === 1) {
        price = $.trim($('div.youPay').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

bhphotovideo.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

bhphotovideo.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
bhphotovideo.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
bhphotovideo.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(bhphotovideo.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "bhphotovideo";
    item.item_name = bhphotovideo.getTitle();
    item.item_id = bhphotovideo.getId();
    item.item_price = bhphotovideo.getPrice();
    item.item_image = bhphotovideo.getImage();
    item.seller_name = bhphotovideo.getSellerName();
    item.seller_id = bhphotovideo.getSellerId();
    item.quantity = bhphotovideo.getQuantity();
    item.shippingWeight = bhphotovideo.getshippingWeight();
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
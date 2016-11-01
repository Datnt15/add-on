var childrensplace = {};

/**
 * Init load
 * @returns {undefined}
 */
childrensplace.init = function () {
    return {
        element: {
            node: '#social',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{width: 320px!important;max-height: 392px!important; font-size: 12px!important;}\
                  #addon_view_cart{display: block!important;width: 100px!important;}\
                  #txtBz{width:270px!important;}\
                  #addon_block_weight {margin-left:10px!important;}\
                  #addon-cal{margin-left: 10px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {childrensplace.getId.childrensplaceAnonym$1}
 */
childrensplace.getId = function () {
    var id = $("span#partNumber").text();
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.href;
        var re = /(.+)-(.+)-(.+)/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[2] + "-" + id[3];
    } else {
        id = id.replace(/[^0-9\_]/g, '');
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

childrensplace.getCurrency = function () {
    return "USD";
};

childrensplace.getQuantity = function () {
    var quantity = '1';
    if ($("select#quantity").length == 1) {
        quantity = $("select#quantity").val().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

childrensplace.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
        if (productImage.indexOf("http") == -1) {
            productImage = "http://" + productImage;
        }
    }
    return productImage;
};

childrensplace.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('div#product-detail-wrapper h1[itemprop="name"]').length == 1) {
        productName = $.trim($('div#product-detail-wrapper h1[itemprop="name"]').text());
    }
    return productName;
};

childrensplace.getPrice = function () {
    var price = "-1";
    if ($('div#priceArea span.sale-price').length === 1) {
        price = $.trim($('div#priceArea span.sale-price').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

childrensplace.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

childrensplace.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
childrensplace.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
childrensplace.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(childrensplace.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "childrensplace";
    item.item_id = childrensplace.getId();
    item.item_name = childrensplace.getTitle();
    item.item_price = childrensplace.getPrice();
    item.item_image = childrensplace.getImage();
    item.seller_name = childrensplace.getSellerName();
    item.seller_id = childrensplace.getSellerId();
    item.quantity = childrensplace.getQuantity();
    item.shippingWeight = childrensplace.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var ul_color = $("ul#prod-swatches");
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

    var ul_color = $("ul#select_TCPSize");
    if ($(ul_color).length > 0 && $(ul_color).find("li").length > 0) {
        var isColor = false;
        $(ul_color).find("li").each(function () {
            if ($(this).attr("class").indexOf("selected") != -1) {
                color_size += ";" + $(this).find("a").text();
                data_value += ";size:" + $(this).find("a").attr("id");
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
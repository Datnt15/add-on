var victoriassecret = {};

/**
 * Init load
 * @returns {undefined}
 */
victoriassecret.init = function () {
    var elm = $('section#content section.product button.fab-btn--primary');
    return {
        element: {
            node: elm[0],
            insert: "after",
            html_before: '<br/><div style="clear: both;"></div>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_body{margin-top: 10px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {victoriassecret.getId.victoriassecretAnonym$1}
 */
victoriassecret.getId = function () {
    var pathname = window.location.href;
    var re = /\?ProductID\=(.+)\&/i;
    var id = re.exec(pathname);
    id = (id == null || id.length == 0) ? null : id[1];

    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

victoriassecret.getCurrency = function () {
    return "USD";
};

victoriassecret.getQuantity = function () {
    var quantity = '1';
    if ($('section#content section.product section[data-common-name="quantity"] input.fab-input-text').length == 1) {
        quantity = $('section#content section.product section[data-common-name="quantity"] input.fab-input-text').val().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? 1 : Number(quantity);
};

victoriassecret.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
        if (productImage.indexOf("http") == -1) {
            productImage = "http://" + productImage;
        }
    }
    return productImage;
};

victoriassecret.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('section#content section.product h1').length == 1) {
        productName = $.trim($('section#content section.product h1').text());
    }
    return productName;
};

victoriassecret.getPrice = function () {
    var price = "-1";
    if ($('section#content section.product section[itemprop="description"] div.price p').length === 1) {
        price = $.trim($('section#content section.product section[itemprop="description"] div.price p').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

victoriassecret.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    return shippingWeight;
};

victoriassecret.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
victoriassecret.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
victoriassecret.getItem = function (_fn_select_specific) {

    //Kiểm tra sản phẩm
    if (Number(victoriassecret.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }

    var item = {};
    item.type = "victoriassecret";
    item.item_name = victoriassecret.getTitle();
    item.item_id = victoriassecret.getId();
    item.item_price = victoriassecret.getPrice();
    item.item_image = victoriassecret.getImage();
    item.seller_name = victoriassecret.getSellerName();
    item.seller_id = victoriassecret.getSellerId();
    item.quantity = victoriassecret.getQuantity();
    item.shippingWeight = victoriassecret.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var ul_color = $('section#content section.product section[data-common-name="color"] span[role="radiogroup"]');
    if ($(ul_color).length > 0 && $(ul_color).find('a[role="presentation"]').length > 0) {
        var isColor = false;
        $(ul_color).find('a[role="presentation"]').each(function () {
            if (typeof $(this).find("label").attr("class") != 'undefined' && $(this).find("label").attr("class").indexOf("selected") != -1) {
                color_size += ";" + $(this).find("label span[role=presentation]").text().trim();
                data_value += ";color:" + $(this).find("label span[role=presentation]").attr("id");
                isColor = true;
                return false;
            }
        });
        if (!isColor) {
            _fn_select_specific("Bạn chưa chọn 'Color' thuộc tính sản phẩm");
            return false;
        }
    }

    var ul_color = $('section#content section.product section[data-common-name="size"] span[role="radiogroup"]');
    if ($(ul_color).length > 0 && $(ul_color).find('a[role="presentation"]').length > 0) {
        var isColor = false;
        $(ul_color).find('a[role="presentation"]').each(function () {
            if (typeof $(this).find("label").attr("class") != 'undefined' && $(this).find("label").attr("class").indexOf("selected") != -1) {
                color_size += ";" + $(this).find("label span[role=presentation]").text().trim();
                data_value += ";color:" + $(this).find("label span[role=presentation]").attr("id");
                isColor = true;
                return false;
            }
        });
        if (!isColor) {
            _fn_select_specific("Bạn chưa chọn 'Size' thuộc tính sản phẩm");
            return false;
        }
    }

    if (item.quantity <= 0) {
        _fn_select_specific("Bạn chưa chọn số lượng sản phẩm");
        return false;
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
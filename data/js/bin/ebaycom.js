var ebaycom = {};

/**
 * Init load
 * @returns {undefined}
 */
ebaycom.init = function () {
    return {
        element: {
            node: 'div#mainContent div#why2buy',
            insert: "after",
            html_before: '<br/><div style="clear: both;"></div>'
        },
        options: {
            boxComment: true,
            css: ".tahoma{ font-family: tahoma,arial,verdana !important; }\
                  #addon_add_cart{margin-top: -3px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {ebaycom.getId.ebaycomAnonym$1}
 */
ebaycom.getId = function () {
    if ($("#binBtn_btn").length == 0) {
//        console.log("Sản phẩm bạn chọn không phải sản phẩm mua ngay.");
        return null;
    }
    var id = $.trim($("#descItemNumber").text());
    if (typeof id == 'undefined' || id == '') {
        var pathname = window.location.href;
        var re = /(.+)\/(.+)\?/i;
        id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return (typeof id == 'undefined' || id == null || id == '') ? null : id;
};

ebaycom.getCurrency = function () {
    var currency = "USD";
    if ($('span[itemprop="priceCurrency"]').length == 1) {
        currency = $.trim($('span[itemprop="priceCurrency"]').attr("content"));
    }
    return currency;
};

ebaycom.getQuantity = function () {
    var quantity = '';
    if ($('input#qtyTextBox').length == 1) {
        quantity = $('input#qtyTextBox').val().replace(/[^0-9\.]/g, '');
    }
    return typeof quantity == 'undefined' || Number(quantity) <= 0 ? -1 : Number(quantity);
};

ebaycom.getImage = function () {
    var productImage = '';
    if ($('meta[property="og:image"]').length === 1) {
        productImage = $('meta[property="og:image"]').attr("content");
        if (productImage.indexOf("http") == -1) {
            productImage = "http://" + productImage;
        }
    }
    return productImage;
};

ebaycom.getTitle = function () {
    var productName;
    //get product name
    if ($('meta[property="og:title"]').length === 1) {
        productName = $('meta[property="og:title"]').attr("content");
    }
    if ((typeof productName == 'undefined' || productName == '') && $('h1#itemTitle').length == 1) {
        productName = $.trim($('h1#itemTitle').text());
    }
    return productName;
};

ebaycom.getPrice = function () {
    var price = "-1";
    if ($('#prcIsum').length === 1) {
        price = $.trim($('#prcIsum').text());
    }

    if ($('#mm-saleDscPrc').length === 1) {
        price = $.trim($('#mm-saleDscPrc').text());
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

ebaycom.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    if ($('#isum-shipCostDiv').length == 1) {
        shippingWeight = $.trim($('#isum-shipCostDiv').text());
        if (typeof shippingWeight == 'undefined' || shippingWeight == 'Free shipping') {
            shippingWeight = '0';
        }
    }
    return shippingWeight;
};

ebaycom.getSellerName = function ()
{
    var seller_name = '';
    if ($('#RightSummaryPanel span.mbg-nw').length == 1) {
        seller_name = $.trim($('#RightSummaryPanel span.mbg-nw').text());
    }
    return seller_name;
};

/**
 * 
 * @returns {String|Array}
 */
ebaycom.getSellerId = function () {
    var seller_id = '';
    if ($('#RightSummaryPanel span.mbg-nw').length == 1) {
        var seller_url = $.trim($('#RightSummaryPanel span.mbg-nw').parent("a").attr("href"));
        var re = /\?_trksid\=(.+)/i;
        seller_id = re.exec(seller_url);
        seller_id = (seller_id == null || seller_id.length == 0) ? null : seller_id[1];
    }
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
ebaycom.getItem = function (_fn_select_specific) {
    //Kiểm tra sản phẩm
    if (Number(ebaycom.getPrice()) == -1) {
//        console.log("Sản phẩm không tìm thấy giá");
        return false;
    }
    //Là sản phẩm mua ngay
    if ($("#binBtn_btn").length == 0) {
        _fn_select_specific("Sản phẩm bạn chọn không phải sản phẩm mua ngay.");
//        console.log("Sản phẩm bạn chọn không phải sản phẩm mua ngay.");
        return false;
    }

    //Kiểm tra số lượng sản phẩm
    if (ebaycom.getQuantity() <= 0) {
        _fn_select_specific("Bạn chưa chọn số lượng sản phẩm");
        return false;
    }

    var item = {};
    item.type = "ebaycom";
    item.item_id = ebaycom.getId();
    item.item_name = ebaycom.getTitle();
    item.item_price = ebaycom.getPrice();
    item.item_image = ebaycom.getImage();
    item.seller_name = ebaycom.getSellerName();
    item.seller_id = ebaycom.getSellerId();
    item.quantity = ebaycom.getQuantity();
    item.shippingWeight = ebaycom.getshippingWeight();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var _sub = $("div#mainContent form div.nonActPanel select");
    if ($(_sub).length > 0) {
        var index = 0;
        $(_sub).each(function () {
            var elm = this;
            if ($(elm).val() != '-1') {
                index++;
                color_size += ";" + $.trim($(elm).find('option[value=' + $(elm).val() + ']').text());
                data_value += ";" + $(elm).attr("name") + ':' + $(elm).val();
            }
        });
        if ($(_sub).length != index) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    item.color_size = color_size;
    item.data_value = data_value;
//    console.log(item);
    return item;
};
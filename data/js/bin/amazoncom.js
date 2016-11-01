var amazoncom = {};

/**
 * Init load
 * @returns {undefined}
 */
amazoncom.init = function () {
    var node = null;
    if ($("#btAsinTitle").length === 1) {
        node = $("#btAsinTitle").parent();
    } else if ($('#title_feature_div').length === 1) {
        node = $("#title_feature_div");
    } else if ($('#title').length === 1) {
        node = $('h1#title').parent();
    }
    return {
        element: {
            node: node,
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana !important; }\
                  #addon_body{max-height: 352px!important;}\
                  #addon_view_cart {display: block;width: 119px;float: left;margin-right: 5px;padding: 5px 10px!important;} \
                  #box-confirm-order h4 {font-size: 13px;}\
                  #addon-weight {height: 26px!important;}\
                  #addon-clear-both {clear: inherit!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {amazoncom.getId.amazoncomAnonym$1}
 */
amazoncom.getId = function () {
    var id = $("input#ASIN").val();
    if (typeof id == 'undefined' || id == null || id == '') {
        var pathname = window.location.pathname;
        var re = /dp\/(.+)/i;
        var id = re.exec(pathname);
        id = (id == null || id.length == 0) ? null : id[1];
    }
    return id;
};

amazoncom.getCurrency = function () {
    return "USD";
};

amazoncom.getQuantity = function () {
    var quantity = '';
    var qElement = $("div#selectQuantity select#quantity");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity;
};

amazoncom.getImage = function () {
    var productImage;
    if ($('#main-image').length === 1) {
        $('#main-image').attr('rel') === '' ? productImage = $('#main-image').attr('src') : productImage = $('#main-image').attr('rel');
    }
    if ($('#main-image-container').children('ul').length === 1) {
        var ImgElem = $('#main-image-container').children('ul').children('.image').children('span').children('span').children('div').children('img');
        ImgElem.attr('data-old-hires') !== '' ? productImage = ImgElem.attr('data-old-hires') : productImage = ImgElem.attr('src');
    }
    if ($('#main-image-container').children('#img-wrapper').children('#img-canvas').length === 1) {
        productImage = $('#main-image-container').children('#img-wrapper').children('#img-canvas').children('img').attr('src');
    }
    if ($('#prodImageContainer').length === 1) {
        productImage = $('#prodImageContainer').children('#prodImageCell').children('a').children('img').attr('src');
    }
    return productImage;
};

amazoncom.getTitle = function () {
    var productName;
    //get product name
    if ($('#btAsinTitle').length === 1) {
        productName = $.trim($('#btAsinTitle').text());
    }
    if ($('h1#title').length === 1) {
        productName = $.trim($('h1#title').text());
    }
    return productName;
};

amazoncom.getPrice = function () {
    var price = "";
    var priceList = "";
    //get product price
    if ($('#price').length === 1) {
        priceList = $('#price').children('table').children('tbody');

        if (priceList.children().length === 1 || priceList.children().length === 2) {
            price = priceList.children(':nth-child(1)').children(':nth-child(2)').children(':nth-child(1)').text();
        }
        if (priceList.children().length === 3) {
            price = priceList.children(':nth-child(2)').children(':nth-child(2)').children(':nth-child(1)').text();
        }
    }
    if ($('#priceBlock').length === 1) {
        priceList = $('#priceBlock').children('table').children('tbody');

        if (priceList.children('tr').length === 1) {
            price = priceList.children('tr').children('#buyingPriceContent').children('#buyingPriceValue').children('b').text();
        }

        if (priceList.children('tr').length === 3) {
            price = priceList.children('#actualPriceRow').children('#actualPriceContent').children('#actualPriceValue').children('b.priceLarge').text();
        }

        if (priceList.children('tr').length === 5) {
            price = priceList.children('#actualPriceRow').children('#actualPriceContent').children('#actualPriceValue').text();
        }
    }

    if ($('#aloha_price').length === 1) {
        if ($('#aloha_price').children('#aloha-price-wrapper').children('#contract-free').length === 1) {
            price = $('#aloha_price').children('#aloha-price-wrapper').children('#contract-free').text();
        }
        if ($('#aloha_price').children('#aloha-price-wrapper').children('#aloha-displayed-price').children('#current-price').length === 1) {
            price = $('#aloha_price').children('#aloha-price-wrapper').children('#aloha-displayed-price').children('#current-price').text();
            var pattern = new RegExp(/[ - ]/gi);
            if (pattern.test(price)) {
                price = price.split("–")[1];
            }
        }
    }

    if (typeof price == 'undefined' || price == null || price == '' && $("#priceblock_dealprice").length == 1) {
        price = $("#priceblock_dealprice").text();
    }
    return typeof price == 'undefined' || price == null || price == '' ? 0 : price.replace(/[^0-9\.]/g, '');
};

amazoncom.getshippingWeight = function () {
    //get shipping weight
    var shippingWeight = "0";
    if ($('#detail-bullets').length === 1) {
        var detail = $('#detail-bullets').children('table').children('tbody').children('tr').children('td').children('div').children('ul').children('li');
        detail.each(function (k, v) {
            if ($.trim($(v).children('b').text()) === 'Shipping Weight:') {
                $(v).children('b').remove();
                var arrShippingWeight = $.trim($(v).text()).replace('(View shipping rates and policies)', '').split(' ');
                var shippingWeightUnit = $.trim(arrShippingWeight[1]);
                shippingWeightUnit === 'ounces' ? shippingWeight = Math.round(arrShippingWeight[0] * 0.06 * 100) / 100 : shippingWeight = arrShippingWeight[0];
                $(v).prepend('<b>Shipping Weight: </b>');
            }
        });
    }
    if ($('div#detailBullets_feature_div').length === 1) {
        var detail = $('div#detailBullets_feature_div').children('ul').children('li');
        detail.each(function (k, v) {
            if ($.trim($(v).children('span').children('span:nth-child(1)').text()) === 'Shipping Weight:') {
                var arrShippingWeight = $.trim($(v).children('span').children('span:nth-child(2)').text()).replace('(View shipping rates and policies)', '').split(' ');
                var shippingWeightUnit = $.trim(arrShippingWeight[1]);
                shippingWeightUnit === 'ounces' ? shippingWeight = Math.round(arrShippingWeight[0] * 0.06 * 100) / 100 : shippingWeight = arrShippingWeight[0];
                $(v).prepend('<span class="a-text-bold">Shipping Weight: </span>');
            }
        });
    }
    if ($('#prodDetails').length === 1) {
        var detail = $('#prodDetails').children('.wrapper').children('.col2').children(':nth-child(1)').children(':nth-child(2)').children().children().children('table').children('tbody').children('tr');
        detail.each(function (k, v) {
            if ($.trim($(v).children('td:nth-child(1)').text()) === 'Shipping Weight') {
                var arrShippingWeight = $.trim($(v).children('td:nth-child(2)').text()).replace('(View shipping rates and policies)', '').split(' ');
                var shippingWeightUnit = $.trim(arrShippingWeight[1]);
                shippingWeightUnit === 'ounces' ? shippingWeight = Math.round(arrShippingWeight[0] * 0.06 * 100) / 100 : shippingWeight = arrShippingWeight[0];
            }
        });
    }
    return shippingWeight;
};

amazoncom.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
amazoncom.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
amazoncom.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "amazoncom";
    item.item_id = amazoncom.getId();
    item.item_name = amazoncom.getTitle();
    item.item_price = amazoncom.getPrice();
    item.item_image = amazoncom.getImage();
    item.seller_name = amazoncom.getSellerName();
    item.seller_id = amazoncom.getSellerId();
    item.quantity = amazoncom.getQuantity();
    item.shippingWeight = amazoncom.getshippingWeight();
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
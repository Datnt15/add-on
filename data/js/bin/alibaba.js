var alibaba = {};

/**
 * Init load
 * @returns {undefined}
 */
alibaba.init = function () {
    return {
        element: {
            node: '#J-validate-quantity',
            insert: "after",
            html_before: '<br/>'
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana ! important; }\
                  #addon_add_cart{margin-top: 0px!important;}\
                  #txtBz {margin-bottom: 5px!important;}\
                  #addon_view_link_cart{padding: 0px 25px!important;}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {alibaba.getId.alibabaAnonym$1}
 */
alibaba.getId = function () {
    var pathname = window.location.pathname;
    var re = /\_(.+)\.html/i;
    var id = re.exec(pathname);
    var id = (id == null || id.length == 0) ? null : id[1];
    return id;
};

alibaba.getCurrency = function () {
    return "USD";
};

alibaba.getQuantity = function () {
    var quantity = '';
    var qElement = $("div.quantity-value input.ui-textfield");
    if (typeof qElement != 'undefined') {
        quantity = $(qElement).val();
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity == '' || quantity <= 0 ? 1 : quantity;
};

alibaba.getImage = function () {
    var img_src = "http:" + $('meta[property="og:image"]').attr("content");
    return img_src;
};

alibaba.getTitle = function () {
    var tb = $('h1[itemprop="name"]').text().trim();
    return tb;
};

alibaba.getPrice = function () {
    var price = "0";
    //http://wholesaler.alibaba.com/product-detail/Smart-Bracelet-Bluetooth-4-0-Wristbands_60419824349.html?spm=5386.2469378.2513859.142.OMfn3y
    if ($('h3[itemprop=priceCurrency]').length == 1) {
        price = $('h3[itemprop=priceCurrency]').find('span[itemprop=price]').text();
    }
    //http://wholesaler.alibaba.com/product-detail/2016-Man-Cycling-Jersey-Bicycle-Bike_60410120604.html?spm=5386.2469378.2513859.72.OMfn3y
    if ($('div#ladderPrice').length == 1) {
        $('div#ladderPrice').find('div[data-role="ladder-price-item"]').each(function () {
            if ($(this).attr("class").indexOf("current-ladder-price") != -1) {
                price = $(this).find("div.ladder-price-promotion span.priceVal").text();
                return false;
            }
        });
    }
    return price.trim().replace(/[^0-9\.\,]/g, '');
};

alibaba.getSellerName = function ()
{
    var seller_name = '';
    return seller_name.trim();
};

/**
 * 
 * @returns {String|Array}
 */
alibaba.getSellerId = function () {
    var seller_id = '';
    return seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
alibaba.getItem = function (_fn_select_specific) {
    if ($("button#J-btn-order").length == 0) {
        console.log("Sản phẩm này không thể mua.");
        return false;
    }
    var item = {};
    item.type = "alibaba";
    item.item_id = alibaba.getId();
    item.item_price = alibaba.getPrice();
    item.item_image = alibaba.getImage();
    item.seller_name = alibaba.getSellerName();
    item.seller_id = alibaba.getSellerId();
    item.quantity = alibaba.getQuantity();
    item.color_size = "";
    item.data_value = "";
    item.item_link = window.location.href;

    //Get color and size
    var color_size = '';
    var data_value = '';

    var __subs = $("div#skuWrap > dl");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            color_size += ";" + $(_element).find("dt.name").attr("title") + ":";
            data_value += ";" + $(_element).find("dt.name").attr("title") + ":";
            if ($(_element).find("input").length == 0) {
                //selected size
                $(_element).find("dd > span").each(function () {
                    if ($(this).attr("class").indexOf("current-sku-attr-val") != -1) {
                        color_size += $(this).text().trim();
                        data_value += $(this).attr("data-id");
                        return false;
                    }
                });
            } else {
                //Chọn màu/ảnh có chứa quantity
                var flag = false;
                $(_element).find("dd > div.sku-attr-val-item").each(function () {
                    if ($(this).find("input[data-role=wholesale-order-quantity]").val() > 0) {
                        flag = true;
                        color_size += $(this).find("span.sku-attr-val-frame").attr("title");
                        data_value += $(this).attr("data-id");
                        item.quantity = $(this).find("input[data-role=wholesale-order-quantity]").val();
                        $(this).find("input[data-role=wholesale-order-quantity]").val("0");
                        return false;
                    }
                });
                if (!flag) {
                    _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
                    return false;
                }
            }
        });
    }

    item.color_size = color_size;
    item.data_value = data_value;
    return item;
};
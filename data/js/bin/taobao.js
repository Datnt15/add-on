var taobao = {};

/**
 * Init load
 * @returns {undefined}
 */
taobao.init = function () {
    return {
        element: {
            node: '#J_Title',
            insert: "after"
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana ! important; } #addon_body{width:auto !important;} #txtBz{width:100% !important}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {taobao.getId.taobaoAnonym$1}
 */
taobao.getId = function () {
    var id = document.querySelectorAll('input[name="item_id"]')[0].value;
    return typeof id == 'undefined' ? null : id;
};

taobao.getCurrency = function () {
    return "CNY";
};

taobao.getQuantity = function () {
    var quantity = '';
    var element = document.getElementById("J_IptAmount");
    if (element) {
        quantity = element.value;
    }
    if (quantity == '') {
        try {
            quantity = document.getElementsByClassName('mui-amount-input')[0].value;
        } catch (e) {
            console.log(e);
        }
    }
    return quantity == '' ? 1 : quantity;
};

taobao.getImage = function () {
    var img_src = "";
    try {
        var img_obj = document.getElementById('J_ImgBooth');
        if (img_obj != null) { // Image taobao and t
            img_src = img_obj.getAttribute("src");
            return img_src;
        }

        var img_obj = document.getElementById('J_ThumbView');
        if (img_obj != null) { // Image taobao and t
            img_src = img_obj.getAttribute("src");
            return img_src;
        }

        img_src = document.getElementById('J_ImgBooth').getAttribute("src");
    } catch (e) {
        console.log("Không tìm được ảnh" + e);
    }
    return img_src;
};

taobao.getTitle = function () {
    var tb = "";
    tb = document.querySelectorAll('meta[property="og:title"]')[0].content;
    if (tb == 'undefined' || tb == null || tb == '') {
        tb = $('h3.tb-main-title').text().trim();
    }
    return tb;
};

taobao.getPrice = function () {

    var normal_price = document.getElementById('J_StrPrice');
    if (normal_price == null) {
        normal_price = document.getElementById('J_StrPriceModBox');
    }
    if (normal_price == null) {
        normal_price = document.getElementById('J_priceStd');
    }
    var promotion_price = document.getElementById('J_PromoPrice');
    if (promotion_price == null) {
        promotion_price = document.getElementById('J_SPrice');
    }

    // NEW
    var price = 0;
    if (promotion_price != null) { // Promotion price

        if (promotion_price.getElementsByClassName('tb-rmb-num').length > 0) {
            try {
                price = promotion_price.getElementsByClassName('tb-rmb-num')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
            } catch (e) {
                price = promotion_price.getElementsByClassName('tm-price')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
            }
        } else {
            // VIP - sau khi chon thuoc tinh (size, color) xay ra truong hop object bi thay doi
            if (promotion_price.getElementsByClassName('tb-vip-notice').length > 0) {
                price = promotion_price.getElementsByClassName('tb-vip-notice')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
            }
            // 12/12/2013
            if (promotion_price.className == 'tb-rmb-num') {
                if (promotion_price.getElementsByClassName('tb-promo-price-type').length > 0) {
                    if ((price == 0 || price == null) & document.getElementsByClassName('tb-rmb-num').length > 0) {
                        price = document.getElementsByClassName('tb-rmb-num')[0].innerHTML.match(/[0-9]*[\.,]?[0-9]+/g);
                    }
                } else {
                    if (promotion_price.getElementsByClassName('tb-vip-notice').length > 0) {
                        price = null;
                    }
                    else {
                        price = promotion_price.innerHTML.match(/[0-9]*[\.,]?[0-9]+/g);
                        console.log('Giá '+price);
                    }
                }
            }
        }

        price = taobao.processPrice(price);

        if (price == 0) { // Try if price not found
            price = normal_price.getElementsByClassName('tm-price');

            if (price.length > 0) {
                price = price[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
            } else {

                price = normal_price.getElementsByClassName('tb-rmb-num');
                if (price.length > 0) {
                    price = price[0].innerHTML.match(/[0-9]*[\.,]?[0-9]+/g);
                }

            }

            price = taobao.processPrice(price);
        }
    } else {

        try {
            price = normal_price.getElementsByClassName('tb-rmb-num')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);

        } catch (e) {
            price = normal_price.getElementsByClassName('tm-price')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);

        }
        price = taobao.processPrice(price);
    }
    return price;
    // END NEW
};

taobao.processPrice = function (price) {
    if (price == null)
        return 0;

    var p = String(price).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
    return parseFloat(p);
};

taobao.getSellerName = function ()
{
    var seller_name = '';
    var shop_card = document.getElementsByClassName('tb-seller-info');
    if (shop_card.length > 0) {
        var data_nick = shop_card[0].getElementsByClassName('ww-light');
        if (data_nick.length == 0) {
            var data_nick = shop_card[0].getElementsByClassName('J_WangWang');
        }

        seller_name = (data_nick.length > 0 ? data_nick[0].getAttribute('data-nick') : '');

        if (seller_name)
            return seller_name;
    }




    if (document.getElementsByClassName('seller-name').length > 0) {
        seller_name = document.getElementsByClassName('seller-name')[0].innerHTML;
        if (seller_name.indexOf('掌柜') > -1) {
            seller_name = seller_name.replace('掌柜', '').substr(1);
        }
    } else {
        var shop_card = document.getElementsByClassName('shop-card');
        if (shop_card.length > 0) {
            var data_nick = shop_card[0].getElementsByClassName('ww-light');
            seller_name = data_nick[0].getAttribute('data-nick');
        }
        else if (document.getElementsByClassName('tb-shop-seller').length > 0) {

            var element = document.getElementsByClassName("tb-shop-seller");
            if (element.length > 0) {
                element = element[0];
                seller_name = element.getElementsByTagName('a')[0].innerHTML;
                //console.log("se "+seller_id);
            }
        }
    }

    if (seller_name == '') {
        var seller_data = document.getElementById('side-shop-info');
        if (seller_data != null) {
            seller_name = seller_data.getElementsByClassName('shopLink');
            if (seller_name.length > 0) {
                seller_name = seller_name[0].innerHTML;
            }
        }
    }
    if (seller_name == '') {
        var seller_data = document.getElementById('J_TSignBoard');
        if (seller_data != null) {
            seller_name = seller_data.getElementsByClassName('J_TGoldlog');
            if (seller_name.length > 0) {
                seller_name = seller_name[0].innerHTML;
            }
        }
    }
    if (seller_name == '') {
        // Find base info
        if (document.getElementsByClassName('base-info').length > 0) {
            for (var i = 0; i < document.getElementsByClassName('base-info').length; i++) {
                if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller').length > 0) {
                    if (document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang').length > 0) {
                        seller_name = document.getElementsByClassName('base-info')[i].getElementsByClassName('seller')[0].getElementsByClassName('J_WangWang')[0].getAttribute('data-nick');
                        break;
                    }
                }
            }
        }
    }
    return seller_name.trim();
};

/**
 *
 * @returns {String|Array}
 */
taobao.getSellerId = function () {
    var seller_id = '';
    try {
      if(!taobao.isLocal()){
        var pathname = $("#J_listBuyerOnView").attr("data-api");
        var re = /\&seller_num_id=(.+)\&totalSQ/i;
        seller_id = re.exec(pathname);
        return (seller_id == null || seller_id.length == 0) ? "" : seller_id[1];
      } else {
        seller_id = $("#J_Pine").attr("data-sellerid");
      }
    } catch (e) {
        console.log('Không lấy được thông tin người bán!');
    }

    return seller_id;
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
taobao.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "taobao";
    item.item_id = taobao.getId();
    item.item_price = taobao.getPrice();

    item.item_image = taobao.getImage();
    item.seller_name = taobao.getSellerName();
    item.seller_id = taobao.getSellerId();
    item.quantity = taobao.getQuantity();
    item.item_color_size = "";
    item.item_data_value = "";

    item.item_link = window.location.href;
    item.item_url = window.location.href;

    item.item_title = taobao.getTitle();
	  item.item_name = taobao.getTitle();

    item.shipcharge = taobao.getDeliveryFee();

    //Get color and size
    var selected_props = document.getElementsByClassName('tb-selected');
    var max_p = 0;
    var color_size = '';
    var data_value = '';
    if (selected_props.length > 0) {
        for (var i = 0; i < selected_props.length; i++) {
            var ele = selected_props[i];
            var eleP = ele.parentNode;
            var pro_name = eleP.getAttribute("data-property");
            var prop_str = ele.getAttribute("data-value");
            if (!prop_str) {
                var selectedA = ele.getElementsByTagName('a');
                if (selectedA)
                    prop_str = selectedA[0].getAttribute("title");
            }
            if (prop_str != null && prop_str.length > 0) {
                max_p++;
                data_value += " | " + prop_str;

                var p_e = ele.getElementsByTagName('span');
                if (p_e.length > 0) {
                    p_e = p_e[p_e.length - 1];
                    prop_str = p_e.textContent
                    color_size += " | " +  prop_str;
                } else {
                    p_e = ele.getElementsByTagName('i');
                    if (p_e.length > 0) {
                        p_e = p_e[0].parentNode;
                        prop_str = p_e.textContent
                        color_size += " | " +  prop_str;
                    }
                }

            } else
                continue;
        }

        var props = document.getElementsByClassName('J_TSaleProp');
        if (props.length == 0) {
            var J_SKU = document.getElementById('J_SKU');
            if (J_SKU)
                props = J_SKU.getElementsByTagName('dl');
        }

        var full = true;
        if (props.length > 0) {
            //kiem tra so thuoc tinh da chon cua sp
            var count_selected = 0;
            for (var i = 0; i < props.length; i++)
            {
                var selected_props = props[i].getElementsByClassName('tb-selected');
                if (selected_props != null && selected_props != 'undefined')
                    count_selected += selected_props.length;
            }
            if (count_selected < props.length)
            {
                full = false;
            }

        }

        if (_fn_select_specific && !full) {
            _fn_select_specific("Bạn chưa chọn đầy đủ thuộc tính sản phẩm");
            return false;
        }
    }

    if(color_size && color_size.length > 3){
      color_size = color_size.substring(3);
    }

    if(data_value && data_value.length > 3){
      data_value = data_value.substring(3);
    }

    item.item_color_size = color_size;
    item.item_data_value = data_value;
    return item;
};

taobao.getTranslateElements = function(){
    var result = [];

    var addToResult = function(elem){
        if(elem && elem.html()){
            elem.origin = elem.html().trim();
            result.push(elem);
        }
    }

    addToResult($('#J_btn_submitBuy>span'));
    addToResult($('#J_btn_addToCart>span'));


    $("#detail span.tb-property").each(function(i){
        addToResult($(this));
    });

    $("#detail .tb-property-type").each(function(i){
        addToResult($(this));
    });

    $("#detail .shop-info dl dt").each(function(i){
        addToResult($(this));
    });


    addToResult($('#J_isSku dl > dt'));

    //item.taobao
    var btnBuy = $('#J_juValid .tb-btn-buy > a');
    btnBuy.html(btnBuy.attr("shortcut-label"));
    addToResult(btnBuy);

    var btnAddToCart = $('#J_juValid .tb-btn-add > a');
    btnAddToCart.html(btnAddToCart.attr("shortcut-label"));
    addToResult(btnAddToCart);

    $("#J_ShopInfo .tb-shop-info-wrap dl dt").each(function(i){
        addToResult($(this));
    });

    return result;
}


taobao.deliveryFee = '';

taobao.getDeliveryFee = function(){
    var result = '';
    result = $("#J_WlServiceTitle").text().trim();
    var p = result.indexOf("¥");
    if(p>=0){
      result = result.substring(p + 1).trim();
    }
    else{
      result = 0;
    }
    return result;
}

taobao.setWarehouse = function(){
  $("#J_WlAddressInfo").click();
  setTimeout(function(){
    $("#J-AddressAllCon .J-WlListItem[data-id=450000]").click();
    setTimeout(function(){
      $("#J-AddressAllCon .J-WlListItem[data-id=451400]").click();
      setTimeout(function(){
        $("#J-AddressAllCon .J-WlListItem[data-id=451481]").click();
        /*setTimeout(function(){
            console.log("Delivery Fee =" + taobao.getDeliveryFee());
        },1000);*/
      },500);
    },500);
  },500);
}

taobao.isLocal = function(){
  return window.location.host.startsWith('item');
}

taobao.useGoogleTranslate = function(){
  return $("html").hasClass("translated-ltr");
}

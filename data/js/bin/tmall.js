 tmall = {};

/**
 * Init load
 * @returns {undefined}
 */
tmall.init = function () {
    return {
        element: {
            node: 'div.tb-detail-hd > h1',
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
 * @returns {tmall.getId.tmallAnonym$1}
 */
tmall.getId = function () {
    var pathname = window.location.pathname;
    var re = /item\/(.+)\.htm/i;
    var id = re.exec(pathname);
    id = (id == null || id.length == 0) ? null : id[1];
    if (typeof id == 'undefined' || id == null) {
        id = $("div#LineZing").attr("itemid");
    }
    return id;
};

tmall.getCurrency = function () {
    return "CNY";
};

tmall.getQuantity = function () {
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

tmall.getImage = function () {
    var img_src = $('img#J_ImgBooth').attr("src");
    return img_src;
};

tmall.getTitle = function () {
    var tb = $('div.tb-detail-hd > h1').text().trim();
    return tb;
};

tmall.getPrice = function () {
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
        if (promotion_price.getElementsByClassName('tm-price').length > 0) {
            price = promotion_price.getElementsByClassName('tm-price')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);
        }
        price = tmall.processPrice(price);

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

            price = tmall.processPrice(price);
        }
    } else {
        try {
            price = normal_price.getElementsByClassName('tm-price')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);

        } catch (e) {
            price = normal_price.getElementsByClassName('tb-rmb-num')[0].textContent.match(/[0-9]*[\.,]?[0-9]+/g);

        }
        price = tmall.processPrice(price);
    }
    return price;
    // END NEW
};

tmall.processPrice = function (price) {
    if (price == null)
        return 0;

    var p = String(price).replace(',', '.').match(/[0-9]*[\.]?[0-9]+/g);
    return parseFloat(p);
};

tmall.getSellerName = function ()
{
    var seller_name = '';
    /*var shop_card = document.getElementsByClassName('tb-seller-info');
    if (shop_card.length > 0) {
        var data_nick = shop_card[0].getElementsByClassName('ww-light');
        if (data_nick.length == 0) {
            var data_nick = shop_card[0].getElementsByClassName('J_WangWang');
        }

        seller_name = (data_nick.length > 0 ? data_nick[0].getAttribute('data-nick') : '');

        if (seller_name)
            return seller_name.trim();
    }

    if (document.getElementsByClassName('slogo').length > 0) { // Page detail of shop
        if (document.getElementsByClassName('slogo-shopname').length > 0) {
            seller_name = document.getElementsByClassName('slogo-shopname')[0].innerHTML;
        } else if (document.getElementsByClassName('flagship-icon').length > 0) {
            seller_name = document.getElementsByClassName('slogo')[0].getElementsByTagName('span')[1].getAttribute('data-tnick');
        } else {
            seller_name = document.getElementsByClassName('slogo')[0].getElementsByTagName('span')[0].getAttribute('data-tnick');
        }
    } else { // Page detail of general
        if (document.getElementsByClassName('bts-extend').length > 0) {
            try {
                seller_name = document.getElementsByClassName('bts-extend')[0].getElementsByTagName('li')[1].getElementsByTagName('span')[0].getAttribute('data-tnick');
            } catch (e) {
                console.log('Seller name not found!');
            }
        }
    }*/

    seller_name = $("input[name=seller_nickname]").val();
    seller_name = decodeURIComponent(seller_name);
    console.log(seller_name);

    return seller_name.trim();
};

/**
 *
 * @returns {String|Array}
 */
tmall.getSellerId = function () {
    var seller_id = $("input[name=seller_id]").val();
    return typeof seller_id == 'undefined' ? "" : seller_id;
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
tmall.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "tmall";
    item.item_id = tmall.getId();
    item.item_price = tmall.getPrice();

    item.item_image = tmall.getImage();
    item.seller_name = tmall.getSellerName();
    item.seller_id = tmall.getSellerId();
    item.quantity = tmall.getQuantity();
    item.item_color_size = "";
    item.item_data_value = "";
    item.item_link = window.location.href;
    item.item_url = window.location.href;

    item.item_title = tmall.getTitle();
    item.item_name = tmall.getTitle();
    item.shipcharge = tmall.getDeliveryFee();

    //Get color and size
    var selected_props = document.getElementsByClassName('tb-selected');
    var max_p = 0;
    var color_size = '';
    var data_value = '';

    if (selected_props.length > 0) {
        for (var i = 0; i < selected_props.length; i++) {
            var ele = selected_props[i];
            var prop_str = ele.getAttribute("data-value");
            if (!prop_str) {
                var selectedA = ele.getElementsByTagName('a');
                if (selectedA)
                    prop_str = selectedA[0].getAttribute("title");
            }
            if (prop_str != null && prop_str.length > 0) {
                max_p++;

                data_value += ' | ' + prop_str;

                var p_e = ele.getElementsByTagName('span');
                if (p_e.length > 0) {
                    p_e = p_e[p_e.length - 1];
                    prop_str = p_e.textContent
                    color_size += ' | ' + prop_str;
                } else {
                    p_e = ele.getElementsByTagName('i');
                    if (p_e.length > 0) {
                        p_e = p_e[0].parentNode;
                        prop_str = p_e.textContent
                        color_size += ' | ' + prop_str;
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

tmall.getTranslateElements = function(){
    var result = [];

    var addToResult = function(elem){
        if(elem && elem.html()){
            elem.origin = elem.html().trim();
            result.push(elem);
        }
    }

    addToResult($('div.tb-detail-hd > h1 > a'));
    $("#detail .tb-metatit").each(function(i){
        addToResult($(this));
    });
    $("#detail .tm-label").each(function(i){
        addToResult($(this));
    });

    //detail.tmall
    //addToResult($('div.tb-detail-hd > h1'));

    return result;
}

tmall.warehouseSetted = false;
tmall.deliveryFee = '';

tmall.getDeliveryFee = function(){
    var result = '';
    result = $("#J_PostageToggleCont span").text().trim();

    var p = result.indexOf(":");
    if(p>=0){
      result = result.substring(p + 1).trim();
    }
    else{
      result = 0;
    }

    return result;
}

tmall.setWarehouse =function(){
  $(document).on("DOMNodeInserted", function(e){
    if ($(e.target).is('.mui_addr_dialog_one')) {
      $(e.target).on("DOMNodeInserted", function(e1){
        if(!tmall.warehouseSetted){
          $("a[code='450000']")[0].click();
          setTimeout(function(){
            $("a[code='451400']")[0].click();
            tmall.warehouseSetted = true;
            /*setTimeout(function(){
                tmall.deliveryFee = tmall.getDeliveryFee();
                console.log("deliveryFee = " + tmall.deliveryFee);
            },1000);*/
          },500);
        }
      });
     }
  });

  $("#J_AddrSelectTrigger>span").click();

}

tmall.isLocal = function(){
  return window.location.host.startsWith('item');
}

tmall.useGoogleTranslate = function(){
  return $("html").hasClass("translated-ltr");
}

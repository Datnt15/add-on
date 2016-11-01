var web1688 = {};

/**
 * Init load
 * @returns {undefined}
 */
web1688.init = function () {
    return {
        element: {
            node: '#mod-detail-price, .mod-detail-info-price, .mod-detail-daixiao-price',
            insert: "prepend",
            html_before: ''
        },
        options: {
            boxComment: true,
            css: ".tahoma { font-family: tahoma,arial,verdana ! important; } #addon_body{width:auto !important;} #txtBz{width:100% !important}"
        }
    };
};

/**
 * Id sản phẩm
 * @returns {web1688.getId.web1688Anonym$1}
 */
web1688.getId = function () {
    var pathname = window.location.pathname;
    var re = /offer\/(.+)\.html/i;
    var id = re.exec(pathname);
    return (id == null || id.length == 0) ? null : id[1];
};

web1688.getCurrency = function () {
    return "CNY";
};

web1688.getQuantity = function () {
    var quantity = '';
    var qElement = $("#J_DetailInside input.amount-input");
    if (typeof qElement != 'undefined') {
        //Có subitem
        quantity = $(qElement).val();
        //set lại giá trị
//        $(qElement).val(0);
    } else {
        //Không tìm thấy quantity
        quantity = 1;
    }
    return quantity == '' || quantity <= 0 ? 1 : quantity;
};

web1688.getImage = function () {
    var img_src = $('meta[property="og:image"]').attr("content");
    return img_src;
};

web1688.getTitle = function () {
    var tb = $('meta[property="og:title"]').attr("content");
    if(!tb || tb.length <=0){
        tb = $("h1.d-title").text();
    }
    return tb;
};

web1688.getPrice = function () {

    function getDaiXiaoPrice(){
      var elemDaixaoPrice = $(".mod-detail-daixiao-price .obj-content.row1 span.value");
      if(elemDaixaoPrice){
        return elemDaixaoPrice.html();
      }

      return 0;
    }

    var price = getDaiXiaoPrice();

    if(price > 0){
      return price;
    }

    var boxElement = $("#J_DetailInside div#mod-detail-price  tr.price");
    //    console.log(boxElement.length);
    if (typeof boxElement != 'undefined' && boxElement.length > 0) {
        //http://detail.1688.com/offer/520230487922.html?spm=b26110225.6810069.1998892221.10.Dyrq0F
        //http://detail.1688.com/offer/343597975.html?spm=b26110225.6810069.1998892221.4.Dyrq0F
        price = $(boxElement).find(".value");
        if (typeof price != 'undefined' && price.length == 1) {
            price = String($(price).text().trim().match(/[0-9]*[\.,]?[0-9]+/g));
        } else if (typeof price != 'undefined' && price.length >= 1) {
            var quantity = Number(web1688.getQuantity());
            var flag = false;
            $.each($(price), function () {
                try {
                    var d_ranger = JSON.parse($(this).parent("td").attr("data-range"));
                    if (d_ranger.end == "") {
                        d_ranger.end = 99999999;
                    }
                    if (quantity >= Number(d_ranger.begin) && quantity <= Number(d_ranger.end)) {
                        price = d_ranger.price;
                        flag = true;
                        return false;
                    }
                } catch (e) {
                    price = String($(price[0]).text().trim().match(/[0-9]*[\.,]?[0-9]+/g))
                    flag = true;
                    return false;
                }
            });
            if (!flag) {
                var d_ranger = JSON.parse($(price[0]).parent("td").attr("data-range"));
                price = d_ranger.price;
            }
        } else {
            price = $(boxElement).find("div.price-original-sku  span.value");
            if (typeof price != 'undefined' && price.length > 0) {
                price = String($(price).text().trim().match(/[0-9]*[\.,]?[0-9]+/g));
            } else {
                console.log("HTML về giá có sự thay đổi.");
            }
        }

    } else {
        //http://detail.1688.com/offer/521340428602.html?spm=a26e3.7672103.1998456380.6.5DF0XX - Có chọn option
        boxElement = $("#mod-detail span.price-now");
        if (typeof boxElement != 'undefined' && boxElement.length > 0) {
            price = String($(boxElement).text().trim().match(/[0-9]*[\.,]?[0-9]+/g));
        } else {
            console.log("HTML về giá có sự thay đổi");
        }
    }
    return price == '' ? 1 : price;
};

web1688.getPriceTable = function () {
    var result = "";

    if($("#mod-detail-price")){
        var priceValues =[];
        var amountValues = [];
        $("#mod-detail-price .price .value").each(function(i,e){
            priceValues.push($(this).text());
        });
        $("#mod-detail-price .amount .value").each(function(i,e){
            amountValues.push($(this).text());
        });

        var sep = "";
        for(var i =0; i<priceValues.length; i++){
            result += sep + amountValues[i] + ":" + priceValues[i];
            sep = ";";
        };
    }


    return result;
};

web1688.getSellerName = function () {
    var seller_name = $("div.contactSeller > span.disc > a");
    if (typeof seller_name != 'undefined') {
        seller_name = $(seller_name).text().trim();
    }
    return (typeof seller_name == 'undefined' || seller_name == null || seller_name == "") ? "" : seller_name.trim();
};

/**
 *
 * @returns {String|Array}
 */
web1688.getSellerId = function () {
    var seller_id = $("div.mod-detail-gallery").attr("data-mod-config");
    if (typeof seller_id != 'undefined' && seller_id != "") {
        seller_id = JSON.parse(seller_id);
        seller_id = seller_id.userId;
    }
    return (typeof seller_id == 'undefined' || seller_id == null || seller_id == "") ? "" : seller_id.trim();
};

/**
 * Thông tin sản phẩm
 * @returns {unresolved}
 */
web1688.getItem = function (_fn_select_specific) {
    var item = {};
    item.type = "web1688";
    item.item_id = web1688.getId();
    item.item_price = web1688.getPrice();
    item.item_price_table = web1688.getPriceTable();

    item.item_image = web1688.getImage();
    item.seller_name = web1688.getSellerName();
    item.seller_id = web1688.getSellerId();
    item.quantity = web1688.getQuantity();
    item.item_color_size = "";
    item.item_data_value = "";

    item.item_link = window.location.href;
    item.item_url = window.location.href;

    item.item_title = web1688.getTitle();
    item.item_name = web1688.getTitle();

    item.shipcharge = web1688.getDeliveryFee();

    //Get color and size
    var color_size = '';
    var data_value = '';

    var __subs = $("#J_DetailInside div.d-content > div");
    //Kiểm tra số lượng thuộc tính > 0
    if (typeof __subs != 'undefined' && __subs.length > 0) {
        var flag = true;
        //Lặp qua danh sách thuộc tính
        __subs.each(function () {
            var _element = this;
            var keyword, value, vElement;
            keyword = $(_element).find("div.obj-header > span.obj-title").text();
            if (typeof keyword != 'undefined' && keyword != null && keyword != "") {
                vElement = $(_element).find("div.obj-content > ul.list-leading");
                if (typeof vElement != 'undefined' && vElement.length > 0) {
                    $(vElement).find("li a").each(function () {
                        var aElement = this;
                        if ($(aElement).attr("class").indexOf("selected") > -1) {
                            value = $(aElement).attr("title");
                            if (typeof keyword != 'undefined' && typeof value != 'undefined') {
                                color_size += ' | ' + value;
                            }
                        }
                    });
                } else {
                    //List cho select quantity
                    vElement = $(_element).find("div.obj-content  table.table-sku  tr");
                    if (typeof vElement != 'undefined' && vElement.length > 0) {
                        item.quantity = 0;
                        flag = false;
                        $(vElement).each(function () {
                            var trElement = this;
                            var _sSpecific = {};
                            _sSpecific.keyword = keyword;
                            _sSpecific.quantity = $(trElement).find("td.amount input.amount-input").val();
                            _sSpecific.price = String($(trElement).find("td.price .value").text().match(/[0-9]*[\.,]?[0-9]+/g));

                            _sSpecific.name = $(trElement).find("td.name").text().trim();
                            if(!_sSpecific.name ||_sSpecific.name.length <=0){
                              _sSpecific.name = $(trElement).find("td.name >span").attr("title").trim();
                            }
//                            console.log(_sSpecific);
                            //Kiểm tra quan tity
                            if (typeof _sSpecific.quantity != 'undefined' && !isNaN(_sSpecific.quantity) && Number(_sSpecific.quantity) > 0
                                    && typeof _sSpecific.price != 'undefined' && typeof _sSpecific.name != 'undefined') {
                                color_size += ' | ' + _sSpecific.name + "-SL:" + _sSpecific.quantity;
                                item.item_price = _sSpecific.price;
                                item.quantity += Number(_sSpecific.quantity);
                                flag = true;
//                                return false;
                            }
                        });
                    }
                }
            }
        });
        if (!flag) {
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

web1688.getTranslateElements = function(){
    var result = [];

    var addToResult = function(elem){
        if(elem && elem.html()){
            elem.origin = elem.html().trim();
            result.push(elem);
        }
    }

    //world
    /*addToResult($('div.tb-detail-hd > h1 > a'));
    $("#detail .tb-metatit").each(function(i){
        addToResult($(this));
    });
    $("#detail .tm-label").each(function(i){
        addToResult($(this));
    });*/

    //detail
    $('#mod-detail-price tr > td').each(function(i){
        addToResult($(this));
    });

    $('#mod-detail-bd .d-title').each(function(i){
        addToResult($(this));
    });

    $('#mod-detail-bd .obj-title').each(function(i){
        addToResult($(this));
    });

    return result;
}

web1688.warehouseSetted = false;
web1688.deliveryFee = '';

web1688.getDeliveryFee = function(){
    var result = '';
    $(".obj-carriage .unit-detail-freight-cost .cost-entries .cost-entries-type p").each(function(index, elem){
        result += " " + $(this).text();
    });
    result = result.trim();

    var p = result.indexOf("¥");
    if(p>=0){
      result = result.substring(p + 1).trim();
    }
    else{
      result = 0;
    }

    return result;
}

web1688.setWarehouse =function(){
  //open address selector window
  if($("#J_WlAddressInfo")){
    $("#J_WlAddressInfo").click();
  }
  if($(".area-list a[title='广西']")[0]){
    $(".area-list a[title='广西']")[0].click();
  }

  setTimeout(function(){
    if($(".area-sub-placeholder a[title='崇左']")[0]){
      $(".area-sub-placeholder a[title='崇左']")[0].click();
    }

    //close address selector window
    setTimeout(function(){
      if($("#J_WlAddressInfo")){
        $("#J_WlAddressInfo").click();
      }
        /*setTimeout(function(){
            web1688.deliveryFee = web1688.getDeliveryFee();
            console.log("deliveryFee = " + web1688.deliveryFee);
        }, 1000);*/
    },500);
  },500);

}

web1688.isLocal = function(){
  return window.location.host.startsWith('item');
}

web1688.useGoogleTranslate = function(){
  return $("html").hasClass("translated-ltr");
}

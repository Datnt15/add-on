var config = {};

config.browse = "chrome";

config.currency = {
    'USD': "$",
    'CNY': "¥",
    'CAD': "C",
    'GBP': "GBP",
};

config.rate = {
    'USD': "22500",
    'CNY': "3550",
    'CAD': "16485",
    'GBP': "31056",
};

config.domains = {
	"taobao.com": "taobao",
    "tmall.com": "tmall",
    "1688.com": "web1688",
    "jd.com": "jd",
    "amazon.cn": "amazoncn",
    "aliexpress.com": "aliexpress",
    "alibaba.com": "alibaba",
    "amazon.com": "amazoncom",
    "ebay.com": "ebaycom",
    "drugstore.com": "drugstore",
    "zappos.com": "zappos",
    "6pm.com": "sixpm",
    "wayfair.com": "wayfair",
    "bhphotovideo.com": "bhphotovideo",
    "forever21.com": "forever21",
    "toysrus.com": "toysrus",
    "gymboree.com": "gymboree",
    "childrensplace.com": "childrensplace",
    "perfume.com": "perfume",
    "fragrancenet.com": "fragrancenet",
    "victoriassecret.com": "victoriassecret",
};


config.service = {
    //Trang chủ website
    website: "http://nguyendangdungha.com/mymvc/",
    // View link Cart
    cartLink: "http://nguyendangdungha.com/mymvc/cart",
    // Popup
    pop: "http://nguyendangdungha.com/mymvc/cart/",
    http: {
        rate: "http://nguyendangdungha.com/mymvc/cart/add_product",
		addCart:"http://nguyendangdungha.com/mymvc/cart/add_product",
        viewCart: "http://nguyendangdungha.com/mymvc/cart",
        // calPrice: "http://nguyendangdungha.com/mymvc/api/Price.php?"
    },
    https: {
        rate: "http://nguyendangdungha.com/mymvc/cart/add_product",
        addCart:"http://nguyendangdungha.com/mymvc/cart/add_product",
        viewCart: "http://nguyendangdungha.com/mymvc/cart",
        // calPrice: "http://nguyendangdungha.com/mymvc/api/Price.php?"
    },
    translate: "https://www.googleapis.com/language/translate/v2?key=AIzaSyDQ9JhOpkWcbk5yrNsNWsbJGQgNzXgWg6s"
};

/**
 * Config ngôn ngữ
 * @type type
 */
config.language = {
    "尺码": "size",
    "套餐类型": "size",
    "颜色分类": "color"
};

config.dictionary = {
    '颜色' : 'Màu',
    '尺码' : 'Kích cỡ',
    '尺寸' : 'Kích cỡ',
    '价格' : 'Giá',
    '促销' : 'Khuyến mại',
    '配送' : 'Vận Chuyển',
    "物流" : "Vận chuyển",
    '数量' : 'Số Lượng',
    "起批量": "Từ SL",
    '销量' : 'Chính sách',
    '评价' : 'Đánh Giá',
    "成交\\评价": "Đánh giá",
    '颜色分类' : 'Màu sắc',
    '促销价' : 'Giá KM',
    '套餐类型' : 'Loại',
    '单价（元）' : 'Giá (NDT)',
    '库存量' : 'Tồn kho',
    '采购量' : 'SL mua',
    '材质保障' : "Chất lượng",
    '15天包换' : "15 đổi trả",
    '48小时发货' : "48 giờ giao hàng",
    '运费': "Phí VC",
    '运至': "Vận chuyển",
    '月销量': 'Đã bán',
    '累计评价': 'Đánh giá',
    '版本':'Cùng loại',
    '优惠':"Ưu đãi",
    '服务': "Dịch vụ",
    '信誉：': "Xếp hạng:",
    '掌柜：': "Người bán:",
    "联系：": "Liên hệ:",
    '资质：' : "Chứng chỉ:",
    '立即购买' : "Mua ngay",
    '加入购物车' : "Thêm vào giỏ",
    "淘宝价": "Giá Taobao"

}

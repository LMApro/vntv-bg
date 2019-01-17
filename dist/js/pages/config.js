

var socketLink = 'https://mobitrade.vpbs.com.vn:8080/';
var rootLink = 'https://mobitrade.vpbs.com.vn:8080/';
var psDetailLink = rootLink + 'getpsalldatalsnapshot/';
var psListLink = rootLink + 'pslistdata';
var indexDetailLink = rootLink + 'getlistindexdetail/10,02,11,03';
var listStockDetailLink = rootLink + 'getliststockdata/';
var historyIndicatorLink = rootLink + 'getchartindexdata/';
var listStockTradelink = rootLink + 'getliststocktrade/';
var listTopStockLink = rootLink + 'gettopstock/';
var stockBaseInfoLink = rootLink + 'getliststockbaseinfo/';
var dataPTKTLink = '/GetPTKT.do?symbol=';
var ps10pricesnapshotLink = rootLink + 'getps10pricesnapshot/';
var baseWorldIndex = rootLink + 'getlistbaseworldindex/';
var baseComondityIndex = rootLink + 'getlistbasecommondity/';
var listThoaThuanLink = rootLink + 'getlistpt';
var feedbackLink = rootLink + 'postcustomerfeedback';
var fbClientLink = rootLink + 'loginfbclient';
var fbClientUpdateLink = rootLink + 'updateinfofbclient';
var fbClientUpdateDetailLink = rootLink + 'updatedetailfbclient';
var getTopNews = rootLink + 'gettopnews/';
var getFinalQuaterLink = rootLink + 'getfinalquarter/';
var getFinalAssetQuaterLink = rootLink + 'getfinalassetquarter/';
var getListCKIndex = rootLink + 'getlistckindex/';
var getDiffTime = rootLink + 'gettimedifference';

var getAllListStock = rootLink + 'getlistallstock';
var getListStockChange = rootLink + 'getliststocktrade/';

var urlCore = '/handler/core.vpbs';
var objUser = new Object();
var global = {user:"",sid:"", accounts:null};

var vStockListSelected = '';
var dsHNXIndex = '';
var dsHSXIndex = '';
var dsUpcomIndex = '';

var vStockPs;
var bYear = 0;
var bMonth = 0;
var bDay = 0;
var eYear = 0;
var eMonth = 0;
var eDay = 0;
var bHour = 9;
var b90Min = 0;
var b91Min = 15;
var eHour = 15;
var eMin = 00;
var iUnit = 10;
var loadStart = 0;
var recoCount = 0;

var timeReloadChart = 10; // phút
var timer;
let serverTime = 0;

var faceId;

var gdVNI = 0;
var gdHNX = 0;
var gtTTVal = 0;

var objTheme;
var socket;
var objPage;
var symbol10Gia;
var settingUI;
var objOIndex = new Object();
var objLang;

var modal = { listIndex: [] };

var MARKET = {
    HSX: "10",
    HSX30: "11",
    HNX: "02",
    HNX30: "12",
    UPCOM: "03"
};

var ColumnHeaderName = {
    'total-volumn': 'Tổng KL',
    'dumua': 'Dư mua',
    'duban': 'Dư bán',
    'ave': 'TB',
    'hight': 'Cao',
    'low': 'Thấp',
    'quote': 'ĐTNN',
    'rsi': 'RSI(14)',
    'macd': 'MACD',
    'froom': 'Room NN'
}

var ChartHeaderName = {
    'VNIndex': 'VN-INDEX',
    'HNXIndex': 'HNX-INDEX',
    'UPCOMIndex': 'UPCOM-INDEX',
    'VN30Index': 'VN30-INDEX',
    'HNX30Index': 'HNX30-INDEX'
}

var allColumn = ['total-volumn', 'dumua', 'duban', 'ave', 'hight', 'low', 'quote', 'rsi', 'macd', 'froom'];
var allChart = ['VNIndex', 'HNXIndex', 'UPCOMIndex', 'VN30Index'];

var keysCheckSum = ['price', 'side', 'volume', 'account', 'symbol', 'refId'];

var allTxtLangCol = ["txtCoDien", "txtHienDai", "txtDatLenh", "txtTG", "txtCD", "txtTotalTT", "txtTotalCS", "txtDTNN", "txtDTNNMua", "txtDTNNBan", "txtMaCK",
"txtThamChieu", "txtTran", "txtSan", "txtBenMua", "txtKhopLenh", "txtBenBan", "txtGia", "txtKhoiLuong", "txtDTNN", "txtDTNNMua", "txtDTNNBan", "txttotal-volumn",
"txtCoSo", "txtThoiGian", "txtGiaTri", "txtave", "txtlow", "txthight", "txtdumua", "txtduban", "txtDiemGioiHan", "txtName", "txtChiBaoKyThuat", "txtAction", 
"txtTrungBinhDong", "txtDiem", "txtDonGian", "txtLuyThua", "txtTongKet", "txtTheoGio", "txtTheoNgay", "txtKyThuat", "txtTaiChinh", "txtBieuDo", "txtTongQuan",
"txtHangNam", "txtHangQuy", "txtLSKL", "txtGiaMoCua", "txtGiaCaoNhat", "txtGiaThapNhat", "txtKLGD", "txtVonHoa", "txtBienDo52", "txtNNMua", "txtNNSoHuuPer", 
"txtCoTucTM", "txtDonViTD", "txtGopY", "txtTieuDe", "txtNoiDung", "txtBtnSendGoY", "txtColumnShow", "txtColumnNotShow", "txtAddNewStockLabel", "txtEndTable",
"txtTopTable", "txttotal-open", "txtfroom", "txtTotalKLGD", "txtTotalGTGD", "txtKLMuaBan", "txtGTMuaBan", "txtGiaKhop", "txtKLMua", "txtKLBan", "txtTopKLMuaBanNN",
"txtTopKLGGNgay", "txtValueBuySellForeign", "txtThongKe", "txtTuoiSang", "txtTy", "txtChartShow", "txtChartNotShow", "txtThem", "txtDanhMuc"];

var indexChart_HSX;
var data_HSX = {"open":0,"series":[],"volume":[]};
var indexChart_VN30;
var data_VN30 = {"open":0,"series":[],"volume":[]};
var indexChart_HNX;
var data_HNX = {"open":0,"series":[],"volume":[]};
var indexChart_HNX30;
var data_HNX30 = {"open":0,"series":[],"volume":[]};
var indexChart_UPCOM;
var data_UPCOM = {"open":0,"series":[],"volume":[]};
var stockChart1;
var stockChart2;
var stockChart3;
var stockChart4;
var stockChart5;

var GStockData = [];
var G2StockData = [];
var G3StockData = [];
var G4StockData = [];
var G5StockData = [];
var G6StockData = [];

var GStockVolume = [];
var G2StockVolume = [];
var G3StockVolume = [];
var G4StockVolume = [];
var G5StockVolume = [];
var G6StockVolume = [];

var G2Xcate = [];
var G3Xcate = [];
var G4Xcate = [];
var G5Xcate = [];
var G6Xcate = [];
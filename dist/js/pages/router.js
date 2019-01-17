
// colection
(function () {

	window.App = {
		Router: {}
	};

	App.Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'DanhSachTheoDoi': 'danhsachtheodoi',
			'PhaiSinh': 'phaisinh',
			'ThoaThuan': 'thoathuan',
			'ThongKe': 'thongke',
			'HOSE': 'hose',
			'HNX': 'hnx',
			'UPCOM': 'upcom',
			'ShareDanhMuc/(:id)': 'sharedanhmuc',
			'*other': 'index'
		},

		index: function () {
			//home
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá niêm yết", "templates/coso/coso.html", objParam);
			$('.tab-left .tab a[href="#DanhSachTheoDoi"]').addClass('active');

			// $('.tab-left').children('div').eq(0).css('display', '');
			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		danhsachtheodoi: function () {
			//cơ sở
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá niêm yết", "templates/coso/coso.html", objParam);
			$('.tab-left .tab a[href="#DanhSachTheoDoi"]').addClass('active');

			// $('.tab-left').children('div').eq(0).css('display', '');
			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		hose: function () {
			//hose
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá HOSE", "templates/hsx/hsx.html", objParam);
			$('.tab-left .tab a[href="#HOSE"]').addClass('active');

			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		hnx: function () {
			//hnx
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá HNX", "templates/hnx/hnx.html", objParam);
			$('.tab-left .tab a[href="#HNX"]').addClass('active');

			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		upcom: function () {
			//upcom
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá UPCOM", "templates/upcom/upcom.html", objParam);
			$('.tab-left .tab a[href="#UPCOM"]').addClass('active');

			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		phaisinh: function () {
			//phái sinh
			var objParam = new Object();
			loadPage(".main", "VPBS - Bảng giá phái sinh", "templates/phaisinh/phaisinh.html", objParam);
			$('.tab-left .tab a[href="#PhaiSinh"]').addClass('active');

			// $('.tab-left').children('div').eq(0).css('display', 'none');
			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', 'none');
		},

		thoathuan: function () {
			//thỏa thuận
			var objParam = new Object();
			loadPage(".main", "VPBS - Giao dịch thỏa thuận", "templates/thoathuan/thoathuan.html", objParam);
			$('.tab-left .tab a[href="#ThoaThuan"]').addClass('active');

			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', 'none');
		},

		thongke: function () {
			//thống kê
			var objParam = new Object();
			loadPage(".main", "VPBS - Thống kê", "templates/thongke/thongke.html", objParam);
			$('.tab-left .tab a[href="#ThongKe"]').addClass('active');
		},

		sharedanhmuc: function(id){
			// console.log(id);
			var objParam = new Object();
			objParam.shareCode = id;

			loadPage(".main", "VPBS - Bảng giá niêm yết", "templates/coso/coso.html", objParam);
			$('.tab-left .tab a[href="#DanhSachTheoDoi"]').addClass('active');

			// $('.tab-left').children('div').eq(0).css('display', '');
			// $('.content-header').children('div').eq(1).children('div').eq(0).css('display', '');
		},

		default: function (other) {
			// default
		}

	});

	new App.Router;
	Backbone.history.start();

})();

function getCookie(sKey) {
	if (!sKey) { return null; }
	return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

function loadPage(id, title, pageName, objParam) {
	if (location.protocol != 'https:')
	{
		location.href = 'https://banggia.vpbs.com.vn';
	}
	if (loadStart == 0) {
		loadStart = 1;
		// load css, js theme
		settingUI = $.jStorage.get("SETTING_UI", {chartToggle: "1", theme:"b", addStockPosition: "1", lang:"vi", charts: ['VNIndex', 'HNXIndex', 'UPCOMIndex', 'VN30Index']});
		var nodeInsert = document.getElementsByTagName('script')[0];
		if(!settingUI.hasOwnProperty('theme')) settingUI.theme = 'b';
		if(!settingUI.hasOwnProperty('lang')) settingUI.lang = 'vi';
		if(!settingUI.hasOwnProperty('addStockPosition')) settingUI.addStockPosition = '1';
		if(!settingUI.hasOwnProperty('charts')) settingUI.charts = ['VNIndex', 'HNXIndex', 'UPCOMIndex', 'VN30Index'];
		$.ajaxSetup({ "async": false });
		if(settingUI.theme == 'm'){
			// load theme model

			$.get("dist/css/model.css", function (data) {
				// console.log(data);
				var script_tag = document.createElement('style');
				// script_tag.type = 'text/css';
				script_tag.id = 'model-css';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
				try{script_tag.innerHTML = data;}
				catch(error){style.styleSheet.cssText = data;}
			});
			$.get("dist/js/pages/theme/model.js", function (data) {
				// console.log(data);
				var script_tag = document.createElement('script');
				script_tag.type = 'text/javascript';
				script_tag.text = data;
				script_tag.id = 'model-js';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
			});
		} else if(settingUI.theme == 'b'){
			// load theme basic

			$.get("dist/css/basic.css", function (data) {
				// console.log(data);
				var script_tag = document.createElement('style');
				// script_tag.type = 'text/css';
				script_tag.id = 'basic-css';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
				try{script_tag.innerHTML = data;}
				catch(error){style.styleSheet.cssText = data;}
			});
			$.get("dist/js/pages/theme/basic.js", function (data) {
				// console.log(data);
				var script_tag = document.createElement('script');
				script_tag.type = 'text/javascript';
				script_tag.text = data;
				script_tag.id = 'basic-js';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
			});
		} else {
			// load theme color full

			$.get("dist/css/colorFull.css", function (data) {
				// console.log(data);
				var script_tag = document.createElement('style');
				// script_tag.type = 'text/css';
				script_tag.id = 'colorFull-css';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
				try{script_tag.innerHTML = data;}
				catch(error){style.styleSheet.cssText = data;}
			});
			$.get("dist/js/pages/theme/colorFull.js", function (data) {
				// console.log(data);
				var script_tag = document.createElement('script');
				script_tag.type = 'text/javascript';
				script_tag.text = data;
				script_tag.id = 'colorFull-js';
				nodeInsert.parentNode.insertBefore(script_tag, nodeInsert);
			});
		}

		// load language
		if (settingUI.lang == 'en') {
			$('.btn-toggle').click();
			$.getJSON("dist/js/pages/lang/en.json", function (data) {
				objLang = data;
				$('a[href="#PhaiSinh"]').text(getMessage('txtPhaisinh'));
				$('a[href="#ThoaThuan"]').text(getMessage('txtTT'));
				$('a[href="#ThongKe"]').text(getMessage('txtThongKe'));
				$('#txtAddStock').attr('placeholder', getMessage('txtAddStock'));
				$('.tieude').attr('placeholder', getMessage('txtTieuDe'));
				$('.txtNhapMaChungKhoan').attr('placeholder', getMessage('txtNhapMaChungKhoan'));
				$('.dropdown-item .txt-add-dm').attr('placeholder', getMessage('txtTaoDanhMuc'));
				allTxtLangCol.forEach(element => {
					$('.' + element).text(getMessage(element));	
				});
			});
		}
		else {
			$.getJSON("dist/js/pages/lang/vi.json", function (data) {
				objLang = data;
				$('a[href="#PhaiSinh"]').text(getMessage('txtPhaisinh'));
				$('a[href="#ThoaThuan"]').text(getMessage('txtTT'));
				$('a[href="#ThongKe"]').text(getMessage('txtThongKe'));
				$('#txtAddStock').attr('placeholder', getMessage('txtAddStock'));
				$('.tieude').attr('placeholder', getMessage('txtTieuDe'));
				$('.txtNhapMaChungKhoan').attr('placeholder', getMessage('txtNhapMaChungKhoan'));
				$('.dropdown-item .txt-add-dm').attr('placeholder', getMessage('txtTaoDanhMuc'));
				allTxtLangCol.forEach(element => {
					$('.' + element).text(getMessage(element));	
				});
			});
		}

		$.ajaxSetup({ "async": true });

		// load lang
	}

	var page = pageName.toUpperCase();
	if (checkFunction(page) == true) {
		document.title = title;
		// clear
		if (objPage != null) objPage.destroy();
		objPage = objParam;
		$(id).load(pageName);
	}
	else {
		// load page ko co quyen
	}
}

function checkFunction(page) {
	// TODO
	return true;
	var role = getCookie('ROLE');
	if (role == 'ADMIN') {
		return true;
	}
	else {
		if (role == page) {
			return true;
		}
		else {
			if (page.indexOf(role) > 0) {
				return true;
			}
			return false;
		}
	}
	// kiem tra listFunction		
	/*for (var i = 0, len = listFunction.length; i < len; i++) {
        if (listFunction[i] === page) {
            return true;
        }
    }
	return false;
	*/
}
Number.prototype.format = function (n, x) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    } 
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// Warn if overriding existing method
if(Array.prototype.equals)
    // console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function replace(pString, pText, by) {
	try {
		var strLength = pString.length, txtLength = pText.length;
		if ((strLength == 0) || (txtLength == 0)) return pString;
		var vIndex = pString.indexOf(pText);
		while (vIndex >= 0) {
			pString = pString.replace(pText, by);
			vIndex = pString.indexOf(pText);
		} //End While
	}
	catch (e) { }
	return pString;
}

//Chuyen tu xau sang so Float
function StringToFloat(pString) {
	pString = replace(pString, ",", "");
	//Convert sang so he so 10
	var vFloat = parseFloat(pString);
	if (isNaN(vFloat)) {
		return 0;
	}
	else {
		return vFloat;
	}
}
//Chuyen tu xau sang so Int
function StringToInt(pString) {
	pString = replace(pString, ",", "");
	//Convert sang so he so 10
	var vInt = parseInt(pString, 10);
	if (isNaN(vInt)) {
		return 0;
	}
	else {
		return vInt;
	}
}

function StringToDouble(pString) {
	pString = replace(pString, ",", "");
	//Convert sang so he so 10
	var vFloat = parseFloat(pString);
	if (isNaN(vFloat)) {
		return 0;
	}
	else {
		return vFloat;
	}
}

/**
 * format volume show by unit on banggia
 * @param {*} number 
 */
function FormatVolume10(number)
{
	if (iUnit == 10){		
		var vTemp = StringToInt(number)*10; 
		var vNumber = FormatCurrency(vTemp.toString(),",",".") 
		return vNumber.substring(0,vNumber.length-1);
	}
	else if (iUnit == 1000){
		var vTemp = StringToInt(number)/100; 
		var vNumber = vTemp.toString().replace('.',',');
		return vNumber
	}
	else{
		// var vTemp = StringToInt(number)*10; 
		// var vNumber = FormatCurrency(vTemp.toString(),",",".") 
		// return vNumber.substring(0,vNumber.length-1);
		return Highcharts.numberFormat(StringToInt(number), 0);
	}
}

//Doi so xxxxxx.xxxx thanh dinh dang xxx,xxx.xxxx
// num: chuoi can dinh dang
// delimitor: dau dinh dang
// separate: dau phan cach phan nguyen va thap phan
function FormatCurrency(num, delimitor, separate){
    var sign, tail; 
	num = num.toString().replace(/\$|\,/g,''); 
	if(isNaN(num)) 
		num = "0"; 
	sign = (num == (num = Math.abs(num))); 
	var str=num.toString();
	var arr_str = str.split(separate);
	if(arr_str.length > 1){
		var tail = new String(arr_str[1])
		if(tail.length<2){
			tail =tail + '0';
		}
	}else{
		tail = '';
	}	
	num = arr_str[0];
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) 
		num = num.substring(0,num.length-(4*i+3))+ delimitor + num.substring(num.length-(4*i+3)); 
	
	if (tail=='')
		ret_value = (((sign)?'':'-') + num);
	else
		ret_value = (((sign)?'':'-') + num + separate + tail);
	return ret_value; 
}

function shownotification(header, mess, icon) {
    $.toast({
        heading: header
        , text: mess
        , position: 'top-right'
        , loaderBg: '#ff6849'
        , icon: icon
        , hideAfter: 2000
        , stack: 6
    })
}

function scrollTo($element) {
    $('html, body').animate({
      scrollTop: $($element + "").offset().top
    }, 1000);
    return false;
}


function getClassSymbol(cPrice, oPrice, tc, tran, san) {
	if(cPrice == '0' || cPrice == '0.0' || cPrice == '0.00' || cPrice == '' ) return 'txt-gia-tc';
    if (cPrice == tc) return 'txt-gia-tc';
    if (cPrice == tran) return 'txt-gia-tran';
    if (cPrice == san) return 'txt-gia-san';
    if (cPrice - oPrice > 0) {
        return 'txt-lime';
    } else if (cPrice - oPrice < 0) {
        return 'txt-red';
    }
    return 'txt-gia-tc';
}

function getIconIndex(cPrice, oPrice) {
    if (cPrice - oPrice > 0) {
        return '<i class="fa fa-caret-up" aria-hidden="true"></i>';
    } else if (cPrice - oPrice < 0) {
        return '<i class="fa fa-caret-down" aria-hidden="true"></i>';
    }
    return '<i class="fa fa-square" aria-hidden="true"></i>';
}

function getIcon(cl) {
    if (cl == 'd') {
        return '<i class="fa fa-caret-down" aria-hidden="true"></i>';
    } else if (cl == 'i') {
        return '<i class="fa fa-caret-up" aria-hidden="true"></i>';
    }
    return '<i class="fa fa-square" aria-hidden="true"></i>';
}

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

/**
 * init hotnews
 */
var hotnewsBox = {i: 0,a: true,t: 0,
	init: function(){		
		if($('.news').length < 1){return;}
		var me = this;me.t = setInterval(function(){me.auto();}, 9000);
	},
	auto: function(){
		
		var me = this;
		if (me.a == false){return;}
		if (me.i >= 9){me.i = -1;}		
		me.i ++;me.slide();
	},
	slide: function(){
		var me		= this;
		var iheight = $('.news > ul li:eq(0)').height();
		$('.news > ul').animate({top:'-'+ (me.i*iheight) + 'px'}, 2000);
	}
};

function loadLocalStoreage() {
	// if (lang == 'en') {
	// 	$.getJSON("Common/js/language/en.json", function (data) {
	// 		objLang = data;
	// 	});
	// }
	// else {
	// 	$.getJSON("Common/js/language/vi.json", function (data) {
	// 		objLang = data;
	// 	});
	// }

	// var profile = $.jStorage.index();
	// var idata = $.jStorage.get('DANH-MUC-MAC-DINH');

	var idata = $.jStorage.get('DANH-MUC-CHUNG-KHOAN');
	if (idata == null) {
		console.log('Chua co danh muc, khoi tao danh muc mac dinh');
		var data = { name: 'Danh mục theo dõi', symbols: ['FLC', 'KLF', 'PVS', 'ITA', 'OGC', 'PVT', 'VHG', 'HVG', 'SHB', 'PVX', 'PVC', 'SSI', 'HAG', 'SCR', 'ITQ', 'STB', 'PVD', 'VCG', 'SHS'], active: true };
		var danhmuc = [];
		danhmuc.push(data);
		
		// $.jStorage.set('DANH-MUC-MAC-DINH', data);

		// data = { name: 'ETF-DB', symbols: ['BVH', 'CSM', 'DIG', 'DPM', 'DRC', 'GMD', 'HAG', 'HPG', 'HSG', 'ITA', 'KBC', 'MSN', 'OGC', 'PET', 'PPC', 'PVD', 'PVT', 'STB', 'VCB', 'VIC', 'VSH'] };
		// $.jStorage.set('ETF-DB', data);

		// data = { name: 'ETF-VNM', symbols: ['BVH', 'DPM', 'DRC', 'GMD', 'HAG', 'ITA', 'MSN', 'OGC', 'PPC', 'PVD', 'PVS', 'PVT', 'SHB', 'STB', 'VCB', 'VCG', 'VIC'] };
		// $.jStorage.set('ETF-VNM', data);

		data = { name: 'VN30', symbols: ["BMP","CII","CTD","CTG","DHG","DPM","FPT","GAS","GMD","HPG","HSG","KDC","MBB","MSN","MWG","NVL","PLX","PNJ","REE","ROS","SAB","SBT","SSI","STB","VCB","VIC","VJC","VNM","VPB","VRE"] };
		danhmuc.push(data);

		data = { name: 'HNX30', symbols: ["ACB","SHB","PVS","VGC","VCS","NTP","HUT","SHS","VCG","DBC","CEO","PVI","PGS","DGC","LAS","NDN","MBS","BVS","L14","VC3","TV2","IDV","VMC","BCC","S99","MAS","HHG","DCS","PLC","DHT"] };
		danhmuc.push(data);

		$.jStorage.set('DANH-MUC-CHUNG-KHOAN', danhmuc);

		// data = { name: 'Ngân hàng', symbols: ['ACB', 'BID', 'CTG', 'EIB', 'MBB', 'NVB', 'SHB', 'STB', 'VCB'] };
		// $.jStorage.set('NGAN-HANG', data);

		// data = { name: 'Cổ phiếu khuyến nghị VPBS', symbols: [] };
		// $.jStorage.set('CO-PHIEU-KHUYEN-NGHI', data);

		// data = { name: 'Top khối lượng giao dịch', symbols: [] };
		// $.jStorage.set('TOP-KHOI-LUONG-GIAO_DICH', data);
	}
}

getMessage = function (code) {
	return objLang[code];
};

getMessageConfirm = function (code) {
	return objLang.txtMessage[code].msg;
};

window.loadScripts = (scripts) =>  {
    return scripts.reduce((currentPromise, scriptUrl) => {
        return currentPromise.then(() => {
            return new Promise((resolve, reject) => {
                var script = document.createElement('script');
                script.async = true;
                script.src = scriptUrl;
                script.onload = () => resolve();
                document.getElementsByTagName('body')[0].appendChild(script);
            });
        });
    }, Promise.resolve());
};

/**
 * set cell checking
 * @param {*} cell : id of cell
 * @param {*} cl : class
 */
function setTracking(cell, cl){
	var sCl = getColor(cl);
	$(cell).css({ 'color': '#fff' });
	$(cell).addClass('clLime');

	setTimeout(function () {
		$(cell).removeClass('clLime');
		$(cell).css({ 'color': sCl });
	}, 1000);
}

delete_cookie = function (name) {
	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

getCookie = function(sKey) {
	if (!sKey) { return null; }
	return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

getRandom = function () {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 23; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

/**
 * MD5 hash and check sum
 */
var MD5Hash = function (d) { result = M(V(Y(X(d), 8 * d.length))); return result.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }

var _0xec4d = ["", "\x75\x6E\x64\x65\x66\x69\x6E\x65\x64", "\x78\x78\x78", "\x6F\x62\x6A\x65\x63\x74", "\x76\x6F\x6C\x75\x6D\x65", "\x76\x70\x62\x73\x40\x34\x35\x36", "\x65\x61\x63\x68"]; function checkSum(_0x5f20x2, _0x5f20x3) { if (_0x5f20x3 == null || _0x5f20x3 == _0xec4d[0] || typeof _0x5f20x3 === _0xec4d[1]) { return _0xec4d[2] }; if (typeof _0x5f20x3 === _0xec4d[3]) { var checkSum = _0x5f20x2; $[_0xec4d[6]](keysCheckSum, function (_0x5f20x4, _0x5f20x5) { if (_0x5f20x5 != _0xec4d[4]) { checkSum += _0x5f20x3[_0x5f20x5] } else { checkSum += (StringToInt(_0x5f20x3[_0x5f20x5]) * 100) + _0xec4d[5] } }); return MD5Hash(checkSum) } else { return MD5Hash(_0x5f20x3) } }

checkSumChangeOrder = function(sid, pData) {
	var keysChkSum = ['price', 'volume', 'refId'];
	var checkSum = sid;
	$.each(keysChkSum, function(i, key) {
		if (key != "volume") {
			checkSum += pData[key];
		} else {
			checkSum += (StringToInt(pData[key]) * 100) + "vpbs@456";
		}
	});
	var chkSum = MD5Hash(checkSum);
	return chkSum;
}

function getStatus(status) {

	if (status.indexOf('X') >= 0) {
		return 'Đã hủy';
	}

	if (status == 'P') {
		return 'Chờ khớp';
	}
	else if ((status == 'PW') || (status == 'PCW') || (status == 'PMW')) {
		return 'Chờ hủy';
	}
	else if (status == 'PM' || status == 'PCM') {
		return 'Đã khớp';
	}
	else if (status == 'PMX') {
		return 'Khớp một phần';
	}
	else if (status == 'PC') {
		return 'Đã sửa';
	}
	else if (status == 'PCWX') {
		return 'Đã hủy';
	}
	else if (status.indexOf('R') > 0) {
		return 'Bị từ chối';
	}

	return status;
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val,format) {
	// console.log(val, format);
  
	  val=val+"";
	  format=format+"";
	  var i_val=0;
	  var i_format=0;
	  var c="";
	  var token="";
	  var token2="";
	  var x,y;
	  var now=new Date();
	  var year=now.getYear();
	  var month=now.getMonth()+1;
	  var date=1;
	  var hh=now.getHours();
	  var mm=now.getMinutes();
	  var ss=now.getSeconds();
	  var ampm="";
	  
	  while (i_format < format.length) {
		  // Get next token from format string
		  c=format.charAt(i_format);
		  token="";
		  while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			  token += format.charAt(i_format++);
			  }
		  // Extract contents of value based on format token
		  if (token=="yyyy" || token=="yy" || token=="y") {
			  if (token=="yyyy") { x=4;y=4; }
			  if (token=="yy")   { x=2;y=2; }
			  if (token=="y")    { x=2;y=4; }
			  year=_getInt(val,i_val,x,y);
			  if (year==null) { return 0; }
			  i_val += year.length;
			  if (year.length==2) {
				  if (year > 70) { year=1900+(year-0); }
				  else { year=2000+(year-0); }
				  }
			  }
		  else if (token=="MMM"||token=="NNN"){
			  month=0;
			  for (var i=0; i<MONTH_NAMES.length; i++) {
				  var month_name=MONTH_NAMES[i];
				  if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
					  if (token=="MMM"||(token=="NNN"&&i>11)) {
						  month=i+1;
						  if (month>12) { month -= 12; }
						  i_val += month_name.length;
						  break;
						  }
					  }
				  }
			  if ((month < 1)||(month>12)){return 0;}
			  }
		  else if (token=="EE"||token=="E"){
			  for (var i=0; i<DAY_NAMES.length; i++) {
				  var day_name=DAY_NAMES[i];
				  if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
					  i_val += day_name.length;
					  break;
					  }
				  }
			  }
		  else if (token=="MM"||token=="M") {
			  month=_getInt(val,i_val,token.length,2);
			  if(month==null||(month<1)||(month>12)){return 0;}
			  i_val+=month.length;}
		  else if (token=="dd"||token=="d") {
			  date=_getInt(val,i_val,token.length,2);
			  if(date==null||(date<1)||(date>31)){return 0;}
			  i_val+=date.length;}
		  else if (token=="hh"||token=="h") {
			  hh=_getInt(val,i_val,token.length,2);
			  if(hh==null||(hh<1)||(hh>12)){return 0;}
			  i_val+=hh.length;}
		  else if (token=="HH"||token=="H") {
			  hh=_getInt(val,i_val,token.length,2);
			  if(hh==null||(hh<0)||(hh>23)){return 0;}
			  i_val+=hh.length;}
		  else if (token=="KK"||token=="K") {
			  hh=_getInt(val,i_val,token.length,2);
			  if(hh==null||(hh<0)||(hh>11)){return 0;}
			  i_val+=hh.length;}
		  else if (token=="kk"||token=="k") {
			  hh=_getInt(val,i_val,token.length,2);
			  if(hh==null||(hh<1)||(hh>24)){return 0;}
			  i_val+=hh.length;hh--;}
		  else if (token=="mm"||token=="m") {
			  mm=_getInt(val,i_val,token.length,2);
			  if(mm==null||(mm<0)||(mm>59)){return 0;}
			  i_val+=mm.length;}
		  else if (token=="ss"||token=="s") {
			  ss=_getInt(val,i_val,token.length,2);
			  if(ss==null||(ss<0)||(ss>59)){return 0;}
			  i_val+=ss.length;}
		  else if (token=="a") {
			  if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
			  else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
			  else {return 0;}
			  i_val+=2;}
		  else {
			  if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
			  else {i_val+=token.length;}
			  }
		  }
	// If there are any trailing characters left in the value, it doesn't match
	// console.log(i_val, val);
	  if (i_val != val.length) { return 0; }
	  // Is date valid for month?
	  if (month==2) {
		  // Check for leap year
		  if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
			  if (date > 29){ return 0; }
			  }
		  else { if (date > 28) { return 0; } }
		  }
	  if ((month==4)||(month==6)||(month==9)||(month==11)) {
		  if (date > 30) { return 0; }
		  }
	  // Correct hours value
	  if (hh<12 && ampm=="PM") { hh=hh-0+12; }
	  else if (hh>11 && ampm=="AM") { hh-=12; }
	  var newdate=new Date(year,month-1,date,hh,mm,ss);
	  return newdate.getTime();
	}
  
  // ------------------------------------------------------------------
  // Utility functions for parsing in getDateFromFormat()
  // ------------------------------------------------------------------
  function _isInteger(val) {
	  var digits="1234567890";
	  for (var i=0; i < val.length; i++) {
		  if (digits.indexOf(val.charAt(i))==-1) { return false; }
		  }
	  return true;
	  }
  function _getInt(str,i,minlength,maxlength) {
	  for (var x=maxlength; x>=minlength; x--) {
		  var token=str.substring(i,i+x);
		  if (token.length < minlength) { return null; }
		  if (_isInteger(token)) { return token; }
		  }
	  return null;
	}


	const findLocalIp = (logInfo = true) => new Promise( (resolve, reject) => {
		window.RTCPeerConnection = window.RTCPeerConnection 
								|| window.mozRTCPeerConnection 
								|| window.webkitRTCPeerConnection;
	
		if ( typeof window.RTCPeerConnection == 'undefined' )
			return reject('WebRTC not supported by browser');
	
		let pc = new RTCPeerConnection();
		let ips = [];
	
		pc.createDataChannel("");
		pc.createOffer()
		 .then(offer => pc.setLocalDescription(offer))
		 .catch(err => reject(err));
		pc.onicecandidate = event => {
			if ( !event || !event.candidate ) {
				// All ICE candidates have been sent.
				if ( ips.length == 0 )
					return reject('WebRTC disabled or restricted by browser');
	
				return resolve(ips);
			}
	
			let parts = event.candidate.candidate.split(' ');
			let [base,componentId,protocol,priority,ip,port,,type,...attr] = parts;
			let component = ['rtp', 'rtpc'];
	
			if ( ! ips.some(e => e == ip) )
				ips.push(ip);
	
			if ( ! logInfo )
				return;
	
			console.log(" candidate: " + base.split(':')[1]);
			console.log(" component: " + component[componentId - 1]);
			console.log("  protocol: " + protocol);
			console.log("  priority: " + priority);
			console.log("        ip: " + ip);
			console.log("      port: " + port);
			console.log("      type: " + type);
	
			if ( attr.length ) {
				console.log("attributes: ");
				for(let i = 0; i < attr.length; i += 2)
					console.log("> " + attr[i] + ": " + attr[i+1]);
			}
	
			console.log();
		};
	} );
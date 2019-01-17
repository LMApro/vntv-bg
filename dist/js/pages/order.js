var typeOrder = 0;
var typeAccount = '1'; // 1,6,8
var objUser = new Object();
var orderModel = {orderCommand: '', dataSym: '', lstOrderInday:'', orderType: 'NEW', orderUpdate: '', savePin: true, txtPin: ''};
// orderType = NEW, UPDATE, DELETE
var objOrder = new Object();

$('.tab-datlenh').on('click', function () {
    // findLocalIp().then(
    //     ips => {
    //         let s= '';
    //         ips.forEach( ip => s += ip + ',' );
    //         // console.log(s);
    //         if(s.includes('10.32.50.229') || s.includes('10.32.48.25')){
    //             if(global.user != ''){
    //                 if(!$('a[href="#createOrder"]').hasClass('active')){
    //                     $('a[href="#createOrder"]').click();
    //                 }
    //                 //objOrder.generateOrder16();
    //                 $('.panel-order').toggle();
    //             } else {
    //                 $('.panel-login').modal();
    //             }
    //         }
    //     },
    //     err => console.log(err)
    // );
});

/**
 * Load danh sách mã chứng khoán phái sinh
 */
objOrder.loadListStockPs = function(){
    $.ajaxSetup({ "async": false });
    $.getJSON(psListLink,function(zdata){
        zdata.sort();
        vStockPs = zdata;
    },"jsonp");
    $.ajaxSetup({ "async": true });
}

$('#btn-login-submit').on('click', function(){
    //global.user = $('#user-name-login').val();
    // global.sid = $('#pass-login').val();

    var userName = $('#user-name-login').val().trim();
	if (userName.length != 6) {
		$(".validation").text('Tài khoản login phải là 6 ký tự');
		return false;
	}
    var password = $('#pass-login').val().trim();
    if(password == ''){
        $(".validation").text('Hãy nhập password');
		return false;
    }

    // check login
    $.post('/CheckLogin.aspx', {
		user: userName, pass: password, channel: 'H'
	}, function (zdata) {
        console.log(zdata);
        try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
		if (rs.data != null && rs.rc == 1) {
			var userInfo = rs.data;
			delete_cookie('USER');
			delete_cookie('JSESSION');
			document.cookie = "USER=" + userInfo.user;
			document.cookie = "JSESSION=" + userInfo.sid;
            global.user = userInfo.user;
            global.sid = userInfo.sid;
            global.accountDefault = userInfo.defaultAcc;

            $('#account-info').text(userInfo.name);
            $('#account_id').text(userInfo.name);
            $('#btn-fb-login').css('display', 'none');
            $('.dropdown-account').css('display', 'inline-block');

            // load config
            objOrder.loadResource();
            // load danh sach account
            objOrder.getListAccount()
            // load account status
            objOrder.getAccountStatus();
            
            $('.panel-login').modal('hide');
            if(typeOrder == 0){
                objOrder.generateOrder16();
            }
            typeOrder = 0;
            $('.panel-order').toggle();
            $('.panel-order a[href="#createOrder"]').click();
		} else {
			// check false
			$(".validation").text(rs.rs);
		}
	});
});


$('.panel-order .nav-link').on('click', function(){
    if($(this).attr('href') == '#createOrder'){
        // create order
        let accSel = $('#sel-account-order').val();
        let typeGenerate = $('#typeAccountGenerate').val();
        if(typeGenerate != '8' && accSel.endsWith('8')){
            if(!$('.tab a[href="#PhaiSinh"]').hasClass('.active')) {
                location.href = '#PhaiSinh';
                $('.tab a[href="#PhaiSinh"]').click();
            }
            objOrder.generateOrder8();
            if(vStockPs == null || vStockPs == 'undefined' || typeof vStockPs == 'undefined'){
                $.when(objOrder.loadListStockPs()).done(function(){
                    var htmlSel = '';
                    vStockPs.forEach(element => {
                        htmlSel += '<option value="'+element+'">'+element+'</option>'
                    });
                    $('#txt-sym-order').html(htmlSel);
                    $('#txt-sym-ab').html(htmlSel);
                });
            } else {
                var htmlSel = '';
                vStockPs.forEach(element => {
                    htmlSel += '<option value="'+element+'">'+element+'</option>'
                });
                $('#txt-sym-order').html(htmlSel);
                $('#txt-sym-ab').html(htmlSel);
            }
        } else if(typeGenerate == 8 && !accSel.endsWith('8')){
            objOrder.generateOrder16();
        }
        objOrder.getAccountStatus();
        
    } else if($(this).attr('href') == '#listOrder'){
        // get list order
        // load lenh trong ngay
        objOrder.getIndayOrder();
    } else if($(this).attr('href') == '#category'){
        // load danh muc account
        objOrder.getDanhmucAccount();
    } else {
        // load tài sản
        // load account status
        objOrder.getAccountStatus();
    }
});

objOrder.clearFieldCreateOrder = function(){
    $('#createOrder input[type="text"]').val('');
    $('#createOrder input[type="password"]').val('');
}

function dblClickOrderStock(dis){
    typeOrder = 1;
    if(!$('a[href="#createOrder"]').hasClass('active')){
        $('a[href="#createOrder"]').click();
    }

    if($('.tab-left .tab-phaisinh').hasClass('active')){
        // phái sinh
        if($('#typeAccountGenerate').val() == '8'){
            $('#sel-account-order option').eq(2).prop('selected', true);
            var sym = $(dis).attr('id').split('_')[1];
            var prices = $(dis).html();
    
            $('#txt-sym-order').val(sym.toUpperCase());
            $('#txt-val-order').val(prices);
            $('#txt-vol-order').val('1');
        } else {
            $.when(objOrder.generateOrder8()).done(function(){
                var htmlSel = '';
                vStockPs.forEach(element => {
                    htmlSel += '<option value="'+element+'">'+element+'</option>'
                });
                $('#txt-sym-order').html(htmlSel);
                $('#txt-sym-ab').html(htmlSel);

                $('#sel-account-order option').eq(2).prop('selected', true);
                var sym = $(dis).attr('id').split('_')[1];
                var prices = $(dis).html();
        
                $('#txt-sym-order').val(sym.toUpperCase());
                $('#txt-val-order').val(prices);
                $('#txt-vol-order').val('1');
            });
        }
    } else {
        // cơ sở
        if($('#typeAccountGenerate').val() == '1'){
            $('#sel-account-order option').eq(0).prop('selected', true);
    
            var sym = $(dis).attr('id').split('_')[1];
            var prices = $(dis).html();
    
            $('#txt-sym-order').val(sym.toUpperCase());
            $('#txt-val-order').val(prices);
            $('#txt-vol-order').val('10');
        } else {
            $.when(objOrder.generateOrder16()).done(function(){
                $('#sel-account-order option').eq(0).prop('selected', true);
    
                var sym = $(dis).attr('id').split('_')[1];
                var prices = $(dis).html();
        
                $('#txt-sym-order').val(sym.toUpperCase());
                $('#txt-val-order').val(prices);
                $('#txt-vol-order').val('10');
            });
        }
    }
    if(global.user != ''){
        typeOrder = 0;
        return (!$('.panel-order').is(':visible') && $('.panel-order').toggle());
    } else {
        $('.panel-login').modal();
    }
}

$('#sel-account-order').on('change', function(){
    // console.log($('#sel-account-order').val());
    orderModel.orderType == 'NEW';
    var account = $('#sel-account-order').val();
    // check account
    var typeAcc = account.slice(-1);
    if($('.panel-order a[href="#createOrder"]').hasClass('active')){
        // lấy tài sản
        objOrder.getAccountStatus();
        // đặt lệnh
        if(typeAcc == '8'){
            // phái sinh
            typeAccount = '8';
            if(vStockPs == null || vStockPs == 'undefined' || typeof vStockPs == 'undefined'){
                $.when(objOrder.loadListStockPs()).done(function(){
                    objOrder.generateOrder8();
                    var htmlSel = '';
                    vStockPs.forEach(element => {
                        htmlSel += '<option value="'+element+'">'+element+'</option>'
                    });
                    $('#txt-sym-order').html(htmlSel);
                    $('#txt-sym-ab').html(htmlSel);
                    objOrder.clearFieldCreateOrder();
                    if(!$('.tab a[href="#PhaiSinh"]').hasClass('.active')) {
                        location.href = '#PhaiSinh';
                        $('.tab a[href="#PhaiSinh"]').click();
                    }
                    $('#txt-vol-order').val('1');
                    $('#txt-val-order').val($('#pri_' + vStockPs[0]).html());
                });
            } else {
                objOrder.generateOrder8();
                var htmlSel = '';
                vStockPs.forEach(element => {
                    htmlSel += '<option value="'+element+'">'+element+'</option>'
                });
                $('#txt-sym-order').html(htmlSel);
                $('#txt-sym-ab').html(htmlSel);
                objOrder.clearFieldCreateOrder();
                if(!$('.tab a[href="#PhaiSinh"]').hasClass('.active')) {
                    location.href = '#PhaiSinh';
                    $('.tab a[href="#PhaiSinh"]').click();
                }
                $('#txt-vol-order').val('1');
                $('#txt-val-order').val($('#pri_' + vStockPs[0]).html());
            }
        } else {
            // cơ sở
            if(typeAccount == '1' || typeAccount == '6') {
                objOrder.clearFieldCreateOrder();
                return false;
            }
            typeAccount = typeAcc;
            objOrder.generateOrder16();
            objOrder.clearFieldCreateOrder();
        }
    } else if($('.panel-order a[href="#listOrder"]').hasClass('active')){
        // sổ lệnh
        objOrder.getIndayOrder();
    } else if($('.panel-order a[href="#category"]').hasClass('active')){
        // danh muc
        objOrder.getDanhmucAccount();
    } else {
        // tài sản
        objOrder.getAccountStatus();
    }
})

// generate form create order 1,6
objOrder.generateOrder16 = function(){
    // form đặt lệnh cơ sở
    var html = '';
    html += '<div class="btn-group gr-btn-order h25" role="group">';
    html += '<div role="button" class="btn-second btn-long active" ty="1">MUA</div>';
    html += '<div role="button" class="btn-second btn-short" ty="2">BÁN</div></div>';
    html += '<form autocomplete="off" id="form-create-order">';             
    html += '<div class="col-12" style="margin-top: 15px;">';
    html += '<div class="col-6">';
    html += '<label>Mã CK</label>';                        
    html += '<input type="text" value="" class="form-control" id="txt-sym-order"></div>';
    html += '<div class="col-6">';
    html += '<label>Khối lượng</label>';
    html += '<input type="text" value="" class="form-control text-right" id="txt-vol-order"></div></div>';
    html += '<div class="col-12">';
    // html += '<div class="col-6">';
    // html += '<label>Loại lệnh</label>';
    // html += '<select class="form-control" id="sel-type-order">';
    // html += '</select></div>';
    html += '<div class="col-6">';
    html += '<label>Giá</label>';                    
    html += '<input type="text" class="form-control text-right" id="txt-val-order" value="" autocomplete="off" list="PriceList">\
                <datalist id="PriceList">\
                    <option value="MOK">\
                    <option value="MAK">\
                    <option value="MTL">\
                    <option value="ATO">\
                    <option value="ATC">\
                </datalist>\
            </div></div>';
    html += '<div class="col-12">';
    html += '<div class="col-6">';
    html += '<label>Pin</label>';
    html += '<input type="text" style="display:none;" />';
    html += '<input type="password" name="password" value="" class="form-control" id="txt-pin-order" autocomplete="new-password"></div>';
    html += '<div class="col-6" style="margin-top: 23px;">';
    html += '<input type="checkbox" id="chk-save-pin" checked>';
    html += '<label for="chk-save-pin">&nbsp;&nbsp;Lưu Pin</label></div></div>';
    // html += '<div class="col-12" style="height: 35px;background: #454A5D;margin: 10px 0;">';
    // html += '<span>Tổng giá trị</span>';
    // html += '<span>900.000.000đ</span></div>';
    html += '<div class="col-12" style="justify-content: center; margin-top: 15px;">';
    html += '<button class="btn btn-default btn-create-order" ty="normal">Đặt lệnh</button>';
    html += '<button class="btn btn-default btn-cancel-order" style="margin-left: 20px;">Hủy</button>';
    html += '</div>';
    html += '</form>';
    $('#form-order').html(html);
    $('#typeAccountGenerate').val('1');
    // set autocomplete
    setAutoComplete('txt-sym-order', modal.listIndex);
    
    // input mask input khối lượng
    $('#txt-vol-order').inputmask({
        alias: 'numeric',
        groupSeparator: ',',
        autoGroup: true,
        digits: 0,
        digitsOptional: false,
    });

    // $('#txt-val-order').inputmask({
    //     alias: 'numeric',
    //     groupSeparator: ',',
    //     autoGroup: true,
    //     digits: 2,
    //     digitsOptional: false,
    //     prefix: '',
    //     placeholder: ''
    // });
}

// generate form create order 8
objOrder.generateOrder8 = function(){
    // form đặt lệnh phái sinh
    var html = '';
    html += '<form autocomplete="off" id="form-create-order">\
                <div class="col-12" style="margin-top: 15px;">\
                    <div class="col-6">\
                        <label>Mã CK</label>\
                        <select class="form-control" id="txt-sym-order">\
                        </select>\
                    </div>\
                    <div class="col-6">\
                        <label>Khối lượng</label>\
                        <input type="text" value="" class="form-control text-right" id="txt-vol-order">\
                    </div>\
                </div>\
                <div class="col-12">\
                    <div class="col-6">\
                        <label>Giá</label>\
                        <input type="text" value="" class="form-control text-right" id="txt-val-order" autocomplete="off" list="PriceList">\
                        <datalist id="PriceList">\
                            <option value="MOK">\
                            <option value="MAK">\
                            <option value="MTL">\
                            <option value="ATO">\
                            <option value="ATC">\
                        </datalist>\
                    </div>\
                    <div class="col-6" style="padding-top: 23px;">\
                        <span>Realtime</span>\
                        <button type="button" style="margin-top: 21px;" class="btn btn-sm btn-secondary btn-toggle btn-real-price active" data-toggle="button" aria-pressed="true">\
                            <div class="handle"></div>\
                        </button>\
                    </div>\
                </div>\
                <div class="col-12" style="display: flex; justify-content: space-between; border-top: 1px solid #44495C; border-bottom: 1px solid #44495C;">\
                    <div class="btn-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>\
                    <div class="cond-proc">\
                        <div class="sub-cond-proc active">\
                            <div class="tit-head">\
                                <span>Stop Loss/Take Profit</span>\
                                <button type="button" style="margin-top: 21px;" class="btn btn-sm btn-secondary btn-toggle btn-cond" ty="SLTP" data-toggle="button" aria-pressed="true">\
                                    <div class="handle"></div>\
                                </button>\
                            </div>\
                            <div class="col-12 tit-content">\
                                <div class="col-6">\
                                    <div class="input-group bootstrap-touchspin">\
                                        <input class="vertical-spin form-control" id="txt-stopLost" type="text" value="1" name="vertical-spin" style="display: block;" step="0.1" min="0.1">\
                                        <div class="input-group-append bootstrap-touchspin-postfix" style="display: none;"></div>\
                                        <span class="input-group-btn-vertical"><button class="btn btn-secondary btn-outline bootstrap-touchspin-up" type="button"><i class="ti-plus"></i></button><button class="btn btn-secondary btn-outline bootstrap-touchspin-down" type="button"><i class="ti-minus"></i></button></span>\
                                    </div>\
                                </div>\
                                <div class="col-6">\
                                    <div class="input-group bootstrap-touchspin">\
                                        <input class="vertical-spin form-control" id="txt-takeProfit" type="text" value="1" name="vertical-spin" style="display: block;" step="0.1" min="0.1">\
                                        <div class="input-group-append bootstrap-touchspin-postfix" style="display: none;"></div>\
                                        <span class="input-group-btn-vertical"><button class="btn btn-secondary btn-outline bootstrap-touchspin-up" type="button"><i class="ti-plus"></i></button><button class="btn btn-secondary btn-outline bootstrap-touchspin-down" type="button"><i class="ti-minus"></i></button></span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="sub-cond-proc">\
                            <div class="tit-head">\
                                <span>Arbitrage</span>\
                                <button type="button" style="margin-top: 21px;" class="btn btn-sm btn-secondary btn-toggle btn-cond" ty="AB" data-toggle="button" aria-pressed="true">\
                                    <div class="handle"></div>\
                                </button>\
                            </div>\
                            <div class="col-12 tit-content">\
                                <select class="form-control" id="txt-sym-ab">\
                                </select>\
                            </div>\
                        </div>\
                        <div class="sub-cond-proc">\
                            <div class="tit-head">\
                                <span>Stop Order</span>\
                                <button type="button" style="margin-top: 21px;" class="btn btn-sm btn-secondary btn-toggle btn-cond" ty="SO" data-toggle="button" aria-pressed="true">\
                                    <div class="handle"></div>\
                                </button>\
                            </div>\
                            <div class="col-12 tit-content">\
                                <span>Giá kích hoạt:</span>\
                                <div class="form-group" style="margin-bottom: 0;">\
                                    <div class="input-group">\
                                        <select class="form-control" id="sel-so-type">\
                                            <option value="SOL">≥</option>\
                                            <option value="SOU">≤</option>\
                                        </select>\
                                        <div class="input-group-append">\
                                            <input type="text" id="txt-so-pri-start" class="text-right" style="width: 100px;">\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="btn-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>\
                </div>\
                <div class="col-12">\
                    <div class="col-6">\
                        <label>Pin</label>\
                        <input type="text" style="display:none;" />\
                        <input type="password" name="password" value="" class="form-control" id="txt-pin-order" autocomplete="new-password">\
                    </div>\
                    <div class="col-6" style="margin-top: 23px;">\
                        <input type="checkbox" id="chk-save-pin" checked>\
                        <label for="chk-save-pin">&nbsp;&nbsp;Lưu Pin</label>\
                    </div>\
                </div>\
                <div class="col-12" style="justify-content: center; margin-top: 15px;">\
                    <button class="btn btn-default btn-create-order btn-order-long" ty="long">LONG</button>\
                    <button class="btn btn-default btn-create-order btn-order-short" ty="short" style="margin-left:20px;">SHORT</button>\
                    <button class="btn btn-default btn-cancel-order" style="margin-left:20px;">Hủy</button>\
                </div>\
            </form>';
    $('#form-order').html(html);
    $('#typeAccountGenerate').val('8');
    // <div class="col-12" style="height: 35px;background: #454A5D;margin: 10px 0;">\
    //     <span>Tổng giá trị</span>\
    //     <span>900.000.000đ</span>\
    // </div>\
}

$(document).on('click', '#createOrder .btn-second', function(){
    if(!$(this).hasClass('active')){
        orderModel.orderType == 'NEW';
        $('#createOrder input[type="text"]').removeAttr('disabled');
        $('#createOrder .btn-second').removeClass('active');
        $(this).addClass('active');
        if($(this).attr('ty') == '1'){
            $('#createOrder .btn-create-order').css({
                background: "rgb(68, 190, 36)",
            });
        } else {
            $('#createOrder .btn-create-order').css({
                background: "red"
            });
        }
    }
});

$(document).on('click', '.btn-cancel-order', function() {
    orderModel.orderType = 'NEW';
    orderModel.orderUpdate = null;
    $('#form-order input[type="text"]').val('');
})

$(document).on('click', '.tit-head .btn-cond', function(){
    var titContent = $(this).parent().parent().find('.tit-content');
    if($(titContent).hasClass('active')){
        $(titContent).removeClass('active');
    } else {
        $(titContent).addClass('active');
    }
})

//#region xử lý phần tăng giảm trong input
$(document).on('click', '.bootstrap-touchspin-up', function(){
    var ipt = $(this).parent().parent().find('.vertical-spin');
    var iptVal = $(ipt).val();
    var step = $(ipt).attr('step');
    var max = $(ipt).attr('max');
    var min = $(ipt).attr('min');
    if(step == '' || step == null || step == undefined) step = '1';
    // console.log(ipt, step);
    if(step.includes('.')){
        // double
        $(ipt).val(Highcharts.numberFormat(StringToFloat(iptVal) + StringToFloat(step)));
    } else {
        // int
        $(ipt).val(StringToInt(iptVal) + StringToInt(step));
    }
})

$(document).on('click', '.bootstrap-touchspin-down', function(){
    var ipt = $(this).parent().parent().find('.vertical-spin');
    var iptVal = $(ipt).val();
    var step = $(ipt).attr('step');
    var min = $(ipt).attr('min');
    if(step == '' || step == null || step == undefined) step = '1';
    if(min == '' || min == null || min == undefined) min = '0';
    console.log(ipt, step);
    if(step.includes('.')){
        // double
        $(ipt).val(StringToFloat(iptVal) - StringToFloat(step) > StringToFloat(min) ? Highcharts.numberFormat(StringToFloat(iptVal) - StringToFloat(step)) : min);
    } else {
        // int
        $(ipt).val(StringToInt(iptVal) - StringToInt(step) > StringToInt(min) ? StringToInt(iptVal) - StringToInt(step) : min);
    }
})
//#endregion

//#region xử lý phần slide type order
$(document).on('click', '.btn-next', function(){
    var next = 0;
    $('.cond-proc .sub-cond-proc').each(function(i){
        if($(this).hasClass('active')){
            //console.log(i);
            next = i + 1;
            return;
        }
    })
    if(next == 3) next = 0;
    $('.cond-proc .sub-cond-proc').removeClass('active');
    $('.cond-proc .sub-cond-proc').each(function(i){
        if(i == next){
            $(this).addClass('active');
            return;
        }
    })
})

$(document).on('click', '.btn-prev', function(){
    var prev = 0;
    $('.cond-proc .sub-cond-proc').each(function(i){
        if($(this).hasClass('active')){
            //console.log(i);
            prev = i - 1;
            return;
        }
    })
    if(prev < 0) prev = 2;
    $('.cond-proc .sub-cond-proc').removeClass('active');
    $('.cond-proc .sub-cond-proc').each(function(i){
        if(i == prev){
            $(this).addClass('active');
            return;
        }
    })
})
//#endregion

/**
 * load config
 */
objOrder.loadResource = function() {
	$.ajaxSetup({ "async": false });

	// load config
	console.log('load config');
	var url = "/LoadConfig.ashx?pUser=" + global.user + "&pSid=" + global.sid + '&pChecksum=xxx';
	$.getJSON(url, function (zdata) {
		console.log(zdata);
		// if (zdata.rc == 1) {
		// 	objUser = zdata;
		// }
		// else {
		// 	document.cookie = "USER=zombie";
        //     document.cookie = "JSESSION=zombie";
            
        //     global = {user:"", sid:"", accounts:null};
		// }
	});

	$.ajaxSetup({ "async": true });
}

/**
 * lấy danh sách account
 */
objOrder.getListAccount = function(){
    var pdata = {group:"B",user:global.user,session:global.sid,data:{type:"cursor",cmd:"ListAccount",p1:"",p2:"",p3:"",p4:""}};
    $.ajaxSetup({ "async": false });

	console.log('load danh sách account');
	// var url = "/LoadConfig.ashx?pUser=" + global.user + "&pSid=" + global.sid + '&pChecksum=xxx';
    $.ajax({
		type: "POST",
		url: urlCore,
		cache: false,
		data: JSON.stringify(pdata),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (zdata) {
            console.log(zdata);
            if(zdata.rc > 0){
                global.accounts = zdata.data;
                var html = '';
                global.accounts.forEach(element => {
                    if((element.accCode == global.accountDefault && typeOrder == 0) || (typeOrder == 1 && element.accCode.endsWith('8'))){
                        html += '<option value="'+element.accCode+'" selected="true">'+element.accCode+'</option>'
                    } else {
                        html += '<option value="'+element.accCode+'">'+element.accCode+'</option>'
                    }
                });
                $('#sel-account-order').html(html);
                // $('.sel-account-order').html(html);
            } else {
                processRsError(zdata.rc, zdata.rs);
            }
		},
		error: function (e) {
			// error
		}
	});
	$.ajaxSetup({ "async": true });
}

/**
 * lấy thông tin tài sản
 */
objOrder.getAccountStatus = function(){
    var accountSel = $('#sel-account-order').val();
	var pdata = { group: "Q", user: global.user, session: global.sid, data: { type: "string", cmd: "Web.Portfolio.AccountStatus", p1: accountSel, p2: "", p3: "", p4: "null" } };
	$.ajax({
		type: "POST",
		url: urlCore,
		cache: false,
		data: JSON.stringify(pdata),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (vData) {
			console.log(vData);
			if (vData.rc == 1) {
                objUser.Assets = vData.data;
				objOrder.processAssetAccount(vData.data);
			} else {
				console.log(vData);
			}
		},
		error: function (e) {
			// error
		}
	});
}

/**
 * xử lý hiển thị tài sản theo tài khoản
 * @param {*} data 
 */
objOrder.processAssetAccount = function(data){
    var accountSel = $('#sel-account-order').val();

    var html = '';
    if(accountSel.endsWith('1')){
        $('#panelOrderSucmua').text(Highcharts.numberFormat(data.cash_avai, 0) + 'đ');
        // normal account
        html += '<div><span>Tổng tài sản</span><span>'+Highcharts.numberFormat(data.assets, 0)+'</span></div>';
        html += '<div><span>Tiền mặt</span><span>'+Highcharts.numberFormat(data.cash_avai, 0)+'</span></div>';
        html += '<div><span>Tiền có thể rút</span><span>'+Highcharts.numberFormat(data.withdrawal_cash, 0)+'</span></div>';
        html += '<div><span>Tiền có thể ứng</span><span>'+Highcharts.numberFormat(data.withdrawal_cash, 0)+'</span></div>';
        html += '<div><span>Tiền có thể mua</span><span>'+Highcharts.numberFormat(data.avaiColla, 0)+'</span></div>';
        html += '<div><span>Tiền chờ thanh toán</span><span>'+Highcharts.numberFormat(data.ap_t0 + data.ap_t1, 0)+'</span></div>';
        html += '<div><span>Tiền bán chờ về</span><span>'+Highcharts.numberFormat(data.ar_t0 + data.ar_t1, 0)+'</span></div>';
    } else if(accountSel.endsWith('6')){
        $('#panelOrderSucmua').text(Highcharts.numberFormat(data.cash_avai, 0) + 'đ');
        // margin account
        html += '<div><span>Tổng tài sản thực tế</span><span>'+Highcharts.numberFormat(data.assets, 0)+'</span></div>';
        html += '<div><span>Tài sản ròng</span><span>'+Highcharts.numberFormat(data.equity, 0)+'</span></div>';
        // html += '<div><span>Tiền mặt</span><span>'+Highcharts.numberFormat(data.cash_balance, 0)+'</span></div>';
        html += '<div><span>Tổng nợ gốc</span><span>'+Highcharts.numberFormat(data.debt, 0)+'</span></div>';
        html += '<div><span>Lãi tạm tính</span><span>'+Highcharts.numberFormat(data.loan_fee, 0)+'</span></div>';
        html += '<div><span>Phí lưu ký</span><span>'+Highcharts.numberFormat(data.deposit_fee, 0)+'</span></div>';
        html += '<div><span>Tiền cổ tức băng tiền</span><span>'+Highcharts.numberFormat(data.collateral, 0)+'</span></div>';
        html += '<div><span>Tiền có thể rút</span><span>'+Highcharts.numberFormat(data.cash_avai, 0)+'</span></div>';
        html += '<div><span>Tiền có thể mua</span><span>'+Highcharts.numberFormat(data.cash_avai, 0)+'</span></div>';
        html += '<div><span>Tiền có thể ứng</span><span>'+Highcharts.numberFormat(data.cash_advance_avai, 0)+'</span></div>';
        html += '<div><span>Tiền chờ thanh toán</span><span>'+Highcharts.numberFormat(data.ap_t0 + data.ap_t1, 0)+'</span></div>';
        html += '<div><span>Tiền bán chờ về</span><span>'+Highcharts.numberFormat(data.ar_t0 + data.ar_t1, 0)+'</span></div>';
        html += '<div><span>Tỉ lệ tài khoản</span><span>'+data.margin_ratio+'</span></div>';
    } else {
        $('#panelOrderSucmua').text(Highcharts.numberFormat(data.avaiColla, 0) + 'đ');
        // phái sinh account
        html += '<div><span>Tổng tài sản</span><span>'+Highcharts.numberFormat(data.assets, 0)+'</span></div>';
        html += '<div><span>Tiền mặt</span><span>'+Highcharts.numberFormat(data.avaiCash, 0)+'</span></div>';
        html += '<div><span>Tiền ký quỹ(VSD)</span><span>'+Highcharts.numberFormat(data.avaiCash, 0)+'</span></div>';
        html += '<div><span>Sức mua</span><span>'+Highcharts.numberFormat(data.avaiColla, 0)+'</span></div>';
        html += '<div><span>Ký quỹ ban đầu</span><span>'+Highcharts.numberFormat(data.im, 0)+'</span></div>';
        html += '<div><span>Tỷ lệ tài khoản</span><span>'+data.tyle+'</span></div>';
        html += '<div><span>Phí + Thuế</span><span>'+Highcharts.numberFormat(data.others, 0)+'</span></div>';
        html += '<div><span>Tiền chưa thanh toán</span><span>'+Highcharts.numberFormat(data.vmunpay, 0)+'</span></div>';
        html += '<div><span>Lãi lỗ</span><span>'+Highcharts.numberFormat(data.vm, 0)+'</span></div>';
        html += '<div><span>Lãi lỗ(chưa đóng)</span><span>'+Highcharts.numberFormat(data.unrelizeVM, 0)+'</span></div>';
    }
    $('#asset .col-md-12').html(html);
}

/**
 * sổ lệnh
 */
objOrder.getIndayOrder = function(){
    $('#listOrder table tbody').html('');
    var accountSel = $('#sel-account-order').val();
    var pdata = {group:"Q",user:global.user,session:global.sid,data:{type:"string",cmd:"Web.Order.IndayOrder",p1:"1",p2:"20",p3:"",p4:""}};
    $.ajax({
		type: "POST",
		url: urlCore,
		cache: false,
		data: JSON.stringify(pdata),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (vData) {
			console.log(vData);
			if (vData.rc == 1) {
                orderModel.lstOrderInday = vData.data;
                var rs = _.filter(vData.data, function(o){ return o.accountCode == accountSel; });
				objOrder.processIndayOrder(rs);
			} else {
                console.log(vData);
                processRsError(vData.rc, vData.rs);
			}
		},
		error: function (e) {
			// error
		}
	});
}

/**
 * function process order in day
 * @param {*} data : list order
 */
objOrder.processIndayOrder = function(data){
    var html = '';
    var accountSel = $('#sel-account-order').val();
    if(accountSel.endsWith('8')){
        // phai sinh
        var dataKhop = [];
        data.forEach(element => {
            let att = '';
            let txtStatus = getStatus(element.status);
            // console.log(txtStatus, txtStatus == 'Đã khớp')
            if(txtStatus == 'Đã khớp') {
                dataKhop.push(element.orderNo);
                att = 'rel="popover" data-placement="top"';
            }

            html += '<tr>\
                        <td class="text-center '+(element.side == 'B' ? 'buy' : 'sell')+'">'+(element.side == 'B' ? 'LONG' : 'SHORT')+'</td>\
                        <td class="text-center" '+att+' id="panel-pop-order-'+element.orderNo+'">'+element.symbol+'</td>\
                        <td class="text-right">'+Highcharts.numberFormat(element.showPrice, 2)+'</td>\
                        <td class="text-right">'+Highcharts.numberFormat(element.volume, 0)+'</td>\
                        <td class="text-center">'+txtStatus+'</td>';
            if((element.orderNo > 0) && (element.status.indexOf('X') < 0) && txtStatus != 'Đã khớp'){
                html += '<td class="text-center td-act">\
                            <a href="javascript:void(0);" onclick="objOrder.actUpdateOrder('+element.orderNo+');" title="Sửa lệnh"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>\
                            <a href="javascript:void(0);" onclick="objOrder.actDeleteOrder('+element.orderNo+');" title="Hủy lệnh"><i class="fa fa-trash-o" aria-hidden="true"></i></a>\
                        </td></tr>';
            } else {
                html += '<td class="text-center"></td></tr>';
            }
        });

        $('#listOrder table tbody').html(html);
        dataKhop.forEach(el => {
            $("#panel-pop-order-" + el).popover({
                trigger: "hover",
                html : true, 
                content: function() {
                    var htmlPopover = '';
                    var ord = _.find(orderModel.lstOrderInday, function(o) {return o.orderNo == el;});
                    htmlPopover += '<table class="tbl-pop"><tr>\
                                        <th>Thời gian</th>\
                                        <th>KL khớp</th>\
                                        <th>Giá khớp</th>\
                                    </tr>\
                                    <tr>\
                                        <td class="text-center">'+ord.orderTime+'</td>\
                                        <td class="text-right">'+Highcharts.numberFormat(ord.matchVolume, 0)+'</td>\
                                        <td class="text-right">'+Highcharts.numberFormat(ord.matchValue / (ord.matchVolume * 100), 2)+'</td>\
                                    </tr>\
                                </table>'
                    return htmlPopover;
                }
            }); 
        });
    } else {
        // co so
        var dataKhop = [];
        data.forEach(element => {
            let att = '';
            let txtStatus = getStatus(element.status);
            if(txtStatus == 'Đã khớp') {
                dataKhop.push(element.orderNo);
                att = 'rel="popover" data-placement="top"';
            }

            html += '<tr>\
                        <td class="text-center '+(element.side == 'B' ? 'buy' : 'sell')+'">'+(element.side == 'B' ? 'Mua' : 'Bán')+'</td>\
                        <td class="text-center" '+att+' id="panel-pop-order-'+element.orderNo+'">'+element.symbol+'</td>\
                        <td class="text-right">'+Highcharts.numberFormat(element.showPrice, 2)+'</td>\
                        <td class="text-right">'+Highcharts.numberFormat(element.volume, 0)+'</td>\
                        <td class="text-center">'+txtStatus+'</td>';
            if((element.orderNo > 0) && (element.status.indexOf('X') < 0) && txtStatus != 'Đã khớp'){
                html += '<td class="text-center td-act">\
                            <a href="javascript:void(0);" onclick="objOrder.actUpdateOrder('+element.orderNo+');" title="Sửa lệnh"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>\
                            <a href="javascript:void(0);" onclick="objOrder.actDeleteOrder('+element.orderNo+');" title="Hủy lệnh"><i class="fa fa-trash-o" aria-hidden="true"></i></a>\
                        </td></tr>';
            } else {
                html += '<td class="text-center"></td></tr>';
            }
        });

        $('#listOrder table tbody').html(html);
        dataKhop.forEach(el => {
            $("#panel-pop-order-" + el).popover({
                trigger: "hover",
                html : true, 
                content: function() {
                    var htmlPopover = '';
                    var ord = _.find(orderModel.lstOrderInday, function(o) {return o.orderNo == el;});
                    htmlPopover += '<table class="tbl-pop"><tr>\
                                        <th>Thời gian</th>\
                                        <th>KL khớp</th>\
                                        <th>Giá khớp</th>\
                                    </tr>\
                                    <tr>\
                                        <td class="text-center">'+ord.orderTime+'</td>\
                                        <td class="text-right">'+Highcharts.numberFormat(ord.matchVolume, 0)+'</td>\
                                        <td class="text-right">'+Highcharts.numberFormat(ord.matchValue / (ord.matchVolume * 1000), 2)+'</td>\
                                    </tr>\
                                </table>'
                    return htmlPopover;
                }
            }); 
        });
    }
}
/**
 * function update order by orderNo
 * @param {*} orderNo 
 */
objOrder.actUpdateOrder = function(orderNo){
    // get order by orderNo
    var ord = _.find(orderModel.lstOrderInday, function(o) {
        return o.orderNo == orderNo;
    });
    orderModel.orderUpdate = ord;
    console.log(JSON.stringify(ord));

    // update ordertype
    orderModel.orderType = 'UPDATE';
    
    // group EQ : mua/ bán
    // group FU : long/short
    $('a[href="#createOrder"]').click();
    if(ord.group == 'EQ'){
        // cơ sở
        // lấy thông tin mã chứng khoán
        $.getJSON(listStockDetailLink + ord.symbol.toUpperCase(),{},function(rData){
            if (rData != null){				
                orderModel.dataSym = rData[0];
            }
        },
        "jsonp"
        );

        // set giá trị
        $('#txt-sym-order').val(ord.symbol);
        $('#txt-vol-order').val(ord.volume);
        $('#txt-val-order').val(ord.showPrice);
        if(ord.side == "B"){
            $('#form-order .btn-long').addClass('active');
            $('#form-order .btn-short').removeClass('active');
            $('#form-order .btn-create-order').css({background: "rgb(68, 190, 36)"});
        } else {
            $('#form-order .btn-short').addClass('active');
            $('#form-order .btn-long').removeClass('active');
            $('#form-order .btn-create-order').css({background: "red"});
        }
    } else if(ord.group == 'FU'){
        // phai sinh
        if(!$('.tab a[href="#PhaiSinh"]').hasClass('.active')) {
            location.href = '#PhaiSinh';
            $('.tab a[href="#PhaiSinh"]').click();
        }
        $('#txt-sym-order').val(ord.symbol);
        $('#txt-vol-order').val(ord.volume);
        $('#txt-val-order').val(ord.showPrice);

        console.log(orderModel.orderUpdate,orderModel.orderType);
    }
}

/**
 * function delete order by orderNo
 * @param {*} orderNo 
 */
objOrder.actDeleteOrder = function(orderNo){
    var ord = _.find(orderModel.lstOrderInday, function(o) {
        return o.orderNo == orderNo;
    });

    orderModel.orderUpdate = ord;
    console.log(JSON.stringify(ord));

    // update ordertype
    orderModel.orderType = 'DELETE';
    //$('a[href="#createOrder"]').click();
    if(ord.group == 'EQ'){
        // cơ sở
        // set giá trị

        var cl = ord.side == "B" ? "rgb(68, 190, 36)" : "red";

        var html = '<div class="col-12">\
                        <table class="table color-table muted-table">\
                            <tr><td>Loại lệnh đặt</td><td colspan="2" style="font-weight: 600; font-size: 20px; color: '+cl+'">'+(ord.side == "B" ? "MUA" : "BÁN")+'</td></tr>\
                            <tr><td>Tài khoản</td><td colspan="2">'+$('#sel-account-order').val()+'</td></tr>\
                            <tr><td>Mã chứng khoán</td><td colspan="2">'+ord.symbol+'</td></tr>\
                            <tr><td>Mã PIN</td><td><input type="password" id="panel-del-pin" class="form-control" style="width: 150px;"></td>\
                                <td><input type="checkbox" id="panel-del-savepin" checked>&nbsp;<label for="panel-del-pin">Lưu pin</label></td></tr>\
                        </table>\
                    </div>\
                    <div class="col-12" style="display: flex; justify-content: center; margin-top: 20px;">\
                        <button class="btn btn-default" data-dismiss="modal">Hủy</button>\
                        <button class="btn btn-success" style="margin-left: 10px;">Thực hiện</button>\
                    </div>';

        $('.panel-delete-order .card-body').html(html);
        $('.panel-delete-order').modal();
        // $('#txt-sym-order').val(ord.symbol);
        // $('#txt-vol-order').val(ord.volume);
        // $('#txt-val-order').val(ord.showPrice);
        // if(ord.side == "B"){
        //     $('#form-order .btn-long').addClass('active');
        //     $('#form-order .btn-short').removeClass('active');
        //     $('#form-order .btn-create-order').css({background: "rgb(68, 190, 36)"});
        // } else {
        //     $('#form-order .btn-short').addClass('active');
        //     $('#form-order .btn-long').removeClass('active');
        //     $('#form-order .btn-create-order').css({background: "red"});
        // }
        // $('#form-order input[type="text"]').attr('disabled', 'disabled');
    } else if(ord.group == 'FU'){
        // phai sinh
        // $('#txt-sym-order').val(ord.symbol);
        // $('#txt-vol-order').val(ord.volume);
        // $('#txt-val-order').val(ord.showPrice);

        var cl = ord.side == "B" ? "rgb(68, 190, 36)" : "red";

        var html = '<div class="col-12">\
                        <table class="table color-table muted-table">\
                            <tr><td>Loại lệnh đặt</td><td colspan="2" style="font-weight: 600; font-size: 20px; color: '+cl+'">'+(ord.side == "B" ? "LONG" : "SHORT")+'</td></tr>\
                            <tr><td>Tài khoản</td><td colspan="2">'+$('#sel-account-order').val()+'</td></tr>\
                            <tr><td>Mã chứng khoán</td><td colspan="2">'+ord.symbol+'</td></tr>\
                            <tr><td>Mã PIN</td><td><input type="password" id="panel-del-pin" class="form-control" style="width: 150px;"></td>\
                                <td><input type="checkbox" id="panel-del-savepin" checked>&nbsp;<label for="panel-del-pin">Lưu pin</label></td></tr>\
                        </table>\
                    </div>\
                    <div class="col-12" style="display: flex; justify-content: center; margin-top: 20px;">\
                        <button class="btn btn-default" data-dismiss="modal">Hủy</button>\
                        <button class="btn btn-success" style="margin-left: 10px;">Thực hiện</button>\
                    </div>';

        $('.panel-delete-order .card-body').html(html);
        $('.panel-delete-order').modal();
    }
}

// danh mục
objOrder.getDanhmucAccount = function(){
    var accountSel = $('#sel-account-order').val();

    var pdata = {group:"Q",user:global.user,session:global.sid,data:{type:"string",cmd: accountSel.endsWith('8') ? "Web.Portfolio.PortfolioStatus2" : "Web.Portfolio.PortfolioStatus",p1:accountSel,p2:"",p3:"",p4:""}};
    $.ajax({
		type: "POST",
		url: urlCore,
		cache: false,
		data: JSON.stringify(pdata),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (vData) {
			console.log(vData);
			if (vData.rc == 1) {
				objOrder.processDanhmucAccount(vData.data);
			} else {
				console.log(vData);
                processRsError(vData.rc, vData.rs);
			}
		},
		error: function (e) {
			// error
		}
	});
}

objOrder.processDanhmucAccount = function(data){
    var accountSel = $('#sel-account-order').val();
    var totalHtml = '';
    var contentHtml = '';
    if(accountSel.endsWith('8')){
        // account phai sinh
        var st = '';        
        var total = 0;

        contentHtml = '<thead>\
                            <tr>\
                                <th>Mã CK</th>\
                                <th>KL</th>\
                                <th>Giá TB</th>\
                                <th>Lãi/Lỗ</th>\
                                <th></th>\
                            </tr>\
                        </thead><tbody>';

        data.forEach(element => {
            total += element.vmValue;
            var st = '';
            if(element.net > 0){
                st = 'style="background: #3a9d5d; cursor: pointer;" ';
                if (element.netoffvol != 0) {
                    st += ' onclick="objOrder.ClosePosition(\'' + element.symbol + '\', \'S\', \'' + Math.abs(element.netoffvol) + '\');"';
                }
            } else if (element.net < 0) {
                // short
                st = 'style="background: #f63c3a; cursor: pointer;" ';
                if (element.netoffvol != 0) {
                    st += ' onclick="objOrder.ClosePosition(\'' + element.symbol + '\', \'B\', \'' + Math.abs(element.netoffvol) + '\');"';
                }
            }
            contentHtml += '<tr>\
                                <td class="text-center">'+element.symbol+'</td>\
                                <td class="text-right" '+st+'>'+ (element.netoffvol == 0 ? '-' : Highcharts.numberFormat(element.netoffvol, 0))+'</td>\
                                <td class="text-right">'+ (element.netoffvol == 0 ? '-' : Highcharts.numberFormat(element.avg_remain, 4))+'</td>\
                                <td class="text-right">'+(element.vmValue == 0 ? "-" : Highcharts.numberFormat(element.vmValue, 0))+'</td>\
                                <td></td>\
                            </tr>';
        });

        totalHtml += '<tr>\
                        <td class="text-left" colspan="3">Tổng</td>\
                        <td class="text-right">'+Highcharts.numberFormat(total, 0)+'</td>\
                        <td></td>\
                    </tr>';
    } else {
        // normal account
        contentHtml = '<thead>\
                            <tr>\
                                <th>Mã CK</th>\
                                <th>KL</th>\
                                <th>Giá TB</th>\
                                <th>Lãi/Lỗ</th>\
                                <th>%Lãi/Lỗ</th>\
                                <th></th>\
                            </tr>\
                        </thead><tbody>';

        data.forEach(element => {
            if(element.symbol == 'TOTAL'){
                var cl = element.gain_loss_value.includes('-') ? 'd' : 'i';
                totalHtml += '<tr>\
                                <td class="text-left" colspan="3">Tổng</td>\
                                <td class="'+cl+' text-right">'+Highcharts.numberFormat(element.gain_loss_value, 0)+'</td>\
                                <td class="'+cl+' text-right">'+element.gain_loss_per+'</td>\
                                <td></td>\
                            </tr>';
            } else {
                var cl = element.gain_loss_value.includes('-') ? 'd' : 'i';
                contentHtml += '<tr>\
                                    <td class="text-center">'+element.symbol+'</td>\
                                    <td class="text-right">'+Highcharts.numberFormat(element.actual_vol, 0)+'</td>\
                                    <td class="text-right">'+Highcharts.numberFormat(element.avg_price, 4)+'</td>\
                                    <td class="'+cl+' text-right">'+Highcharts.numberFormat(element.gain_loss_value, 0)+'</td>\
                                    <td class="'+cl+' text-right">'+element.gain_loss_per+'</td>\
                                    <td>'+(StringToInt(element.avaiable_vol) > 0 ? '<input type="button" class="btn-sell" id="sel_'+element.symbol+'" value="BÁN">' : '')+'</td>\
                                </tr>';
            }
        });
    }

    $('#panel-order-danhmuc').html(contentHtml + '</tbody><tfoot>' + totalHtml + '</tfoot>');
}

// close position phai sinh
objOrder.ClosePosition = function(sym, type, vol){
    $('a[href="#createOrder"]').click();
    if(!$('.tab a[href="#PhaiSinh"]').hasClass('.active')) {
        location.href = '#PhaiSinh';
        $('.tab a[href="#PhaiSinh"]').click();

        // lấy thông tin mã chứng khoán
        $.getJSON(psDetailLink + sym.toUpperCase(),{},function(rData){
            if (rData != null){				
                $('#txt-sym-order').val(sym)
                $('#txt-vol-order').val(vol);
                $('#txt-val-order').val(rData[0].lastPrice);      
                // if(type=='S'){
                //     $('.form-order .btn-order-long').attr('disabled', 'disabled');
                // } else {
                //     $('.form-order .btn-order-short').attr('disabled', 'disabled');
                // }
            }
        },
        "jsonp"
        );
    } else{
        $('#txt-sym-order').val(sym)
        $('#txt-vol-order').val(vol);
        $('#txt-val-order').val($('#pri_' + sym).html());      
        // if(type=='S'){
        //     $('.form-order .btn-order-long').attr('disabled', 'disabled');
        // } else {
        //     $('.form-order .btn-order-short').attr('disabled', 'disabled');
        // }
    }

    return false;
}

/**
 * Create Order
 */
$(document).on('change', '#txt-sym-order', function() {
    var symSel = $(this).val();
    if(symSel == '') return false;
    else if($('#sel-account-order').val().endsWith('8')){
        $.getJSON(psDetailLink  + symSel, {}, function(rData) {
            if (rData != null){				
                orderModel.dataSym = rData[0];
                console.log(orderModel.dataSym);
                $('#txt-vol-order').val('1');
                $('#txt-val-order').val(orderModel.dataSym.lastPrice);
            }
        })
    } else {
        $.getJSON(listStockDetailLink + symSel.toUpperCase(),{},function(rData){
            if (rData != null){				
                orderModel.dataSym = rData[0];
                console.log(orderModel.dataSym);
                $('#txt-vol-order').val('10');
                $('#txt-val-order').val(orderModel.dataSym.lastPrice);
            }									
        },
        "jsonp"
        );
    }
})

 $(document).on('click', '.btn-create-order', function(){
    // orderModel.orderUpdate = ord;
    // orderModel.orderType = 'UPDATE';

    // get type order
    var typeOrder = $(this).attr('ty');

    if(objOrder.validateForm(typeOrder)){
        console.log(orderModel.orderCommand);
        if(orderModel.orderType == 'UPDATE'){
            // orderModel.orderCommand = { group: "O", user: global.user, session: global.sid, data: { type: "string", cmd: "Web.newOrder", account: $('#sel-account-order').val(), side: pSide, symbol: pSymbol.toUpperCase(), price: vPrice, volume: StringToInt(pVolume), advance: "", refId: refOrderID, orderType: pOrderType, pin: pPin } };
            orderModel.orderCommand.data.cmd = "Web.changeOrder";
            orderModel.orderCommand.data.orderNo = orderModel.orderUpdate.orderNo;
            orderModel.orderCommand.data.nvol = (StringToInt(orderModel.orderCommand.data.volume) + StringToInt(orderModel.orderUpdate.matchVolume));
            orderModel.orderCommand.data.nprice = orderModel.orderCommand.data.price + "";
            orderModel.orderCommand.data.fisID = "";
        } else if(orderModel.orderType == 'DELETE'){
            orderModel.orderCommand.data.cmd = "Web.cancelOrder";
            orderModel.orderCommand.data.orderNo = orderModel.orderUpdate.orderNo;
            orderModel.orderCommand.data.fisID = "";
        }
        $.ajax({
            type: "POST",
            url: urlCore,
            cache: false,
            data: JSON.stringify(orderModel.orderCommand),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            timeout: 1000,
            success: function (vData) {
                console.log(vData);
                if(vData.rc > 0){
                    shownotification('Success', 'Lệnh đã được gửi thành công.', 'success');
                    $('#createOrder input[type="text"]').val('').removeAttr('disabled');      
                    orderModel.orderType = 'NEW';     
                    // $('#createOrder input[type="password"]').val('');                    
                } else{
                    shownotification('Warning', getMessageConfirm(vData.rc), 'warning');
                }
            },
            error: function (err) {

            }
        });
    }
 })

/**
 * validate order
 */ 
objOrder.validateForm = function(type){
    var numbers = /^[0-9]+$/;
    if(type == 'normal'){
        // lệnh thường
        var pSymbol = $('#txt-sym-order').val();
        var pVolume  =$('#txt-vol-order').val().replaceAll(',', '');
        var vPrice = $('#txt-val-order').val().replaceAll(',', '').toUpperCase();
        var pPin = $('#txt-pin-order').val();

        // console.log(pSymbol, vol, vPrice);
        if(orderModel.orderType != 'DELETE'){
            if(pSymbol == ''){
                shownotification('Warning', 'Mã chứng khoán không được để trống!', 'warning');
                $('#txt-sym-order').focus();
                return false;
            }
            var dtSym = _.find(modal.listIndex, function(o){ return o.stock_code == pSymbol.toUpperCase(); });
            if(dtSym == null){
                shownotification('Warning', 'Mã chứng khoán không tồn tại!', 'warning');
                $('#txt-sym-order').focus();
                return false;
            }
    
            if(!pVolume.match(numbers))
            {
                shownotification('Warning', 'Khối lượng phải là số >= 10', 'warning');
                $('#txt-vol-order').focus();
                return false;
            }
            if(StringToInt(pVolume) < 10){
                shownotification('Warning', 'Khối lượng phải là số >= 10', 'warning');
                $('#txt-vol-order').focus();
                return false;
            }
    
            if(vPrice == ''){
                shownotification('Warning', 'Giá đặt không được để trống.', 'warning');
                $('#txt-val-order').focus();
                return false;
            } else if(vPrice != 'MOK' && vPrice != 'MAK' && vPrice != 'MTL' && vPrice != 'ATO' && vPrice != 'ATC'){
                if(StringToFloat(vPrice) > StringToFloat(orderModel.dataSym.c)){
                    shownotification('Warning', 'Giá đặt không được lớn hơn giá trần: ' + orderModel.dataSym.c, 'warning');
                    $('#txt-val-order').focus();
                    return false;
                } else if(StringToFloat(vPrice) < StringToFloat(orderModel.dataSym.f)){
                    shownotification('Warning', 'Giá đặt không được nhỏ hơn giá sàn: ' + orderModel.dataSym.f, 'warning');
                    $('#txt-val-order').focus();
                    return false;
                }
            } 
        }
        if(pPin == ''){
            shownotification('Warning', 'Mã PIN không được để trống.', 'warning');
            $('#txt-pin-order').focus();
            return false;
        }
        var pSide = $('.btn-second.btn-long').hasClass('active') ? "B" : "S";
        var refOrderID = global.user + '.H.' + getRandom();
        var pOrderType = '1';
        orderModel.orderCommand = { group: "O", user: global.user, session: global.sid, data: { type: "string", cmd: "Web.newOrder", account: $('#sel-account-order').val(), side: pSide, symbol: pSymbol.toUpperCase(), price: vPrice, volume: StringToInt(pVolume), advance: "", refId: refOrderID, orderType: pOrderType, pin: pPin } };
    } else {
        // phái sinh
        var pSymbol = $('#txt-sym-order').val();
        var pVolume  =$('#txt-vol-order').val().replaceAll(',', '');
        var vPrice = $('#txt-val-order').val().replaceAll(',', '').toUpperCase();
        var pPin = $('#txt-pin-order').val();
        var pOrderType = '0';
        var pSide = type == 'long' ? "B" : "S";
        var refOrderID = global.user + '.H.' + getRandom();

        if(orderModel.orderUpdate.side != pSide) {
            orderModel.orderType = "NEW";
        }

        if(!pVolume.match(numbers))
        {
            shownotification('Warning', 'Hãy nhập số hợp đồng', 'warning');
            $('#txt-vol-order').focus();
            return false;
        }
        if(StringToInt(pVolume) < 0){
            shownotification('Warning', 'Hãy nhập số hợp đồng', 'warning');
            $('#txt-vol-order').focus();
            return false;
        }
    
        if($('.sub-cond-proc.active .tit-content.active').length > 0){
            // check lenh dieu kien
            var tyOrderCond = $('.sub-cond-proc.active .btn-cond.active').attr('ty');
            if(tyOrderCond == 'SLTP'){
                // stop lost / take profit
                var txtStopLost = $('#txt-stopLost').val();
                var txtTakeProfit = $('#txt-takeProfit').val();
                pOrderType = "SLP=" + txtStopLost.replace(',', '.') + ',' + txtTakeProfit.replace(',', '.');
            } else if(tyOrderCond == 'AB'){
                // Arbitrage
                var txtAB = $('#txt-sym-ab').val();
                if(txtAB == $('#txt-sym-order').va()){
                    shownotification('Warning', 'Mã đối ứng không được trùng.', 'warning');
                    $('#txt-sym-order').focus();
                    return false;
                } else {
                    pOrderType = "ABI=" + txtAB;
                }
            } else if(tyOrderCond == 'SO'){
                // Stop Order
                var selSOType = $('#sel-so-type option:selected').val();
                var txtSO = $('#txt-so-pri-start').val();
                pOrderType = "ADV=" + formatDate(new Date()) + selSOType + '=' + txtSO.replace(',', '.');
            }
        }
        if(pPin == ''){
            shownotification('Warning', 'Mã PIN không được để trống.', 'warning');
            $('#txt-pin-order').focus();
            return false;
        }
        var pData = '';
        var chkSum = '';
        if(orderModel.orderType == 'UPDATE'){
            pData = {type:"string",cmd:"Web.changeOrder",orderNo: orderModel.orderUpdate.orderNo + "",refId: refOrderID + "",fisID:"",orderType:"1",pin:pPin + "",nvol: StringToInt(pVolume),nprice: vPrice + ""};
            chkSum = checkSumChangeOrder(global.sid, pData);
            orderModel.orderType = 'NEW';
        } else {
            pData = { type: "string", cmd: "Web.newOrder", account: $('#sel-account-order').val(), side: pSide, symbol: pSymbol.toUpperCase(), price: vPrice, volume: StringToInt(pVolume), advance: "", refId: refOrderID, orderType: pOrderType, pin: pPin };
            chkSum = checkSum(global.sid, pData);
        }

        orderModel.orderCommand = { group: "FD", user: global.user, session: global.sid, checksum: chkSum, data: pData};
    }
    return true;
}

$('#txt-val-order').on('blur', function() {
    var pPrice = $(this).val().replaceAll(',', '');
    var pVol = $(this).val().replaceAll(',', '');
    if(pPrice == '' || pVol == '') return false;
})

function processRsError(c, s){
    if(c == -1){
        if(s.includes('InvalidSessionException')){
            shownotification('Warning', 'Hệ thông yêu cầu đăng nhập lại để tiếp tục.', 'warning');
            document.cookie = "USER=zombie";
            document.cookie = "JSESSION=zombie";
            
            global = {user:"", sid:"", accounts:null};
            $('.panel-order').toggle();                    
            $('.panel-login').modal();
        }
    } else {
        shownotification('Warning', s, 'warning');
    }
}

$(document).on('submit', '#form-create-order', function(e) {
    // console.log(e);
    e.preventDefault();
    return false;
})
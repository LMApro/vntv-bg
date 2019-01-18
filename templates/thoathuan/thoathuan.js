

objPage.init = function () {
    console.log("Init thoa thuan");

    initListStock();
    gtTTVal = 0;
    getdsthoathuan();
    initSocketTT();
    allTxtLangCol.forEach(element => {
        $('.' + element).text(getMessage(element));	
    });
}

objPage.destroy = function(){
    console.log("Destroy thỏa thuận");
	objPage = null;
}

getdsthoathuan = function(){
    $.getJSON(listThoaThuanLink, {}, function (zdata) {
		if (zdata != null) {
            $('#thoathuan-benmua tbody').html('');
            processThoaThuan(zdata);
		}
	},
		"jsonp"
	);
}

processThoaThuan = function(idata){
    let totalVolGDTT = 0;
    var dtSort = _.sortBy(idata, 'time');
    idata = dtSort.reverse();
    idata.forEach(el => {
        if(el.type == 'PTM' && el.volume > 0){
            // khớp lệnh
            var htmlM = '<tr>';
            htmlM += '<td class="'+el.color+'">'+el.sym+'</td>';
            htmlM += '<td class="txt-right '+el.color+'">'+Highcharts.numberFormat(el.price, 2)+'</td>';
            htmlM += '<td class="txt-right txt-gia-tc">'+Highcharts.numberFormat(el.volume, 0)+'</td>';
            htmlM += '<td class="txt-right txt-content">'+Highcharts.numberFormat(el.value, 0)+'</td>';
            htmlM += '<td class="text-center txt-content">'+el.time+'</td>';
            htmlM += '</tr>';
            $('#thoathuan-khoplenh tbody').append(htmlM);
            gtTTVal += el.value;
            totalVolGDTT += el.volume;
        } else if(el.type =='PTS'){
            // bên bán
            var htmlS = '<tr>';
            htmlS += '<td class="'+el.color+'">'+el.sym+'</td>';
            htmlS += '<td class="txt-right '+el.color+'">'+ Highcharts.numberFormat(el.price, 2)+'</td>';
            htmlS += '<td class="txt-right txt-content">'+Highcharts.numberFormat(el.volume, 0)+'</td>';
            htmlS += '<td class="txt-center txt-content">'+el.time+'</td>';
            htmlS += '</tr>';
            $('#thoathuan-benban tbody').append(htmlS);
        }  else if(el.type =='PTB') {
            // bên mua
            var htmlB = '<tr>';
            htmlB += '<td class="'+el.color+'">'+el.sym+'</td>';
            htmlB += '<td class="txt-right '+el.color+'">'+ Highcharts.numberFormat(el.price, 2)+'</td>';
            htmlB += '<td class="txt-right txt-content">'+Highcharts.numberFormat(el.volume, 0)+'</td>';
            htmlB += '<td class="txt-center txt-content">'+el.time+'</td>';
            htmlB += '</tr>';
            $('#thoathuan-benmua tbody').append(htmlB);
        }
    });
    
    // var mainTable = document.getElementById('thoathuan-khoplenh');
    // var thead = mainTable.children[0];
    // console.log(mainTable, thead, thead.children[1]);
    var htmlKL = '  <tr>\
                        <th colspan="5" class="txtKhopLenh">'+getMessage('txtKhopLenh')+'</th>\
                    </tr>\
                    <tr>\
                        <th colspan="5"><span class="txtTotalKLGD">'+getMessage('txtTotalKLGD')+'</span>'+Highcharts.numberFormat(totalVolGDTT, 0)+
                        '&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;<span class="txtTotalGTGD">'+getMessage('txtTotalGTGD')+'</span>'+Highcharts.numberFormat(gtTTVal/1000000, 0) + ' <span class="txtTy">'+getMessage('txtTy')+'</span>'+'</th>\
                    </tr>\
                    <tr>\
                        <th class="txtMaCK">'+getMessage('txtMaCK')+'</th>\
                        <th class="txtGia">'+getMessage('txtGia')+'</th>\
                        <th class="txtKhoiLuong">'+getMessage('txtKhoiLuong')+'</th>\
                        <th class="txtGiaTri">'+getMessage('txtGiaTri')+'</th>\
                        <th class="txtThoiGian">'+getMessage('txtThoiGian')+'</th>\
                    </tr>';
    // thead.insertBefore($('<tr><th colspan="5">Tổng KL GDTT: '+Highcharts.numberFormat(totalVolGDTT, 0)+
    //                     'Tổng giá trị GDTT: '+Highcharts.numberFormat(gtTTVal/1000000, 0) + ' tỷ'+'</th></tr>'), thead.children[1]);
    $('#thoathuan-khoplenh thead').html(htmlKL);
    $('#sum2MarketTTValue').html(Highcharts.numberFormat(gtTTVal/1000000, 0) + ' <span class="txtTy">'+getMessage('txtTy')+'</span>');
}

function initSocketTT(){
    if(socket == null || socket == 'undefined'){
        socket = io(socketLink);
        // socket = io("10.32.48.109");
        socket.on("connect", function(dt){
            console.log("CONNECT");
            $('#status-connect').text('Connected').css('color', '#50C979');
        });
    } else {
        var dmck = $.jStorage.get("DANH-MUC-CHUNG-KHOAN", []);
	    var idata = _.find(dmck, function (o) { return o.active == true });
        if(idata != null){
            // đăng ký lại room
            var msg = "{\"action\":\"leave\",\"list\":\""+ idata.symbols.join(',') +"\"}";
            socket.emit('regs', msg);
        }
        if(vStockPs != null && vStockPs != 'undefined'){
            // đăng ký lại room
            var msg = "{\"action\":\"leave\",\"list\":\""+ vStockPs.join(',') +"\"}";
            socket.emit('regs', msg);
        }
    }

    socket.on('disconnect', () => {
        socket.open();
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    });
    socket.on('connect_error', () => {
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    } );
    socket.on('reconnect_error', () => {
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    } );
    socket.on('reconnect', () => {
        socketConnectTT();
        $('#status-connect').text('Connected').css('color', '#50C979');
    } );

    socketConnectTT();
}

function socketConnectTT(){
    socket.on("spt", function(zdata){
        // sendQueue(zdata)
        processTT(zdata.data);
    });
	
	socket.on("index", function(zdata){
		sendQueue(zdata.data)
	});
    socket.on("snews", function(zdata){
		processNews(zdata.data)
    });
    initGlobalIndexSocket();
}

// load info box
function initListStock() {
    $('.mini-index').html('');
    $('.mini-bottom-index').html('');
    $.getJSON(indexDetailLink,{},function(rData){
        if (rData != null){			
            var htmlIndex = '';
            rData.forEach(element => {
                if(element != null){
                    if(element.mc == '10'){
                        objOIndex.HSXOINDEX = element.oIndex;
                        gdVNI = element.value;
                    }
                    else if(element.mc == '02'){
                        objOIndex.HNXOINDEX = element.oIndex;
                        gdHNX = element.value;
                    }
                    else if(element.mc == '03'){
                        objOIndex.UPCOMOINDEX = element.oIndex;
                    }
                    else if(element.mc == '11'){
                        objOIndex.VN30OINDEX = element.oIndex;
                    }
                    else if(element.mc == '12'){
                        objOIndex.HSX30OINDEX = element.oIndex;
                    }
                    htmlIndex += processIndex(element);    
                    var htmlMini = processMiniIndex(element);
                    $('.mini-index').append(htmlMini);
                    $('.mini-bottom-index').append(htmlMini);
                }
            });
            $('#sum2MarketValue').html(Highcharts.numberFormat((StringToInt(gdVNI) + StringToInt(gdHNX)) / 1000, 0) + ' <span class="txtTy">'+getMessage('txtTy')+'</span>');
            $('#table-stock-index tbody').html(htmlIndex);
        }									
    },
    "jsonp"
    );
    completeUI();
}


arrVolumB = [];
arrVolumS = [];

objPage.init = function () {
    console.log("Init phai sinh");
    iUnit = 100;
	objPage.loadPhaisinh();
    initListStock();
    // startTime();
    allTxtLangCol.forEach(element => {
        $('.' + element).text(getMessage(element));	
    });
}

objPage.destroy = function(){
    console.log("Destroy cơ sở");
	objPage = null;
}

objPage.loadPhaisinh = function () {
    
    $.getJSON(psListLink,function(zdata){
        zdata.sort();
        $('#tbodyPhaisinhContent').html('');
        $('#chartFrame').attr('src', '/psChart/index.html?gSymbol=' + zdata[0]);
        symbol10Gia = zdata[0];
        $('#cur-sym-10').text(zdata[0]);
        vStockPs = zdata;
        loadPsDetail(zdata);
    },"jsonp");
}

function loadPsDetail(psStockList){
    $.getJSON(psDetailLink + psStockList.join(','),function(zdata){
        psStockList.forEach(element => {
            var data = _.filter(zdata, function (dt) { return dt.sym == element; });
            // console.log(JSON.stringify(data[0]));
            initPsBoard(data[0]);
        });

        initSocketPs(psStockList.join(','));

        get10price(symbol10Gia, 'S');
        get10price(symbol10Gia, 'B');

        $('.changePc').toggle();

        // console.log($('.main').outerHeight(), $('.table-responsive').outerHeight());
        $('.bottom-panel').css('height', $('.main').outerHeight() - $('.table-responsive').outerHeight());
        $('.txt-head').on('click', function(){
            var sysm = $(this).text();
            $('#cur-sym-10').text(sysm);
            var msg = { symbolChart: sysm };
            if (symbol10Gia != sysm) {
                symbol10Gia = sysm;
                get10price(symbol10Gia, 'S');
                get10price(symbol10Gia, 'B');
            }
            // init10Gia();
            objPage.sendMessage(JSON.stringify(msg));
        })
    },"jsonp");
}

function initSocketPs(data){
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
        socketConnectPs(data);
        $('#status-connect').text('Connected').css('color', '#50C979');
    } );

    socketConnectPs(data);
}

function socketConnectPs(data){
    console.log('connect - ' + data);
    var msg = "{\"action\":\"join\",\"list\":\""+ data +"\"}";
    socket.emit('regs', msg); 

    socket.on("boardps", function(zdata){
		try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
		sendQueue(rs.data)
	});
	
	socket.on("index", function(zdata){
        try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
		sendQueue(rs.data)
	});
	
	socket.on("stockps", function(zdata){
        try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
		sendQueue(rs.data)
    });

    socket.on("stockps10price", function(zdata){
        // sendQueue(zdata)
        process10Gia(zdata);
    });
    
    socket.on("snews", function(zdata){
        try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
		processNews(rs.data)
    });

    socket.on("spt", function(zdata){
        // sendQueue(zdata)
        try {
            var rs = JSON.parse(zdata);
        } catch (error) {
            rs = zdata;
        }
        processTT(rs.data);
    });

    // khối lượng nước ngoài mua
    socket.on("psfbuy", function(zdata){
        console.log('fbuy' + zdata);    
    });

    // khối lượng nước ngoài bán
    socket.on("psfsell", function(zdata){
        console.log('fsell' + zdata);    
    });

    initGlobalIndexSocket();
}

// load info box
function initListStock() {
    $('.mini-index').html('');
    $('.mini-bottom-index').html('');
    $.getJSON(indexDetailLink,function(rData){
        // console.log(rData);
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

function bindEvent(element, eventName, eventHandler) {
	if (element.addEventListener) {
		element.addEventListener(eventName, eventHandler, false);
	} else if (element.attachEvent) {
		element.attachEvent('on' + eventName, eventHandler);
	}
}

var iframeEl = document.getElementById('chartFrame');
// Send a message to the child iframe
objPage.sendMessage = function (msg) {
	// Make sure you are sending a string, and to stringify JSON
	if(iframeEl != null)
		iframeEl.contentWindow.postMessage(msg, '*');
};

bindEvent(window, 'message', function (e) {
	if (e.data == 'Loaded') {
		$('.preloaderChart').fadeOut();
	}
});

process10Gia = function (idata) {
	// "933.50:24SOH933.80:21SOH933.90:16SOH934:94SOH934.10:1SOH934.30:9SOH934.40:24SOH934.50:26SOH934.60:3SOH934.70:1SOH
	// console.log(idata);

	// gía tham chiếu
	var giathamchieu = $('#ref_' + idata.sym).html();
	var giatran = $('#cel_' + idata.sym).html();
	var giasan = $('#flo_' + idata.sym).html();
	arrVolumB = [];
	arrVolumS = [];
	// var symDate = new Date(idata.date.replaceAll('/', '-'));
	var symHours = new Date().getHours();

	if (symbol10Gia == idata.sym) {
		var data = idata.ndata.split('SOH');
		var htmlBody = '';
		$.each(data, function (i, item) {
			if (i < data.length - 1) {
				var dt = item.split(':');
				if (idata.side == 'B') {
					var priceSym = dt[0] == '0' ? (symHours >= 12 ? 'ATC' : 'ATO') : Highcharts.numberFormat(dt[0], 2);
					htmlBody += '<tr id="10giaB' + i + '"><td style="color: '+getColor('t')+';border: 1px solid #282c3c; border-right: 0;" class="text-center">' + dt[1] + '</td><td style="cursor: pointer;border: 1px solid #282c3c; border-left: 0; padding-right: 5px;color: ' + getColor10Gia(giathamchieu, giatran, giasan, dt[0]) + '" class="text-center" >' + priceSym + '</td></tr>';
					updateArrVolumn(arrVolumB, i, dt[1]);
				} else {
					var priceSym = dt[0] == '0' ? (symHours >= 12 ? 'ATC' : 'ATO') : Highcharts.numberFormat(dt[0], 2);
					htmlBody += '<tr id="10giaS' + i + '"><td style="cursor: pointer; border: 1px solid #282c3c; border-right: 0; padding-right: 5px;color: ' + getColor10Gia(giathamchieu, giatran, giasan, dt[0]) + '" class="text-center" >' + priceSym + '</td><td style="color: '+getColor('t')+';border: 1px solid #282c3c; border-left: 0;" class="text-center">' + dt[1] + '</td></tr>';
					updateArrVolumn(arrVolumS, i, dt[1]);
				}
			}
		});
		$('#ngiaIndex' + idata.side + 'Content').html(htmlBody);
		updateChart(idata.side);
	}
}

updateArrVolumn = function (arr, index, value) {
	if (arr.length == index) {
		return arr.push(value);
	} else {
		return arr.splice(index, 0, value);
	}
}

updateChart = function (type) {
	if (type == 'S') {
		var sumS = _.reduce(arrVolumS, function (memo, num) { return StringToInt(memo) + StringToInt(num); }, 0);
		// console.log(sumS);
		$.each(arrVolumS, function (i, data) {
            var per = Math.floor(StringToInt(data) / sumS * 100);

            var bk = '-webkit-linear-gradient(left, #381819 0, rgb(105, 38, 41) ' + per + '%, transparent ' + per + '%)';
            // var bk1 = '-o-linear-gradient(left, #381819 0, rgb(105, 38, 41) ' + per + '%, transparent ' + per + '%)';
            // var bk2 = '-moz-linear-gradient(left, #381819 0, rgb(105, 38, 41) ' + per + '%, transparent ' + per + '%)';
            // var bk3 = 'linear-gradient(left, #381819 0, rgb(105, 38, 41) ' + per + '%, transparent ' + per + '%)';

            $('#10giaS' + i).css({
                'background': bk
            });
		});
	} else {
		var sumB = _.reduce(arrVolumB, function (memo, num) { return StringToInt(memo) + StringToInt(num); }, 0);
		// console.log(sumB);
		$.each(arrVolumB, function (i, data) {
			var per = Math.floor(StringToInt(data) / sumB * 100);
            var bk = '-webkit-linear-gradient(right, #1A2622 0, rgb(30, 74, 59) ' + per + '%, transparent ' + per + '%)';
            // var bk1 = '-o-linear-gradient(right, #1A2622 0, rgb(30, 74, 59) ' + per + '%, transparent ' + per + '%)';
            // var bk2 = '-moz-linear-gradient(right, #1A2622 0, rgb(30, 74, 59) ' + per + '%, transparent ' + per + '%)';
            // var bk3 = 'linear-gradient(right, #1A2622 0, rgb(30, 74, 59) ' + per + '%, transparent ' + per + '%)';
            $('#10giaB' + i).css({
                'background': bk
            });
		});
	}
}

get10price = function(stock, type){
    $.getJSON(ps10pricesnapshotLink + stock + ',' + type,
        function(zdata){	
            if (zdata != null){
                process10Gia(zdata);
            }
            else{
                return;
            }
        },
        "jsonp"
    );   
}
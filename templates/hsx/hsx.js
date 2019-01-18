var timelineComponents;

objPage.init = function(){
    iUnit = 10;
    $('.preloader').toggle();
    // load danh sach ma chung khoan hose
    if(dsHSXIndex == ''){
        $.ajaxSetup({ "async": false });
        $.getJSON(getListCKIndex + 'hose',function(rData){
            dsHSXIndex = rData.join(',');								
            initWebsocket();
        },
        "jsonp"
        );
        $.ajaxSetup({ "async": true });
    } else {
        initWebsocket();
    }    
    completeUI();
    objPage.initBanggia();
    // load info box
    loadIndexBox();
}

objPage.destroy = function(){
    console.log("Destroy cơ sở");
	objPage = null;
}

objPage.initBanggia = function(){
    var column_show = $.jStorage.get("COLUMN_SETTING_SHOW", ['total-volumn', 'dumua', 'duban', 'ave', 'hight', 'low', 'quote']);
    var htmlTable   = '';
    var htmlSecond  = '';
    var theadFirst  = '';
    var theadSecond = '';
    htmlTable += '<colgroup>';
    htmlTable += '<col class="col-symbol">';
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-vol">';                                
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-vol">';
    htmlTable += '<col class="col-price">';                                
    htmlTable += '<col class="col-vol">';
    htmlTable += '<col class="col-price">'; 
    htmlTable += '<col class="col-diff">';                                                               
    htmlTable += '<col class="col-vol">';                            
    htmlTable += '<col class="col-price">';
    htmlTable += '<col class="col-vol">\
                  <col class="col-price">\
                  <col class="col-vol">\
                  <col class="col-price">\
                  <col class="col-vol">';
    column_show.forEach(element => {
        if(element == 'quote'){
            theadFirst += '<th data-sorter="false" colspan="2" class="txtDTNN">'+getMessage('txtDTNN')+'</th>';
            theadSecond += '<th data-sorter="false" class="col-vol txtDTNNMua">'+getMessage('txtDTNNMua')+'</th>';
            theadSecond += '<th data-sorter="false" class="col-vol txtDTNNBan">'+getMessage('txtDTNNBan')+'</th>';
            htmlTable += '<col class="col-vol"><col class="col-vol">';
        } else {
            htmlTable += '<col class="col-'+element+'">';
            theadFirst += '<th '+(element == 'total-volumn' ? "" : 'data-sorter="false"')+' class="txt'+element+' col-'+element +''+((element == 'ave' || element ==  'hight' || element == 'low') ? " cell-highlight" : "")+'" rowspan="2">'+getMessage('txt'+element)+'</th>';
        }
    });
    htmlTable += '</colgroup>';
    htmlSecond = htmlTable;
    htmlSecond += '<thead class="thead-cs" style="display: none;">';
    htmlTable += '<thead class="thead-cs">';
    // <i class="active fa fa-plus" aria-hidden="true"></i><input type="text" placeholder="Thêm mã CK">
    var htmlTableHead = '<tr><th rowspan="2" class="col-symbol txtMaCK">'+getMessage('txtMaCK')+'</th>';
    htmlTableHead += '<th data-sorter="false" rowspan="2" class="cell-highlight col-price txtThamChieu">'+getMessage('txtThamChieu')+'</th>';
    htmlTableHead += '<th data-sorter="false" rowspan="2" class="cell-highlight col-price txtTran">'+getMessage('txtTran')+'</th>';
    htmlTableHead += '<th data-sorter="false" rowspan="2" class="cell-highlight col-price txtSan">'+getMessage('txtSan')+'</th>';
    htmlTableHead += '<th data-sorter="false" colspan="6" class="txtBenMua">'+getMessage('txtBenMua')+'</th>';
    htmlTableHead += '<th data-sorter="false" colspan="3" class="cell-highlight txtKhopLenh">'+getMessage('txtKhopLenh')+'</th>';
    htmlTableHead += '<th data-sorter="false" colspan="6" class="txtBenBan">'+getMessage('txtBenBan')+'</th>';
    htmlTableHead += theadFirst + '</tr>';

    htmlTableHead += '<tr>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 3</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 3</th>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 2</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 2</th>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 1</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 1</th>';
    htmlTableHead += '<th data-sorter="false" class="cell-highlight col-price"><span class="txtGia">'+getMessage('txtGia')+'</th>';
    htmlTableHead += '<th data-sorter="false" class="cell-highlight col-diff"><span class="caret-left" onclick="showChange();"><i class="fa fa-caret-left" aria-hidden="true"></i></span><span class="changeOt">+/-</span><span class="changePc" style="display: none;">%</span><span class="caret-right" onclick="showChange();"><i class="fa fa-caret-right" aria-hidden="true"></i></span></th>';
    htmlTableHead += '<th data-sorter="false" class="cell-highlight col-price"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</th>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 1</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 1</th>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 2</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 2</th>';
    htmlTableHead += '<th data-sorter="false" class="col-price"><span class="txtGia">'+getMessage('txtGia')+'</span> 3</th>';
    htmlTableHead += '<th data-sorter="false" class="col-vol"><span class="txtGia">'+getMessage('txtKhoiLuong')+'</span> 3</th>';
    htmlTableHead += theadSecond + '</tr></thead>';
	$('.tbl-fix-header table').html(htmlTable + htmlTableHead);
	htmlSecond += htmlTableHead + '<tbody id="sortable-banggia"></tbody>';
    $('#tbl-cs').html(htmlSecond);

    $( "#sortable-banggia" ).sortable();
    $( "#sortable-banggia" ).disableSelection();

    $( "#sortable-banggia" ).sortable({
        update: function( ) {
            console.log('update');
            var sym = [];
            $('#sortable-banggia tr').each(function(){
                sym.push($(this).attr('id').replace('row_', ''));
            })
            // var data = {name:'Danh mục mặc định',symbols:sym};
            // $.jStorage.set('DANH-MUC-MAC-DINH',data);
            var dmck = $.jStorage.get("DANH-MUC-CHUNG-KHOAN", []);
            dmck.forEach(element => {
                if(element.active) element.symbols = sym;
            });
            $.jStorage.set('DANH-MUC-CHUNG-KHOAN',dmck);
            // update fb client
            if(faceId != null && faceId != 'undefined'){
                saveStateFace(faceId.id, dmck, $.jStorage.get('COLUMN_SETTING_SHOW'), settingUI.addStockPosition);
            }
        }
    });

    // loadDanhmucMacdinh()
    initListStock();
    $('.tbl-fix-header table .thead-cs .txtMaCK').click(function(){
        $('#tbl-cs .thead-cs .txtMaCK').click();
        $('.sortTotalVol').text('');
        if($(this).find('span').length !== 0){
            if($('.sortMaCK').hasClass('descending')){
                $('.sortMaCK').removeClass('descending').addClass('ascending').html('<i class="fa fa-caret-down" aria-hidden="true"></i>');
            } else {
                $('.sortMaCK').removeClass('ascending').addClass('descending').html('<i class="fa fa-caret-up" aria-hidden="true"></i>');
            }
        } else {
            $(this).append('<span class="sortMaCK descending"><i class="fa fa-caret-up" aria-hidden="true"></i></span>');
        }
    });
    $('.tbl-fix-header table .thead-cs .txttotal-volumn').click(function(){
        $('#tbl-cs .thead-cs .txttotal-volumn').click();
        $('.sortMaCK').text('');
        if($(this).find('span').length !== 0){
            if($('.sortTotalVol').hasClass('descending')){
                $('.sortTotalVol').removeClass('ascending').addClass('descending').html('<i class="fa fa-caret-down" aria-hidden="true"></i>');
            } else {
                $('.sortTotalVol').removeClass('descending').addClass('ascending').html('<i class="fa fa-caret-up" aria-hidden="true"></i>');
            }
        } else {
            $(this).append('<span class="sortTotalVol descending"><i class="fa fa-caret-up" aria-hidden="true"></i></span>');
        }
    });
}


function initWebsocket(){
    if(socket == null || socket == 'undefined'){
        socket = io(socketLink);
        socket.on("connect", function(data){
            console.log("CONNECT");
            $('#status-connect').text('Connected').css('color', '#50C979');
        });
        
    } else {
        if(vStockPs != null && vStockPs != 'undefined'){
            // đăng ký lại room
            var msg = "{\"action\":\"leave\",\"list\":\""+ vStockPs.join(',') +"\"}";
            socket.emit('regs', msg);
        }
        var dmck = $.jStorage.get("DANH-MUC-CHUNG-KHOAN", []);
	    var idata = _.find(dmck, function (o) { return o.active == true });
        if(idata != null){
            // đăng ký lại room
            var msg = "{\"action\":\"leave\",\"list\":\""+ idata.symbols.join(',') +"\"}";
            socket.emit('regs', msg);
        }
    }

    socket.on('disconnect', () => {
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    });
    socket.on('connect_error', () => {
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    } );
    socket.on('reconnect_error', () => {
        $('#status-connect').text('Disconnect').css('color', '#DA5664');
    } );

    socket.on('reconnect', () =>{
        socketConnect();
        $('#status-connect').text('Connected').css('color', '#50C979');
    });

    socketConnect();
}

function socketConnect(){
    var msg = "{\"action\":\"join\",\"list\":\""+ dsHSXIndex +"\"}";
    socket.emit('regs', msg);

	socket.on("board", function(zdata){
		sendQueue(zdata.data)
	});
	
	socket.on("index", function(zdata){
		sendQueue(zdata.data)
	});
	
	socket.on("stock", function(zdata){
		sendQueue(zdata.data)
    });
    socket.on("snews", function(zdata){
		processNews(zdata.data)
    });

    socket.on("spt", function(zdata){
        processTT(zdata.data);
    });
    initGlobalIndexSocket();
}
function loadIndexBox(){
    $('.mini-index').html('');
    $('.mini-bottom-index').html('');
    $.getJSON(indexDetailLink,function(rData){
        // console.log(rData);
        if (rData != null){		
            var totalGD = 0;	
            var htmlIndex = '';
            $('#table-stock-index tbody').html('');
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
                    htmlIndex = processIndex(element);    
                    $('#table-stock-index tbody').append(htmlIndex);
                    var htmlMini = processMiniIndex(element);
                    $('.mini-index').append(htmlMini);
                    $('.mini-bottom-index').append(htmlMini);
                }
            });
            $('#sum2MarketValue').html(Highcharts.numberFormat((StringToInt(gdVNI) + StringToInt(gdHNX)) / 1000, 0) + ' <span class="txtTy">'+getMessage('txtTy')+'</span>');
            // $('#table-stock-index tbody').html(htmlIndex);
        }									
    },
    "jsonp"
    );
}

function initListStock() {
    $('#sortable-banggia').html('');
    vStockListSelected = dsHSXIndex;

    var abc = dsHSXIndex.split(',');
    var count = Math.ceil(abc.length / 30);
    //objPage.callStockPage(0, count, abc);
    objPage.callStockPage(0, count, abc);
    $(window).trigger('resize');
}

objPage.callStockPage = function(i, c, l){
    var lst = l.slice(i * 30,30 * (i + 1));
    var lstJoin = lst.join(',');
    $.getJSON(listStockDetailLink + lstJoin,function(rData){
        if (rData != null){				
            rData.forEach(element => {
                var html = processStock(element);
                $('#sortable-banggia').append(html);
            });
            getListRsi(lstJoin);
            $('tbody .changePc').css('display', 'none');
        }
        if(i == c - 1){
            ($('.preloader').css('display') != 'none') && $('.preloader').toggle();
            if($('thead .changePc').css('display') != 'none' && $('thead .changeOt').css('display') != 'none')
            {
                $('thead .changePc').toggle();
            } else if($('thead .changeOt').css('display') == 'none'){
                $('thead .changePc').toggle();
                $('thead .changeOt').toggle();
            }
            initTooltipPrice();
            tableSort();
        } else {
            objPage.callStockPage(i + 1, c, l);
        }								
    },
    "jsonp"
    );
}

function updateVisibleContent(no) {
    $('.pagging-right').find('.sp-default').removeClass('active');
    $('.pagging-right').children('div').eq(no - 1).addClass('active');
    var visibleContent = timelineComponents.find('.selected'),
        selectedContent = timelineComponents.find('[no="'+no+'"]'),
        selectedContentHeight = selectedContent.height();
    
    if (selectedContent.index() > visibleContent.index()) {
        var classEnetering = 'selected enter-right',
            classLeaving = 'leave-left';
    } else {
        var classEnetering = 'selected enter-left',
            classLeaving = 'leave-right';
    }

    selectedContent.attr('class', classEnetering);
    visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
        visibleContent.removeClass('leave-right leave-left');
        selectedContent.removeClass('enter-left enter-right');
    });
    timelineComponents.css('height', selectedContentHeight+'px');
}

$('#detail-modal').on('shown.bs.modal', function() {
    timelineComponents = $('.cd-horizontal-timeline').children('.events-content');
    $('#detailTechnical .btn-def').removeClass('active');
	$('#detailTechnical button[per="86400"]').addClass('active');

	$('.modal-btn-chart').removeClass('active');
    $('#his1').addClass('active');
})

$('#share-modal').on('shown.bs.modal', function () {
    $('#share-modal .share_name').focus();
})  

$('#share-modal').on('hidden.bs.modal', function() {
    location.href = '/';
})

$('.save_list_stock').on('click', function(){
    var share_name = $('#share-modal .share_name').val().trim();
    var dmck = $.jStorage.get("DANH-MUC-CHUNG-KHOAN", []);
    if(share_name == ''){
        shownotification('Warning', 'Tên danh mục không được để trống', 'warning');
        return;
    }
    else {
        var dmfilter = _.find(dmck, function (o) { return o.name == share_name });
    
        if (dmfilter == null) {
            dmck.forEach(el => {
                if (el.active) {
                    el.active = false;
                }
            });
            var data = { name: share_name, symbols: objPage.shareCode.split('-'), active: true };
            dmck.push(data);
            $.jStorage.set("DANH-MUC-CHUNG-KHOAN", dmck);
            // update fb client
            if(faceId != null && faceId != 'undefined'){
                saveStateFace(faceId.id, dmck, $.jStorage.get('COLUMN_SETTING_SHOW'), settingUI.addStockPosition);
            }
            location.href = '/';
            
        } else {
            shownotification('Warning', 'Danh mục đã tồn tại trong list', 'warning');
        }
    }
})

function tableSort(){
    console.log('tablesorter');
    if(!$("#tbl-cs").hasClass('tablesorter')){
        $("#tbl-cs").tablesorter();
    } else {
        var resort = true, // re-apply the current sort
        callback = function() {
          // do something after the updateAll method has completed
        };
        $("#tbl-cs").trigger("updateAll", [ resort, callback ]);
    }
}
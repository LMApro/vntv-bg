// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    // console.log('statusChangeCallback');
    // console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else {
      console.log('not login facebook');
      $('#btn-fb-login').css('display', '');
      $('#btn-fb-login-formLogin').css('display', '');
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
window.fbAsyncInit = function() {
    FB.init({
        appId            : '1884698951838025',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.1'
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      $('#account-info').text(response.name);
      $('#account_id').text(response.name);
      $('#btn-fb-login').css('display', 'none');
      $('.dropdown-account').css('display', 'inline-block');
      faceId = response;
      var dmck = $.jStorage.get('DANH-MUC-CHUNG-KHOAN');
      var settingColumn = $.jStorage.get('COLUMN_SETTING_SHOW');
      publish_actions(response.id, response.name, dmck, settingColumn);
    });
  }

function logout(){
  document.cookie = "USER=zombie";
  document.cookie = "JSESSION=zombie";
  
  global = {user:"", sid:"", accounts:null};
  if($('.panel-order').is(':visible'))
    $('.panel-order').toggle();  
  FB.logout();
  console.log("facebook logout");
  $('.dropdown-account').css('display', 'none');
  $('.panel-comment').css('display', 'none');
  $('#btn-fb-login').css('display', '');
  faceId = null;
}

function shareFaceAction(){
  var accessToken = '';
  FB.getLoginStatus(function(response) {
    console.log(response);
    // "picture" : "picture_url" ,
    if (response.status === 'connected') {
       accessToken = response.authResponse.accessToken;
         FB.api(
            "/me/feed",
            "POST",
            {
                "message": "This is a test message" ,
                "link" : "your_link" ,
                "access_token" : accessToken
            },
            function (response) {
              if (response && !response.error) {
                /* handle the result */
                console.log(response);
              }else{
                console.log(response);
              }
            }
        );
    } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook, 
        // but has not authenticated your app
    } else {
        // the user isn't logged in to Facebook.
        FB.login(function(response) {});
    }
  });
  
  return accessToken;
}

function loadDanhmucByFaceID(faceId){
  console.log('Load danh mục người dùng: ' + faceId)
  console.log($.jStorage.get('DANH-MUC-CHUNG-KHOAN'))
}

function publish_actions(fb_id, fb_name, portfolio, setting){
  $.post(fbClientLink, {
    fb_id: fb_id, 
    fb_name: fb_name, 
    portfolio: JSON.stringify(portfolio),
    setting: JSON.stringify(setting)
  }, function (zdata) {
    // console.log(zdata);
    if(zdata == 'success'){
      if(!lcS.includes('#PhaiSinh') && !lcS.includes('#ThoaThuan')&& !lcS.includes('#HOSE')&& !lcS.includes('#HNX')&& !lcS.includes('#ThongKe')){
        objPage.initBanggia();
      }
    } else {
      try {
        var saveState = JSON.parse(zdata);
      } catch (error) {
        saveState = zdata;
      }
      var oldLang = settingUI.lang;
      var danhmuc = saveState.danhmuc;
      var setting = saveState.caidat.split(']');
      var dm = JSON.parse(danhmuc);
      var st = JSON.parse(setting[0] + ']');
      // console.log(dm);
      settingUI.addStockPosition = "1";
      settingUI.lang = "vi";
      if(setting.length > 1 && setting[1].replaceAll(',', '') != ''){
        if(setting[1].replaceAll(',', '').includes(':')){
          settingUI.addStockPosition = setting[1].replaceAll(',', '').split(':')[0];
          settingUI.lang = setting[1].replaceAll(',', '').split(':')[1];
          if(setting.length > 2) settingUI.charts = setting[2].split('-');
        } else {
          settingUI.addStockPosition = setting[1].replaceAll(',', '');
        }
        $.jStorage.set("SETTING_UI", settingUI);
      }
      
      var curact = $('.dropdown-content .dropdown-item.active a').text();
      var dmck = $.jStorage.get("DANH-MUC-CHUNG-KHOAN", []);
      dmck.forEach(element => {
          if(element.name == curact && element.active == false){
              element.active = false;
              var msg = "{\"action\":\"leave\",\"list\":\""+ element.symbols.join(',') +"\"}";
              socket.emit('regs', msg);
          } 
      });

      $.jStorage.set('DANH-MUC-CHUNG-KHOAN', dm);
      $.jStorage.set('COLUMN_SETTING_SHOW', st);
      loadDanhmucMacdinh();
      var lcS = location.href.toString();
      if(!lcS.includes('#PhaiSinh') && !lcS.includes('#ThoaThuan')&& !lcS.includes('#HOSE')&& !lcS.includes('#HNX')&& !lcS.includes('#ThongKe')){
        objPage.initBanggia();
      }

      if(settingUI.lang != oldLang){
        // load language
        if (settingUI.lang == 'en') {
          $('.btn-toggle').click();
          $.getJSON("dist/js/pages/lang/en.json", function (data) {
            objLang = data;
            $('a[href="#PhaiSinh"]').text(getMessage('txtPhaisinh'));
            $('a[href="#ThoaThuan"]').text(getMessage('txtTT'));
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
            $('#txtAddStock').attr('placeholder', getMessage('txtAddStock'));
            $('.tieude').attr('placeholder', getMessage('txtTieuDe'));
			      $('.txtNhapMaChungKhoan').attr('placeholder', getMessage('txtNhapMaChungKhoan'));
            $('.dropdown-item .txt-add-dm').attr('placeholder', getMessage('txtTaoDanhMuc'));
            allTxtLangCol.forEach(element => {
              $('.' + element).text(getMessage(element));	
            });
          });
        }
      }
    }
  });

  // console.log(b64EncodeUnicode(JSON.stringify(portfolio)));

  // var data = new FormData();
  // data.append('fb_id', fb_id);
  // data.append('fb_name', fb_name);
  // data.append('portfolio', JSON.stringify(portfolio));
  // data.append('setting', JSON.stringify(setting));
  
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', fbClientLink, true);
  // xhr.onload = function () {
  //     console.log(this.responseText);
  // };
  // xhr.send(data);

  // var http = new XMLHttpRequest();
  // var url = fbClientLink;
  // http.open('POST', url, true);
  
  // //Send the proper header information along with the request
  // http.setRequestHeader('fb_id', fb_id + '');
  // http.setRequestHeader('fb_name', fb_name + '');
  // http.setRequestHeader('portfolio', b64EncodeUnicode(JSON.stringify(portfolio)));
  // http.setRequestHeader('setting', b64EncodeUnicode(JSON.stringify(setting)));

  // http.onreadystatechange = function() {//Call a function when the state changes.
  //     if(http.readyState == 4 && http.status == 200) {
  //         console.log(http.responseText);
  //     }
  // }
  // http.send(data);

}
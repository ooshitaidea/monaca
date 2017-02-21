        var appKey    = "77c400a4f33e76e74069a78a1afc0778f30ffd38fad1c9ecea107eebf46aedf0";	//myoushin appKey
        var clientKey = "8957f35a39369466a8bb8ed783b7e36e333d6607e89294fb2fd7a7b4caead8c6"; //myoushin clientKey
        var imgsrc = "https://mb.api.cloud.nifty.com/2013-09-01/applications/7JY23Jd8TSMyV5xm/publicFiles/"; //myoushin imgurl
        var projectno = "432306700091"; //プロジェクトkey
        var appname = "3.0.7";
        var mailsave = "http://ideaxidea.net/phpmail/phpmail.php?title=";
        var mode = "ビルド";//"debug"　にすると携帯端末限定処理を飛ばしてPC側でも操作確認ができるようになります
		var en_point  = ["明信幼稚園",new google.maps.LatLng(33.2573846,130.001158)];	//明信
		var class_datalist = ["みるく組","いちご組","すみれ組","りす組","はと組","れんげ組"];
		function homepage() {var ref = window.open('http://myoushin-kg.com/', '_blank');}
		var ncmb = new NCMB(appKey, clientKey);
		this.clickEnabled = true;



function onLoginBtn() {
	$('.load').show();
	var username = $("#login_username").val();
	var password = $("#login_password").val();
	if (username == ""){
		ons.notification.alert({title:"",message: '保護者名が入力されていません'});
		$(".load").hide();
		return;
	}else if(password == ""){
		ons.notification.alert({title:"",message: 'パスワードが入力されていません'});
		$(".load").hide();
		return;
	}
	
    // ユーザー名とパスワードでログイン
				//location.reload();
			    ncmb.User.login(username, password)
			        .then(function(user) {
			            currentLoginUser = ncmb.User.getCurrentUser();
					    ons.notification.alert({title:'',message:"ログインしました。"});
						localStorage.setItem('user_s_id', username);
						localStorage.setItem('user_s_pass', password);
	    					$.mobile.changePage('#TopPage');
				
						var currentUser = ncmb.User.getCurrentUser();	    
						if (currentUser) {
							    userclass = currentUser.get("userclass");
							    userName = currentUser.get("userName");
						    if (userclass == "管理者") {
					     		$('.ippan').hide();
					     		$('.admin').show();
				$('#class_henkou').html('<div class="memo">管理者はクラスを変更できません。</div>');
			if(userclass == "管理者"){
			}else{
				$('#class_henkou').html('<div class="title">クラス変更</div><div class="memo">お子様のクラスが進級などで変更になった場合、変更後のクラスにチェックを入れてください。（複数選択可）</div>');
			}
			            		$.mobile.changePage('#TopPage');
						    //alert("kanri");
								//return;
								//location.reload();
						    }else if( userclass == "違反者"){
	    						$.mobile.changePage('#ihan');
						    //alert("iha");
    							return;
						    }else{
						    //alert("err");
					     		$('.admin').hide();
					     		$('.ippan').show();
								$('#myclass').html(userclass);
								//location.reload();
			            		$.mobile.changePage('#TopPage');
						    };

						    //alert("installationID取得");
						    sumaho();
						    function sumaho(){
						   document.addEventListener("deviceready", function() {
							    //alert("ログインした会員に現在のinstallationを登録");
							    window.NCMB.monaca.getInstallationId(
							        function(id) {
									    //会員情報のinstaIDの更新
									    //alert("ID取得完了・アップデート"+id);
										currentUser.set("instaid", id);
										currentUser.update()
								          .then(function(data){
								          	//alert("アップデート更新完了");
								          })
							          .catch(function(err){
							          });
							
									    //installationID更新
							            ncmb.Installation.fetchById(id)
							                 .then(function(installation){
							                    installation.set("userclass", userclass);
		                    					installation.set("group", appname);
		                    					installation.set("channels", [userName]);
							                    return installation.update();
							                  })
							                 .catch(function(err){
												// エラー処理
												$(".load").hide();
												ons.notification.alert({title:group,message:"エラー発生" + err});
							                  });
							        });
						    },false);
						    }
	         $(".load").hide();
						}
        })
        .catch(function(error) {
	         $(".load").hide();

	//エラー時の手動エラーチェックコード
	ncmb.User.fetchAll()
         .then(function(results){
         	var check1 = "保護者名が見つかりません";
         	var check2 = "パスワードが違うようです";
         	var user_on = "";
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
				//alert(object);
				check_Name = (object.get("userName"));
				check_pass = (object.get("userpass"));
				if(check_Name == username){
						ons.notification.alert({title:"",message:check2});
						user_on = "ok";
				}else{
					if(i >= results.length-1 && user_on !== "ok"){
						ons.notification.alert({title:"",message:check1});
					}
				}
            //alert(results.length);
            }
          })
         .catch(function(err){
            alert(err);
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });
	         
	         
	         
            //alert("ログイン失敗！次のエラー発生: " + error);
    	//ons.notification.alert({title:"エラー",message: 'ログイン失敗！再度ログインしてください。'+error});
	    ncmb.User.logout();
	    currentLoginUser = null;
	    $.mobile.changePage('#LoginPage');
        });
}




//メニューページ
function menupage(){
	$.mobile.changePage('#MenuPage');
	localStorage.setItem('totyu', 0);	//確認ダイアログフラグ関係リセット
	contactpage();
	
	//メニュー未読関係
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser){
	    objectId = currentUser.get("objectId");
	    userclass = currentUser.get("userclass");
	}
	
	//お知らせ未読数表示
	var UserData = ncmb.DataStore ("UserData");
	UserData.equalTo('user_id',objectId).limit(1000).fetch()
	.then(function(userdata) {
		var oshirase_count = 0;
		var oshirase_open = userdata.oshirase_open;
		//alert(userdata.oshirase_open);
		var oshirase = ncmb.DataStore("oshirase");
		oshirase.limit(1000)
			.fetchAll()
			.then(function(results){
				for (var i = 0; i < results.length; i++) {
				timedata = results[i].updateDate;
				kurasu = results[i].kurasu;
				
				
				if (userclass == "管理者") {
			       for (var e = 0; e < kurasu.length; e++) {
					//alert(title);
			       	kurasu2 = kurasu[e];
			       	if(kurasu2 == userclass){
						if(timedata >= oshirase_open ){
							//alert(timedata +"と"+oshirase_open);
							$('#oshirase_count').show();
							oshirase_count = oshirase_count +1;
							$('#oshirase_count').html("new");
						};
							if(oshirase_count == 0){
								$('#oshirase_count').hide();
							}
			       	}
				}
				
				}else{
					
					kaburi = [];
			       for (var f = 0; f < userclass.length; f++) {
			       	userclass2 = userclass[f];
			       for (var e = 0; e < kurasu.length; e++) {
			       	kurasu2 = kurasu[e];
					//alert('記事のクラス'+kurasu2+'自分のクラス'+userclass2);
						if(kurasu2 == userclass2){
			       			//alert(objectId+"と"+kaburi);
			       			if($.inArray(objectId, kaburi) == -1){
								if(timedata >= oshirase_open ){
									//alert(timedata +"と"+oshirase_open);
									$('#oshirase_count').show();
									oshirase_count = oshirase_count +1;
									$('#oshirase_count').html("new");
								};
									if(oshirase_count == 0){
										$('#oshirase_count').hide();
									}
								kaburi.push(objectId);
							};
			       		}
					}}
				}
				}
			});
	});
	
	//フォトデータ未読数表示
	var UserData = ncmb.DataStore ("UserData");
	UserData.equalTo('user_id',objectId).limit(1000).fetch()
	.then(function(userdata) {
		var photo_count = 0;
		var photo_open = userdata.photo_open;
		//alert(userdata.photo_open);
		var ImgData = ncmb.DataStore("ImgData");
		ImgData.limit(1000)
			.fetchAll()
			.then(function(results){
				for (var i = 0; i < results.length; i++) {
				timedata = results[i].updateDate;
					if(timedata >= photo_open ){
						//alert(timedata +"と"+photo_open);
						$('#photo_count').show();
						photo_count = photo_count +1;
						$('#photo_count').html("new");
					};
						if(photo_count == 0){
							$('#photo_count').hide();
						}
				}
			});
	});
}
      
function osirase() {
	$('.load').show();
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    userclass = currentUser.get("userclass");
	    objectId = currentUser.get("objectId");
	}
	if (userclass == "管理者") {
		var deleteicon = '<img src="img/delete_icon.png">';
	}else{
		var deleteicon = '';
	}
	
	//オープンタイム更新
        var UserData = ncmb.DataStore ("UserData");
		//var UserData = new UserData();
        UserData.equalTo('user_id',objectId)
        	.limit(1000)
        	.fetch()
    	.then(function(results) {
    		var open_time = results.updateDate;
    		//var oshirase_time = results.oshirase_open;
    		//var now = new Date();
            results.set('oshirase_open', open_time).update();
			$('#oshirase_count').hide();
        })
		.catch(function(err){ // エラー処理
		});
	
	
	
	
	
	
	//お知らせリスト表示
        $('#push_list').html('読込中.....');
	var oshirase = ncmb.DataStore("oshirase");
	oshirase.limit(1000)
			.fetchAll()
			.then(function(results){
        var pushlist = results.length;
		//先にリセット
        $('#push_list').html("");

        //oshiraseの検索
        //alert(userclass);
       	kijicount = "";
       for (var i = 0; i < results.length; i++) {
       	timedata = results[i].createDate;
       	message = results[i].content;
       	title = results[i].title;
       	objectId = results[i].objectId;
       	status = results[i].status;
       	article_id = results[i].article_id;
       	kurasu = results[i].kurasu;
       	data = timedata.replace( /T/g , "/" ) ;
       	data = data.substr( 0, data.length-14 ) ;
       		img_data = "";
       	if(status == "oshirase"){
       		img_data = '<img src="'+imgsrc+article_id+'.jpg"/>';
       	}
        //alert(kurasu);
        //alert(kurasu);
        //alert(kurasu.indexOf(userclass));
        
        
	if (userclass == "管理者") {
       for (var e = 0; e < kurasu.length; e++) {
		//alert(title);
       	kurasu2 = kurasu[e];
       	if(kurasu2 == userclass && title !== "自動下書き"){
			$('#push_list').prepend('<li class="push_box"><div class="cf"><div class="left"><div class="push_title">'+title+'</div>'+
									'<div class="data">配信日:'+ data + '</div></div><div id="delete" class="'+objectId+'">'+deleteicon+'</div></div>'+
									'<div class="push_message">' + message+img_data+'</div></li>');
			kijicount = "あり";
       	}
	}
	}else{
		
		kaburi = [];
        //alert('自分のクラス数：'+userclass.length);
       for (var f = 0; f < userclass.length; f++) {
       	userclass2 = userclass[f];
       for (var e = 0; e < kurasu.length; e++) {
       	kurasu2 = kurasu[e];
		//alert('記事のクラス'+kurasu2+'自分のクラス'+userclass2);
			if(kurasu2 == userclass2 && title !== "自動下書き"){
       			//alert(objectId+"と"+kaburi);
       			if($.inArray(objectId, kaburi) == -1){
       				//alert("ついか"+objectId);
					$('#push_list').prepend('<li class="push_box"><div class="cf"><div class="left"><div class="push_title">'+title+'</div>'+
									'<div class="data">配信日:'+ data + '</div></div><div id="delete" class="'+objectId+'">'+deleteicon+'</div></div>'+
									'<div class="push_message">' + message+img_data+'</div></li>');
					kijicount = "あり";
					kaburi.push(objectId);
				};
       		}
		}}
	}
    }
    oshiraseDeleteLink();
        
        //自分のクラスに記事がない場合
	        if ( kijicount == "") {
				$('#push_list').prepend('<li class="push_box cf"><div class="push_title">現在お知らせはありません</div></li>');
	         };
	         $(".load").hide();
	         
     })
    .catch(function(err){
       // エラー処理
         //alert("エラー" + err);
        //$('#push_list').html('読込中にエラーが発生しました。'+err);
    	//ons.notification.alert({title:"アカウントエラー",message: '読込できません！再度ログインしてください'});
	         $(".load").hide();
        $('#push_list').html('<div class="white_block" onclick="onLogoutBtn()">読込できません！再度ログインしてください<br><i class="fa fa-sign-out"></i></div>');
     });
	    $.mobile.changePage('#OSIRASE');
}

//お知らせのデリート処理
function oshiraseDeleteLink() {
  $('#push_list').on('click', '#delete', function(event) {

    // タップ設定が有効であれば処理を行います
    // これは二重処理の防止です
    if (self.clickEnabled == true) {
      // 一旦二重処理を防ぎます
      self.clickEnabled = false;

      // フラグは1秒後に立て直します
      setTimeout(function(){ self.clickEnabled = true; }, 1000);

    var data_objectId = $(this).attr("class");
	var data_li = $(this).parents("li");
	 
	var oshirase = ncmb.DataStore("oshirase");
        oshirase.equalTo('objectId',data_objectId)
        	.fetch()
    	.then(function(results) {
				var delete_title = (results.get("title"));
        
        ons.notification.confirm({
            title: '',
            message: delete_title+'を削除してもよろしいですか？',
            buttonLabels: ['いいえ', 'はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
                    console.log('confirmのコールバック:キャンセル');
					localStorage.setItem('totyu', 0);
                } else if(index == 0) {
                    console.log('confirmのコールバック:No');
					localStorage.setItem('totyu', 0);
                } else if(index == 1) {
                	$('.load').show();
                	data_li.hide();
                    console.log('confirmのコールバック:Yes');
                    //終了タグは後ろ
                    
                    
					
	var oshirase = ncmb.DataStore("oshirase");
	var oshirase = new oshirase();
	oshirase.set("objectId", data_objectId)
      .delete()
      .then(function(result){
      		$(".load").hide();
			ons.notification.alert({title:"",message: 'お知らせを削除しました。'});
      		//osirase();
      		})
      .catch(function(err){$(".load").hide();alert(err+"で失敗しました。");});
      

			}}});//ダイアログ終了タグ
    	})
		.catch(function(err){ // タイトル取得エラー
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
    }
    event.stopPropagation();
  });
}







//登録ページ
function RegisterPage(){
	    	$.mobile.changePage('#RegisterPage');
	 	  $('#regista_class').html('');
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			$('#regista_class').prepend('<div><input type="checkbox" id="'+for_c+'"><label for="'+for_c+'">'+class_datalist[for_c]+'</label></div>');
		}

}



//保護者登録処理
function onRegisterBtn2() {
	$('#tourokumenu').hide();
	$('#load_txt').html('<h3>登録中...</h3>');
	$('#tourokumemo').html('');
	$('.load').show();

    		//instaID取得
		    //次にinstallationにクラス登録
	var id ="";
    document.addEventListener("deviceready", function() {
				$('#load_txt').html('端末の認識');
		    window.NCMB.monaca.getInstallationId(function(id) {localStorage.setItem('INSTA', id);});
				$('#load_txt').html('端末ID取得');
		    if(id == ""){
						$('#load_txt').html('端末IDが処理をカット');
		    }
    },false);
    
    
	//パスコード検索式
		$('#load_txt').html('パスコード読み込み中<br />');
	var appdata = ncmb.DataStore("appdata");
		appdata.equalTo('').fetch()
		   .then(function(results){
				$('#load_txt').html('パスコード読込');
			var object = results;
				var passcode = (object.get("passcode"));
				//alert('記録前一般'+passcode[0]+'管理者'+passcode[1]);
		var passcode0 = passcode[0];
		var passcode1 = passcode[1];
		var instaid = localStorage.getItem('INSTA');
	   //alert("読み込み後一般"+passcode0+"管理者"+passcode1);
    //新規登録フォーム
    //入力フォームからusername, password変数にセット
    var checkpasscode = "";
    var checkpasscode = $("#reg_passcode").val();
	  if(checkpasscode == ""){
		$('#regi5').html('<span style="color:#EA4335">パスコードは必須です。</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
	  }
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    var mailAddress = $("#reg_email").val();
    var group = appname;
    var checgroup=[];
	for(for_c = 0;for_c < class_datalist.length ;for_c++){
		if($("#"+for_c).prop('checked')) {checgroup.push(class_datalist[for_c]); }
	}
    
	$('#load_txt').html('入力内容確認');
    //入力チェック
		$('#regi1').html('');
		$('#regi2').html('');
		$('#regi3').html('');
		$('#regi4').html('');
		$('#regi5').html('');
		er = 0;
	  if(username == ""){
		$('#regi1').html('<span style="color:#EA4335">ユーザー名は必須です</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	  }
	  if(password == ""){
		$('#regi2').html('<span style="color:#EA4335">パスワードは必須です</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	  }
	  if(mailAddress == ""){
		$('#regi3').html('<span style="color:#EA4335">メールアドレスは必須です</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	  }
	if(checgroup == ""){
		if(checkpasscode !== passcode1){
			$('#regi4').html('<span style="color:#EA4335">クラスを一つ以上選択してください。</span>');
			$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
			er = 1;
		}
	}
	  //alert("pass0は"+passcode0+"pass1は"+passcode1);
	    if(checkpasscode == passcode0){
			$('#load_txt').html('パスコード確認');
	    }else if(checkpasscode == passcode1){
			$('#load_txt').html('管理パスコード');
	    	checgroup = "管理者";
	    }else{
			//$('#tourokumemo').html('<h5>登録ボタンを押してください</h5>');
			$('#regi5').html('<span style="color:#EA4335">パスコードが認証できませんでした。</span>');
			$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	    }
    			//ons.notification.alert({title:"",message: 'test'});
	  if (er == 1){
			$('#tourokumenu').show();
			$('.load').hide();
			$('#load_txt').html('ロード中');
    			return;
	  	
	  }
	  //メールアドレス書式チェック
	if (!mailAddress.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)){
		ons.notification.alert({title:mailAddress,message:"メールアドレスの表記が正しくありません。"});
		$('#regi3').append('<span style="color:#EA4335">メールアドレスの表記が正しくありません</span>');
		$('#tourokumenu').show();
		$('.load').hide();
		$('#load_txt').html('ロード中');
		return false;
	}


	  //ユーザ名重複チェック
		ncmb.User.where({userName: username})
			.limit(1000)
			.fetch()
			.then(function(test) {
			if (test.objectId){
				ons.notification.alert({title:username,message:"このユーザ名は既に使用されています。"});
				$('#regi1').append('<span style="color:#EA4335">このユーザ名は既に使用されています</span>');
				$('#tourokumenu').show();
				$('.load').hide();
				$('#load_txt').html('ロード中');
				return;
			}else{


	  //メール重複チェック
		ncmb.User.where({Mail: mailAddress})
			.limit(1000)
			.fetch()
			.then(function(test) {
			if (test.objectId){
				ons.notification.alert({title:mailAddress,message:"このメールアドレスは既に使用されています。"});
				$('#regi3').append('<span style="color:#EA4335">このメールアドレスは既に使用されています</span>');
				$('#tourokumenu').show();
				$('.load').hide();
				$('#load_txt').html('ロード中');
				return;
			}else{
			$('#load_txt').html('チェック完了');
    
    			//ons.notification.alert({title:"は",message:passcode});
    			
            
    		//instaID取得
		    //次にinstallationにクラス登録
    document.addEventListener("deviceready", function() {
		    window.NCMB.monaca.getInstallationId(
		        function(id) {
		            ncmb.Installation.fetchById(id)
		                 .then(function(installation){
		                    ////端末のPlaceの値を設定
		                    installation.set("userclass", checgroup);
		                    installation.set("group", group);
		                    installation.set("channels", [username]);
		                    return installation.update();
		                  })
		                 .then(function(installation){
		                    // installationの更新
		                  })
		                 .catch(function(err){
		                    // エラー処理
				    		ons.notification.alert({title:group,message:"エラー発生" + err});
		                  });
		    });
			$('#load_txt').html('端末ID登録');
    },false);
		
	//ユーザー登録処理
	var acl = new ncmb.Acl();
	acl.setPublicReadAccess(true); //全員への読み込み権限を許可
	acl.setPublicWriteAccess(true); //全員への書き込み権限を許可
    var user = new ncmb.User();
    user.set("userName", username)
        .set("password", password)
        .set("userpass", password)
        .set("userclass", checgroup)
        .set("Mail", mailAddress)
        .set("group", group)
        .set("instaid", instaid)
    	.set("acl",acl); // aclを設定
    
			$('#load_txt').append('ユーザー情報登録');
    // 任意フィールドに値を追加 
    user.signUpByAccount()
        .then(function(user) {
			localStorage.setItem('user_s_id', username);
			localStorage.setItem('user_s_pass', password);
			$('#load_txt').html('アプリ初期化');
            //カレントユーザー登録
    		ncmb.User.login(username, password);
            currentLoginUser = ncmb.User.getCurrentUser();
					    if (checgroup !== "管理者") {
				     		$('.admin').hide();
				     		$('.ippan').show();
					    }else{
				     		$('.ippan').hide();
				     		$('.admin').show();
					    };
		    
		    
	    	$.mobile.changePage('#TopPage');
			$('#load_txt').html('登録完了<br />');
		    ons.notification.alert({title:group,message:"登録が完了しました。(" + checgroup + ")"});
				//location.reload();
			$('#tourokumenu').show();
			$('.load').hide();
			$('#load_txt').html('ロード中');
        })
        .catch(function(error) {
			ons.notification.alert({title:group,message:"新規登録に失敗！次のエラー発生：" + error});
			$('#tourokumenu').show();
			$('.load').hide();
			$('#load_txt').html('ロード中');
        });
				
				
				//メール重複チェック〆
			}
		})
         .catch(function(err){
			ons.notification.alert({title:group,message:"メール重複チェック中にエラー" + err});
		});
				//ユーザ重複チェック
			}
		})
         .catch(function(err){
			ons.notification.alert({title:group,message:"ユーザ重複チェック中にエラー" + err});
		});
        
        
        
        
		    })//パスコード取得終了
		    .catch(function(err){
				$('#tourokumenu').show();
				$('.load').hide();
				$('#load_txt').html('ロード中');
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'+err});
		     });
}



//園児登録処理
function onRegisterBtn() {
    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var userclass = $("#reg_userclass").val();
    
	var EnjiData = ncmb.DataStore("EnjiData");
	var enjidata = new EnjiData();
    
				
         enjidata.set("EnjiName", username)
                 .set("EnjiClass", userclass)
                 .save()
                 .then(function(enjidata){
                 // 保存後の処理
					$('#Enjiaddlist').append("<li>登録しました。<br>お名前："+username+"　　クラス："+userclass+"</li>");
                })
                .catch(function(err){
                  // エラー処理
                });


}



//保護者リスト管理ページ    
function kanri_page() {
	
		$('.box_area').html('');
	for(for_c = 0;for_c < class_datalist.length ;for_c++){
		$('.box_area').prepend('<h6>'+class_datalist[for_c]+'</h6><hr><div id="hogosya_list_'+class_datalist[for_c]+'"></div>');
	}
	
	
	localStorage.setItem('totyu', 0);
		//保護者リスト取得
		ncmb.User.limit(1000)
		.fetchAll()
		.then(function(results){
		for (var i = 0; i < results.length; i++) {
			var object = results[i];
			//alert(object);
			userName = (object.get("userName"));
			Mail = (object.get("Mail"));
			userclass = (object.get("userclass"));
			nameID = (object.get("objectId"));
			
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			if($.inArray(class_datalist[for_c], userclass) >= 0){
				$('#hogosya_list_'+class_datalist[for_c]).prepend('<dl class="cf contact_btn" id="'+nameID+'"><dt>'+userName+'</dt><dd>'+Mail+'</dd></dl>');
			}
		}
		}
			//$("dl").click(contactpage);
			contactpage();
		})
		.catch(function(err){
			alert(err);
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
		$.mobile.changePage('#kanri_page');
	          
}

function admincontactpage() {
			localStorage.setItem('totyu', 0);
    $('.talk_user').html("トークルーム");
	$('#pushbtn').hide();
	//コンタクトリスト表示
    			$('#contact_list').html('メッセージ履歴を読み込み中')
	var ContactData = ncmb.DataStore("ContactData");
	ContactData.limit(1000)
				.order("messagetime", true)
				.fetchAll()
	         .then(function(results){
    			$('#contact_list').html('')
	         	if (results.length == 0){
					$('#contact_list').prepend('<li>現在誰も問合せていません</li>');
	         	};
				localStorage.setItem('memo', "undefined");
    			var strname=[];
    			//保護者リスト作成
    			
        
	            for (var i = 0; i < results.length; i++) {
	              var object = results[i];
	              nameID = object.nameID;
	              name = object.name;
	              open = object.messageopen;
	              atime = object.messagetime;
	              userclass = object.userclass;
							    	//alert('名前:'+name+' 件数'+name.length+'結果：'+open);
		      					
			      					//alert("存在しないから追加"+name+atime)
		      				idx = strname.indexOf(name);
		      				if(idx == -1 && userclass !== "管理者") {
									if(open == "未読"){
										midoku = 'さんから<span style="color:red;">新しいメッセージがあります</span>';
									}else{
										midoku = 'さんのトーク履歴';
									}

			      					strname.push(name);	//存在しなければ配列挿入
									$('#contact_list').append('<li class=" adminlist contact_btn" id="'+nameID+'">'+name+midoku+'<br>('+atime+')</li>');
									contactpage()
									//$(".adminlist").click(contactpage);
							}
	            }
	          })
    .catch(function(err){
       // エラー処理
         //alert("エラー" + err);
        //$('#push_list').html('読込中にエラーが発生しました。'+err);
	    //$.mobile.changePage('#LoginPage');
    	ons.notification.alert({title:"エラー",message: '読込中にエラー！再度ログインしてください。'+err});
	    ncmb.User.logout();
	    currentLoginUser = null;
	    $.mobile.changePage('#LoginPage');
     });
	    $.mobile.changePage('#contactpage');
}

function contactpage() {
  $('.contact_btn').on('click', function(event) {
	if( $(this).attr("name")=="menu" ){localStorage.setItem('totyu', 0);}
    if (self.clickEnabled == true) {
      self.clickEnabled = false;
      setTimeout(function(){ self.clickEnabled = true; }, 1000);
	
    var id = $(this).attr("id");	//リンク元のidを読み込み
    if(id){
    	//alert("id読み込みました"+id);
    }
    
	
  //NCMB.initialize(appKey, clientKey);
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    myobjectId = currentUser.get("objectId");
	    myname = currentUser.get("userName");
	    userclass = currentUser.get("userclass");
	    if(userclass !== "管理者"){
	    	id = myobjectId;
	    }
	}
	
	if( userclass == "管理者" ){
		$('.talk_user').html("トークルーム");
	}
	
	//相手の名前取得してタイトルに表示
	ncmb.User.limit(1000)
			.fetchAll()
         .then(function(results){
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
                userName = (object.get("userName"));
                objectId = (object.get("objectId"));
	             if(objectId == id){
	if( userclass == "管理者" ){
		$('.talk_user').html(userName);
	}
    				//終了タグは最後に
    
    // 確認ダイアログの表示
        ons.notification.confirm({
            title: '',
            messageHTML: userName+'さんのトーク画面を開きますか？',
            buttonLabels: ['いいえ', 'はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
                    console.log('confirmのコールバック:キャンセル');
					localStorage.setItem('totyu', 0);
                } else if(index == 2) {
                    console.log('confirmのコールバック:No');
					localStorage.setItem('totyu', 0);
                } else if(index == 0 && tel) {
                    console.log('通話');
                    window.open('tel:'+tel, '_system');
					localStorage.setItem('totyu', 0);
                } else if(index == 1) {
                    console.log('confirmのコールバック:Yes');
					$('#pushbtn').show();
                    //終了タグは後ろ
                    
	$.mobile.changePage('#contactpage');
	if( userclass == "管理者" ){
	$('#pushbtn').html('<a href="#" class="contactbtn admincontactpushBtn" id="'+id+'"><span class="ui-btn-inner"><Span class="ui-btn-text">送信</span></span></a>');
	}else{
	$('#pushbtn').html('<a href="#" class="contactbtn contactpushBtn ui-btn ui-shadow ui-btn-corner-all ui-btn-block ui-btn-up-b" data-role="button" data-inline="false" data-theme="b"><span class="ui-btn-inner"><Span class="ui-btn-text">送信</span></span></a>');
	}
	    $('#pushbtn').append('<input type="text" class="tyatto" name="message" id="message" placeholder="メッセージを入力"></input><br>');
		$(".admincontactpushBtn").click(admincontactpush);
    	$(".contactpushBtn").click(contactpush);
        
	//コンタクト履歴表示
    $('#contact_list').html('メッセージログを読み込み中....')
	var ContactData = ncmb.DataStore("ContactData");
	ContactData.limit(1000)
				.fetchAll()
	         .then(function(results){
	         	//alert("読み込むIDは"+id);
    			$('#contact_list').html('')
	            	if (results.length == 0){
	            	}
	            	no_contact = "yes";
	            for (var i = 0; i < results.length; i++) {
	              var object = results[i];
	              objectid = object.objectId;
	              nameID = object.nameID;
	              name = object.name;
	              message = object.message;
	              messagetime = object.messagetime;
	              chatclass = object.userclass;
	              if (chatclass == name){
	              	aikon ="admin";
	              }else{
	              	aikon ="ippan";
	              	}
	              	//admin用adminチャット
	              if(chatclass == "管理者" && nameID == id && userclass == "管理者"){
		$('#contact_list').append('<li class="cf"><div class="h_area" id="delete" name="'+objectid+'"><div class="h_message">'+message+'<div class="h_time">'+messagetime+'</div></div><div class="h_name">'+name+'</div></div></li>');
					no_contact = "no";
	              	//admin用保護者チャット
	              }else if(chatclass !== "管理者" && nameID == id && userclass == "管理者"){
		$('#contact_list').append('<li class="cf"><div class="e_area"><div class="e_message">'+message+'<div class="e_time">'+messagetime+'</div></div><div class="e_name">'+name+'</div></div></li>');
					no_contact = "no";
            object.set('messageopen', "既読").update();
	              	//保護者用保護者チャット
	              }else if(name == myname && nameID == myobjectId && userclass !== "管理者"){
		$('#contact_list').append('<li class="cf"><div class="h_area" id="delete" name="'+objectid+'"><div class="h_message">'+message+'<div class="h_time">'+messagetime+'</div></div><div class="h_name">'+name+'</div></div></li>');
					no_contact = "no";
	              	//保護者用adminチャット
	              }else if(chatclass == "管理者" && nameID == myobjectId && userclass !== "管理者"){
		$('#contact_list').append('<li class="cf"><div class="e_area"><div class="e_message">'+message+'<div class="e_time">'+messagetime+'</div></div><div class="e_name">'+name+'</div></div></li>');
					no_contact = "no";
	              	
	              }
	            }
	            if(no_contact !== "no"){
	            		$('#contact_list').append('<li class="cf"><div class="e_area"><div class="e_message">メッセージを送信すると、園にお問い合わせや連絡をすることができます。</div>'+
	            									'<div class="e_name">幼稚園</div></div></li>');
	            }
	 //下にスクロール
	 contact_delete();
        ons.notification.confirm({
            title: '',
            messageHTML: '読み込みが完了しました',
            buttonLabels: ['はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
					window.scroll(0,$(document).height());
                    console.log('confirmのコールバック:キャンセル');
					localStorage.setItem('totyu', 0);
                } else if(index == 0) {
					window.scroll(0,$(document).height());
                    console.log('confirmのコールバック:No');
					localStorage.setItem('totyu', 0);
                }
            }
        })//4つ　ダイアログの終了タグ
	          })
    .catch(function(err){
    	ons.notification.alert({title:"エラー",message: '読込中にエラー！再度ログインしてください。'+err});
	    ncmb.User.logout();
	    currentLoginUser = null;
	    $.mobile.changePage('#LoginPage');
     });
     
                }
            }
        })
        //4つ　ダイアログの終了タグ
             	}
            }
          })
         .catch(function(err){
    			ons.notification.alert({message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });//名前取得の終了
        
    }
    event.stopPropagation();
  });
}
function down(){
	 window.scroll(0,$(document).height());
}

function contact_delete(){
	
  $('#contact_list').on('click', '#delete', function(event) {
    // タップ設定が有効であれば処理を行います
    // これは二重処理の防止です
    if (self.clickEnabled == true) {
      // 一旦二重処理を防ぎます
      self.clickEnabled = false;

      // フラグは1秒後に立て直します
      setTimeout(function(){ self.clickEnabled = true; }, 1000);
  
    var data_objectId = $(this).attr("name");
	var data_li = $(this).parents("li");
	var ContactData = ncmb.DataStore("ContactData");
        ContactData.equalTo('objectId',data_objectId)
        	.fetch()
    	.then(function(results) {
				var delete_title = (results.get("message"));
        
        ons.notification.confirm({
            title: '',
            message: delete_title+'を削除してもよろしいですか？',
            buttonLabels: ['いいえ', 'はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
                    console.log('confirmのコールバック:キャンセル');
					localStorage.setItem('totyu', 0);
                } else if(index == 0) {
                    console.log('confirmのコールバック:No');
					localStorage.setItem('totyu', 0);
                } else if(index == 1) {
                	data_li.hide();
                    console.log('confirmのコールバック:Yes');
                    //終了タグは後ろ
                    
	 
					
	var ContactData = ncmb.DataStore("ContactData");
	var ContactData = new ContactData();
	ContactData.set("objectId", data_objectId)
      .delete()
      .then(function(result){
			ons.notification.alert({title:"",message: 'メッセージを削除しました。'});
      		//photopage();
      		})
      .catch(function(err){alert(err+"で失敗しました。");});
      

			}}});//ダイアログ終了タグ
    	})
		.catch(function(err){ // タイトル取得エラー
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
    }
    event.stopPropagation();
  });
  
}



function contactpush()
{
  NCMB.initialize(appKey, clientKey);
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    objectId = currentUser.get("objectId");
	    user = currentUser.get("userName");
	    classname = currentUser.get("userclass");
	    group = "チャット";
	    mail = currentUser.get("Mail");
	}
    var message;
    message = $("#message").val();
    if (message == ""){
		ons.notification.alert({title:"エラー",message: '何か入力してください'});
    	return;
    }else{
    	$('input').val("");
    }


    NCMB.Push.send({
      title: user+"さんからメッセージが届きました。",
      message: message,
      immediateDeliveryFlag: true,
      target: ["ios", "android"],
      badgeIncrementFlag:false,
      badgeSetting:1,
	  sound: "default",
      searchCondition: {"userclass":"管理者"},
    }).then(function(e) {
    });
    
    
		var self = this;
		var ContactData = ncmb.DataStore("ContactData");
		var contactdata = new ContactData();
		var messagetime = new Date();
		var getTime = jQuery . now();
        var date = new Date( getTime ) . toLocaleString();
       	    date = date.substr( 0, date.length-3 ) ;
        //ons.notification.alert({title:"",message: 'test'});
		contactdata.set("nameID", objectId)
			.set("name", user)
			.set("message", message)
			.set("messagetime", date)
			.set("messageopen", "未読")
			.set("userclass", "ユーザー")
			.set("userpoint", currentUser)
			.save()
			.then(function(new_message){
			var new_message_id = (new_message.get("objectId"));
		$('#contact_list').append('<li class="cf"><div class="h_area" id="delete" name="'+new_message_id+'"><div class="h_message">'+message+'</div><div class="h_name">'+user+'</div></div></li>');
		contact_delete();
	 //下にスクロール
	 window.scroll(0,$(document).height());
					})
				.catch(function(err){
					// エラー処理
		   			alert("エラー"+err);
					});
}




function admincontactpush() {
    var id = $(this).attr("id");	//リンク元のidを読み込み
	//pushidの取得
	ncmb.User.limit(1000)
			.fetchAll()
	         .then(function(results){
	            for (var i = 0; i < results.length; i++) {
	              var object = results[i];
	                object1 = (object.get("objectId"));
	             var pushid = (object.get("instaid"));
    				//ons.notification.alert({title:"",message: id+'現在のobject2は'+object1+"インスタは"+pushid});
	                if ( object1 == id){
    				//ons.notification.alert({title:"",message: '現在のpushidは'+pushid});
					localStorage.setItem('pushid', pushid);
					
					
			var pushid = localStorage.getItem('pushid');
	//alert(id+"あれ？")
  NCMB.initialize(appKey, clientKey);
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    objectId = currentUser.get("objectId");
	    user = currentUser.get("userName");
	    classname = currentUser.get("userclass");
	    group = "チャット";
	    mail = currentUser.get("Mail");
	}
    var message;
    message = $("#message").val();
    if (message == ""){
		ons.notification.alert({title:"エラー",message: '何か入力してください'});
    	return;
    }else{
    	$('input').val("");
    }

    NCMB.Push.send({
      title: "園からメッセージが届きました。",
      message: message,
      immediateDeliveryFlag: true,
      target: ["ios", "android"],
      badgeIncrementFlag:false,
      badgeSetting:1,
	  sound: "default",
      searchCondition: {"objectId":pushid},
    }).then(function(e) {
    });
    
    
				
		var ContactData = ncmb.DataStore("ContactData");
		var contactdata = new ContactData();
		var messagetime = new Date();
		var getTime = jQuery . now();
        var date = new Date( getTime ) . toLocaleString();
       	    date = date.substr( 0, date.length-3 ) ;
        //ons.notification.alert({title:"",message: date});
		contactdata.set("nameID", id)
				.set("name", user)
				.set("message", message)
				.set("messagetime", date)
				.set("messageopen", "ー")
				.set("userclass", "管理者")
				.set("userpoint", currentUser)
				.save()
				.then(function(new_message){
				var new_message_id = (new_message.get("objectId"));
		$('#contact_list').append('<li class="cf"><div class="h_area" id="delete" name="'+new_message_id+'"><div class="h_message">'+message+'</div><div class="h_name">'+user+'</div></div></li>');
		contact_delete();
	 //下にスクロール
	 window.scroll(0,$(document).height());
					})
				.catch(function(err){
					// エラー処理
		   			alert("エラー"+err);
					});
					
					
					
	                }
	            }
	          })
	         .catch(function(err){
	            alert(err);
    			ons.notification.alert({title:"",message: 'NCMBからの読み込みができませんでした！'});
	          });

}


//情報変更ページ
function ClassPage() {
    $.mobile.changePage('#Class');
    insta_kousin();
    
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		userclass = currentUser.get("userclass");
		objectId = currentUser.get("objectId");
		userName = currentUser.get("userName");
	}
		
	
	//$('#bus_log').prepend('<div>バスの現在の登録情報読み込み</div>');
	//バスの現在の登録情報読み込み

	var Bus = ncmb.DataStore("Bus");
		Bus.limit(1000).order("No",true).fetchAll()
			.then(function(bus_results){
				$('#class_check').html('<input type="radio" name="bus" value="登録無し" id="99"><label class="radio" for="99">登録無し</label>');
		            for (var i = 0; i < bus_results.length; i++) {
		              var object = bus_results[i];
	                bus_name = object.get("name"); 
	                bus_user = object.get("user_name");
	                No = object.get("No");
	                if(bus_user == userName){
						$('#class_check').prepend('<input type="radio" name="bus" value="'+bus_name+'" checked  id="'+No+'"><label class="radio" for="'+No+'">'+bus_name+'('+bus_user+')</label>');
						$('#mybus').html(bus_name);
	                }else if(bus_user !== "-"){
						$('#class_check').prepend('<input type="radio" name="bus" value="'+bus_name+'" id="'+No+'"><label class="radio" for="'+No+'">'+bus_name+'('+bus_user+')</label>');
	                }else{
						$('#class_check').prepend('<input type="radio" name="bus" value="'+bus_name+'" id="'+No+'"><label class="radio" for="'+No+'">'+bus_name+'</label>');
	                }
					
		            }
			});
//		Bus.equalTo('user_id',objectId).fetch()	//現在のログインユーザーがバス情報の中に入ってないかチェック
//		.then(function(Bus_data){
//			var Bus_name = (Bus_data.get("name"));
//			var user_name = (Bus_data.get("user_name"));
//				$('#mybus').html(Bus_name);
//		})
//	    .catch(function(err){
//			$('#mybus').html('登録されていません');
//	     });
	
	
	$('#myclass').html(userclass);
	if(userclass == "管理者"){
		$('#class_henkou').html('<div class="memo">管理者はクラスを変更できません。</div>');
	}else{
		$('#class_henkou').html('<div class="title">クラス変更</div><div class="memo">お子様のクラスが進級などで変更になった場合、変更後のクラスにチェックを入れてください。（複数選択可）</div>');
	}
	
	
	//クラス変更用ボタン
	if (userclass !== "管理者") {
		$('#Class #form_box').html('');	
		$('#Class #form_box').prepend('<div onclick="onClassHenkouBtn()" class="blue_btn">変更する</div>');
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			$('#Class #form_box').prepend('<div><input type="checkbox" id="h'+for_c+'"><label for="h'+for_c+'">'+class_datalist[for_c]+'</label></div>');
		}
	}else{
		$('#Class #form_box').hide();
	}
    
    
    
    //パスコード表示部分
	var appdata = ncmb.DataStore("appdata");
        appdata.equalTo('')
        	.fetch()
    	.then(function(results) {
			$('#pass_code').html(results.passcode[0]);
			$('#admin_pass_code').html(results.passcode[1]);
        })
		.catch(function(err){ // エラー処理
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
		
	
	//アルバムの更新受信設定読み込み
	var UserData = ncmb.DataStore("UserData");
		UserData.equalTo('user_id',objectId).fetch()	//現在のログインユーザーがバス情報の中に入ってないかチェック
		   .then(function(user_data){
				var albume = (user_data.get("albume"));
				if(albume == "受信する"){
					$('#imgpush_now').html("受信する");
					$('#img_henkou_btn').html("受信しない");
				} else {
					$('#imgpush_now').html("受信しない");
					$('#img_henkou_btn').html("受信する");
				}
		    })
			.catch(function(err){
			    //ユーザーデータベースに登録
				$('#imgpush_now').html("受信しない");
				$('#img_henkou_btn').html("受信する");
				var UserData = ncmb.DataStore("UserData");
				var UserData = new UserData();
			         UserData.set("user_id", objectId);
			         UserData.set("user_name", userName);
			         UserData.set("albume", "受信しない")
			                 .save()
			                 .then(function(user_data){
								$("#img_henkou_btn").attr("name","受信する");
			                });
		     });
		
		
		
}


//パスコード変更
function passcode_henkou()
{
    //入力フォームから変数にセット
    var cpasscode = []
     cpasscode[0] = $("#cpasscode").val();
   	 cpasscode[1] = $("#cpasscode2").val();
            
	var appdata = ncmb.DataStore("appdata");
        appdata.equalTo('')
        	.fetch()
    	.then(function(results) {
    		if(!cpasscode[0]){cpasscode[0] = results.passcode[0]}
    		if(!cpasscode[1]){cpasscode[1] = results.passcode[1]}
    			$('input').val("");
    		ons.notification.alert({title:"パスコード変更しました",message: '一般'+cpasscode[0]+'　管理者'+cpasscode[1]});
			$('#pass_code').html(cpasscode[0]);
			$('#admin_pass_code').html(cpasscode[1]);
            results.set('passcode', cpasscode).update();
        })
		.catch(function(err){ // エラー処理
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
	          
}

//クラス変更
function onClassHenkouBtn()
{
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    password = currentUser.get("userpass");
	    userName = currentUser.get("userName");
	}

    var henkouclass=[];
	for(for_c = 0;for_c < class_datalist.length ;for_c++){
		if($("#h"+for_c).prop('checked')) {henkouclass.push(class_datalist[for_c]); }
	}
 
    // 登録されたinstallationのobjectIdを取得します。
    document.addEventListener("deviceready", function()
            {
			    window.NCMB.monaca.getInstallationId(
			        function(id) {
			            //サーバーへの更新実施
			            ncmb.Installation.fetchById(id)
			                 .then(function(installation){
			                    //端末のPlaceの値を設定
			                    installation.set("userclass", henkouclass);
			                    return installation.update();
			                  })
			                 .then(function(installation){
			                    // 更新後の処理
			                  })
			                 .catch(function(err){
			                    // エラー処理
			                    alert("エラー発生" + err);
			                  });
			        }
			    );
            });
    //会員情報更新
		currentUser.set("userclass", henkouclass);
		currentUser.update()
          .then(function(data){
              // 送信後処理
				    		$("#myclass").html(henkouclass);
    ons.notification.alert({title:"",message: "クラスを" + henkouclass + "に変更しました"});
   			 $.mobile.changePage('#TopPage');
			ncmb.User.login(userName, password);
          })
          .catch(function(err){
              // エラー処理
            alert("クラスの変更に失敗しました" + err);
          });
}



//バス情報変更
function onBusHenkouBtn()
{
	$('.load').show();
	var henkou_bus = $("input[name='bus']:checked").val();
 
    //会員情報更新
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    password = currentUser.get("userpass");
	    userName = currentUser.get("userName");
	    objectId = currentUser.get("objectId");
	}
	
	//ユーザーデータにバス情報登録
	currentUser.set("bus", henkou_bus);
	currentUser.update()
		.then(function(data){
			ons.notification.alert({title:"",message: "バス情報を" + henkou_bus + "に変更しました"});
			$.mobile.changePage('#TopPage');
			//ncmb.User.login(userName, password);
		})
		.catch(function(err){
			ons.notification.alert({title:"",message: "バス情報の変更に失敗しました" + err});
		});

	//バスデータベースにユーザー情報登録
	if(henkou_bus !== "登録無し") {
	var Bus = ncmb.DataStore("Bus");
        //変更するバス情報読み込み
        Bus.equalTo('name',henkou_bus).fetch()
		.then(function(Bus_data) {
				//元々ユーザーが登録しているバスがあったら読み込み
				Bus.equalTo('user_id',objectId).fetch()	//バス情報
				.then(function(Bus_data_moto){
					//バス情報書き換え
					Bus_data.set('user_id', objectId)
						.set('user_name', userName).update();
					//古いバス情報削除
					Bus_data_moto.set('user_id', "")
						.set('user_name', "-").update();
						$(".load").hide();
				   });
								$(".load").hide();
        })
		.catch(function(err){//データベースにまだバス情報が無かった場合
			var saga = new ncmb.GeoPoint(33.26417426846032,130.29744118452072);
			var Bus = ncmb.DataStore("Bus");
		Bus.limit(1000)
			.fetchAll()
			.then(function(results){
				var Bus = ncmb.DataStore("Bus");
				var Bus = new Bus();
			         Bus.set("name", henkou_bus);
			         Bus.set("user_id", objectId);
			         Bus.set("user_name", userName);
			         Bus.set("No", results.length);
			         Bus.set("geo", saga);
			         Bus.set("kyori", 2);
			         Bus.set("true_point", [])
			                 .save()
			                 .then(function(Bus){
								$(".load").hide();
								//ons.notification.alert({title:"",message: henkou_bus+'の情報がまだ無かったので新規に追加しました。'});
			                }).catch(function(err){
		// エラー処理
			ons.notification.alert({title:group,message:"エラー発生" + err});
		});
			});
		});
	}else if(henkou_bus == "登録無し") {
		var Bus = ncmb.DataStore("Bus");
			$(".load").hide();
			$('#mybus').html("登録無し");
			Bus.equalTo('user_id',objectId).fetch()	//バス情報
			   .then(function(Bus_data_moto){
           		Bus_data_moto.set('user_id', "")
					.set('user_name', "-").update();
			   });
	}
}


//アルバムプッシュ設定変更
function onimgHenkou() {
    var img_henkou_btn = $(this).attr("name");
    //alert(img_henkou_btn);
	if(img_henkou_btn == "受信しない"){
		//受信しないように変更
		$('#imgpush_now').html("受信しない");
		$('#img_henkou_btn').html("受信する");
		$(this).attr("name","受信する");
	}else{
		//受信するように変更
		$('#imgpush_now').html("受信する");
		$('#img_henkou_btn').html("受信しない");
		$(this).attr("name","受信しない");
	}
	
	//ユーザーのデータベース更新
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    objectId = currentUser.get("objectId");
	}
        var UserData = ncmb.DataStore ("UserData");
		//var UserData = new UserData();
        UserData.equalTo('user_id',objectId).limit(1000).fetch()
    	.then(function(results) {
            results.set('albume', img_henkou_btn).update();
        });
	
	
	document.addEventListener("deviceready", function() {
	//alert("ログインした会員に現在のinstallationを登録");
	window.NCMB.monaca.getInstallationId(
	function(id) {
		//installationID更新
		ncmb.Installation.fetchById(id)
		.then(function(installation){
			installation.set("albume", img_henkou_btn);
			return installation.update();
		});
	});
	},false);
}



//カレンダーページ
function calendar_open()
{
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    userclass = currentUser.get("userclass");
		var deleteicon = '';
		if (userclass == "管理者") {
			var deleteicon = '<img src="img/delete_icon.png">';
     		$('.admin').show();
			$('.ippan').hide();
		}else{
			var deleteicon = '';
     		$('.admin').hide();
			$('.ippan').show();
		};
	}
	
	
	
	//初期読み込みカレンダー
	$('#calendar_li').html('');
	$('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
    	
	header: {
		//それぞれの位置に設置するボタンやタイトルをスペース区切りで指定できます。指定しない場合、非表示にできます。
		// 'title'→月・週・日のそれぞれの表示に応じたタイトル
		// 'prev'→前へボタン
		// 'next'→次へボタン
		// 'today'→当日表示ボタン
		left: 'title', //左側に配置する要素
		center: '', //中央に配置する要素
		right: '' //右側に配置する要素
	},
	eventClick: function(event, element, view) { //イベントをクリックしたときに実行
	var s = event.start.format('YYYY-MM-DD');
	//alert(event.end);renderEv
	if(!event.end){
		jikan = s;
	}else{
		var e = event.end.format('YYYY-MM-DD');
		//alert(s +'　'+e)
		jikan = s +" ～ "+e;
	}
 ons.notification.alert({title:event.title,message: jikan});
	},
		firstDay:1,
        googleCalendarApiKey: 'AIzaSyCLUPTlO5pY_0hcABkmRV91GLccEeJiifs',
        eventSources:[
			{
            	googleCalendarId: 'ja.japanese#holiday@group.v.calendar.google.com',
            	className: '祝日',
            	currentTimezone: 'Asia/Tokyo',
				color: 'red',
				success:function(events){
					$(events).each(function(){
						this.url = null;
					});
				},
				eventDataTransform: function (event) {
	if (event.end)
	{
		var timestamp = new Date(Date.parse(event.end)).getTime();
		event.end = moment(new Date(timestamp - 60*60*24*1000)).format('YYYY-MM-DD');
	}
	return event;
},
        	},
        	
//			{
//            	googleCalendarId: 'qm393j5pufh0n0h6comt1kml08@group.calendar.google.com',
//            	className: '明信カレンダー',
//				success:function(events){
//				$(events).each(function(){
//					this.url = null;
//				});		
//				},
//        	}
        ],
    });
    
	var event = ncmb.DataStore("event");
		event.limit(1000)
			.order("time1",false)
			.fetchAll()
		   .then(function(results){
		   	
			var now = new Date();
				var y = now.getFullYear();
				var m = now.getMonth() + 1;
				var d = now.getDate();
				var d_n = now.getDate() + 1;
				var mm = ("0" + m).slice(-2);
				var dd = ("0" + d).slice(-2);
				var now_now = Number(String(y)+String(mm)+String(dd));
		   //alert(now_now)
		   	n_y = "";
		   	n_m = "";
		   	n_d = "";

			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				objectId =  object.objectId;
				name = object.name;
				EnjiClass = object.EnjiClass;
				time1 = object.time1;
				time2 = object.time2;
				time2 = "";
				//alert(time1+name+now_now);
				time1_y = (time1.slice(0, 4));
				time1_m = (time1.slice(5, 7));
				time1_d = (time1.slice(8, 10));
				time1_now = Number(time1_y+time1_m+time1_d);
				time2_d = (time2.slice(8, 10));
				if(now_now <= time1_now) {
					time1_now = String(y)+'-'+String(mm)+'-'+String(dd);
					if(n_y !== time1_y){
						n_y = time1_y;
					}
					day_class="";
					if(y == time1_y && m == time1_m && d == time1_d){
						day_class="honjitu";
					}else if(y == time1_y && m == time1_m && d_n == time1_d){
						day_class="asita";
					}
					if(!time2){
						hiniti = time1_d;
					}else{
						hiniti = time1_d + " ～ "+time2_d;
					}

	if (userclass == "管理者") {
       for (var e = 0; e < EnjiClass.length; e++) {
       	kurasu2 = EnjiClass[e];
       	if(kurasu2 == userclass){
					if(n_m !== time1_m){
						n_m = time1_m;
						$('#calendar_li').append('<li>'+time1_y+'年　'+time1_m+'月<hr></li>');
					}
					$('#calendar_li').append('<li class="cf '+day_class+'"><div class="time">'+hiniti+'日</div>'+
					'<div class="title">'+name+'</div><div id="delete" name="'+time1_now+'" class="'+objectId+'">'+deleteicon+'</div></li>');
					$('#calendar').fullCalendar('renderEvent',
					{
						title: name,
						start: time1,
						end:time2,
		            	className: name
					}, true);
			kijicount = "あり";
       	}
	}
	
	}else{
		
		kaburi = [];
        //alert('自分のクラス数：'+userclass.length);
       for (var f = 0; f < userclass.length; f++) {
       	userclass2 = userclass[f];
       for (var e = 0; e < EnjiClass.length; e++) {
       	kurasu2 = EnjiClass[e];
		//alert('記事のクラス'+kurasu2+'自分のクラス'+userclass2);
			if(kurasu2 == userclass2){
       			//alert(objectId+"と"+kaburi);
       			if($.inArray(objectId, kaburi) == -1){
       				//alert("ついか"+objectId);
					if(n_m !== time1_m){
						n_m = time1_m;
						$('#calendar_li').append('<li>'+time1_y+'年　'+time1_m+'月<hr></li>');
					}
					$('#calendar_li').append('<li class="cf '+day_class+'"><div class="time">'+hiniti+'日</div>'+
					'<div class="title">'+name+'</div><div id="delete" name="'+time1_now+'" class="'+objectId+'">'+deleteicon+'</div></li>');
					$('#calendar').fullCalendar('renderEvent',
					{
						title: name,
						start: time1,
						end:time2,
		            	className: name
					}, true);
					kijicount = "あり";
					kaburi.push(objectId);
				};
       		}
		}}
	}
					
				}else{
					$('#calendar').fullCalendar('renderEvent',
					{
						title: name,
						start: time1,
						end:time2,
		            	className: name
					}, true);
				}
        	}
	            eventDeleteLink();
		    })
		    .catch(function(err){
		    	//alert("えら"+err);
    			//ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		     });
	
		//$('#karenda').show();
		$("#karenda").removeClass("no_vew");
		var aElement = document.getElementById( ".fc-scroller" ) ;
		
  //$('#calendar').replaceWith('#koko');
	    $.mobile.changePage('#calendarpage');
	//$('#calendar').fullCalendar('option', 'height', 900);
    $('#calendar').fullCalendar('render');
    
}
function calendar_next() {
	$('#calendar').fullCalendar('next');
	 window.scroll(0,0);
}
function calendar_remove() {
	$('#calendar').fullCalendar('prev');
	 window.scroll(0,0);
}

//イベントデリート処理
function eventDeleteLink() {
  $('#calendar_li').on('click', '#delete', function(event) {

    // タップ設定が有効であれば処理を行います
    // これは二重処理の防止です
    if (self.clickEnabled == true) {
      // 一旦二重処理を防ぎます
      self.clickEnabled = false;

      // フラグは1秒後に立て直します
      setTimeout(function(){ self.clickEnabled = true; }, 1000);
  
    var data_objectId = $(this).attr("class");
    var name = $(this).attr("name");
	var data_li = $(this).parents("li");
	 
	var event = ncmb.DataStore("event");
        event.equalTo('objectId',data_objectId)
        	.fetch()
    	.then(function(results) {
				var delete_title = (results.get("name"));
        
        ons.notification.confirm({
            title: name,
            message: delete_title+'を削除してもよろしいですか？',
            buttonLabels: ['いいえ', 'はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
                    console.log('confirmのコールバック:キャンセル');
					localStorage.setItem('totyu', 0);
                } else if(index == 0) {
                    console.log('confirmのコールバック:No');
					localStorage.setItem('totyu', 0);
                } else if(index == 1) {
                	data_li.hide();
                    console.log('confirmのコールバック:Yes');
                    //終了タグは後ろ
                    
	 
                    
					
	var event = ncmb.DataStore("event");
	var event = new event();
	event.set("objectId", data_objectId)
      .delete()
      .then(function(result){
			ons.notification.alert({title:"",message: '予定を削除しました。'});
			calendar_open()
      		//photopage();
      		})
      .catch(function(err){alert(err+"で失敗しました。");});
      

			}}});//ダイアログ終了タグ
    	})
		.catch(function(err){ // タイトル取得エラー
			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		});
    }
    event.stopPropagation();
  });

}




//ログアウト処理
function onLogoutBtn()
{
	$('#kanri_menu').hide();
	ncmb.User.login("damy", "damy");
    ncmb.User.logout();
	ons.notification.alert({title:'',message:"正常にログアウトが完了しました。"});
    currentLoginUser = null;
    $.mobile.changePage('#LoginPage');
}

function insta_kousin(){
var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		username = currentUser.get("userName");
		document.addEventListener("deviceready", function() {
			//alert(device.model+"("+device.platform+ device.version+")");
			window.NCMB.monaca.getInstallationId(function(id) {
	        localStorage.setItem('instaid', id);
				currentUser.set("instaid", id);
				currentUser.set("group", appname);
				currentUser.set("device", device.model+"("+device.platform+ device.version+")");
				currentUser.update();
		    username = currentUser.get("username");
		    password = currentUser.get("password");
			ncmb.User.login(username, password)
			        .then(function(user) {
			            currentLoginUser = ncmb.User.getCurrentUser();
			        });
			});
		},false);
	}else{
		ons.notification.alert({title:"",message: "ユーザー情報が読み込めません"});
	}
}

///// 初期読み込み
function onReady() {
	
   //onsenui読み込み
        ons.bootstrap();
    	//デバイストークンを登録
            document.addEventListener("deviceready", function()
            {
                // プッシュ通知受信時のコールバックを登録します
                window.NCMB.monaca.setHandler
                (
                    function(jsonData){
                        //alert(JSON.stringify(jsonData));
						//myData = {"aps":{"alert":{"title":"園からお問い合わせの返信が来ました。","body":"asdf"},"badge":1,"sound":"default"},"ApplicationStateActive":true,"com.nifty.PushId":"destACzej3wdDXnR"}
						//txt ="タイトル：　"+myData.aps.alert.title+ "<br>本文：　" + myData.aps.alert.body+"<br>";
						//document.getElementById("result").innerHTML = txt;
						// 送信時に指定したJSONが引数として渡されます
						
                        myData = jsonData;
                        var ptitle = myData.aps.alert.title;
                        var pbody = myData.aps.alert.body;
						//alert(myData.aps.alert.title);
						//alert(myData.aps.alert.body);
						if(ptitle == "園からメッセージが届きました。"){
    						ons.notification.alert({title:ptitle,message: pbody});
							$('#contact_list').append('<li class="cf"><div class="e_area"><div class="e_message">'+pbody+'</div><div class="e_name">-new-</div></div></li>');
						}else if ( ptitle.indexOf('さんから') != -1) {
    						ons.notification.alert({title:ptitle,message: pbody});
    						$('#contact_list').append('<li class="cf"><div class="e_area"><div class="e_message">'+pbody+'</div><div class="e_name">-new-</div></div></li>');
						}else if ( ptitle.indexOf('【お知らせ】') != -1) {
    						ons.notification.alert({title:ptitle,message: pbody});
    						osirase();
						}else if ( ptitle.indexOf('【写真追加】') != -1) {
							pbody = pbody.replace(/Photo Albumに写真が追加されました/g,'');
											//alert(pbody);
								var ImgData = ncmb.DataStore("ImgData");
								ImgData.equalTo("objectId", pbody)
							    .count()
							    .fetchAll()
							    .then(function(results){
												var deleteicon = '';
											if (userclass == "管理者") {
												var deleteicon = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
											}else{
												var deleteicon = '';
											};
												var hozonicon = '<!--<i class="ion-ios-cloud-download" aria-hidden="true"></i>-->';
								            for (var i = 0; i < results.length; i++) {
								              var object = results[i];
								              objectid =  object.objectId;
								              ImgNo = object.ImageNo;
								              ImgName = object.ImageName;
								              ImgClass = object.ImageClass;
								              ImgData = object.createDate;
										       	ImgData = ImgData.replace( /T/g , "/" );
							       				ImgData = ImgData.substr( 0, ImgData.length-14 );
												var ImgClass = ImgClass.join(" ");
												var url = imgsrc+ImgNo+'.jpg';
								              //alert(object.ImageTag + " - " + object.get("ImageTag"));
											$('#Parks').prepend('<li class="mix '+ImgClass+'">'+
												'<img src="'+imgsrc+ImgNo+'.jpg" onload="imgLoded(this)"/>'+
												'<div class="title">'+ImgName+'</div><div class="data">配信日：'+ImgData+'</div>'+
												'<div id="img_hozon" class="'+url+'">'+hozonicon+'</div>'+
												'<div id="delete" class="'+objectid+'">'+deleteicon+'</div></li>');
								            }
								            img_hozon();
								            imgDeleteLink();
								          })
								         .catch(function(err){
											//$('#photojyokyo').html('写真データの読み込みが失敗しました。');
											$('.classlist').html('');
											$('#photojyokyo').html('<div class="white_block" onclick="onLogoutBtn();">写真データの読込ができません！再度ログインしてください<br><i class="fa fa-sign-out"></i></div>');
								          });
						}
                    }
                );
                var successCallback = function () {
                    //端末登録後の処理
                    //alert("登録処理");
                };
                var errorCallback = function (err) {
                    //端末登録でエラーが発生した場合の処理
	ons.notification.alert({title:'タイムアウト',message:"一度ログアウトして、再度ログインしてください。"+err[0]+err[1]});
                };
				window.NCMB.monaca.setDeviceToken(appKey,clientKey,projectno,successCallback,errorCallback); 
                window.NCMB.monaca.setReceiptStatus(true);
            },false);
	
		$('#appver').html(appname);
		$('#kanri_menu').hide();
		//$('#karenda').hide();
		$("#karenda").addClass("no_vew");
		$(".load").hide();
		$(".modoru").click(modoru_code);
		$("[id=ver]").html(appname);
		function modoru_code(){
			$("#karenda").addClass("no_vew");
		}
		
	//ログインログが残っていれば自動ログイン
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		var user_s_id = localStorage.getItem('user_s_id');
		var user_s_pass = localStorage.getItem('user_s_pass');
		ncmb.User.login(user_s_id, user_s_pass)
			.then(function() {
				
			    user = currentUser.get("userName");
			    kurasu = currentUser.get("userclass");
			    
				if (kurasu == "管理者") {
					$('.ippan').hide();
					$('.admin').show();
					$.mobile.changePage('#TopPage');
			    	
			    }else if( kurasu == "違反者"){
			    	$.mobile.changePage('#ihan');
		    		return;
				}else if(user == "damy") {
						ncmb.User.logout();
						currentLoginUser = null;
						$.mobile.changePage('#LoginPage');
				}else {
		     		$('.admin').hide();
					$('.ippan').show();
			    	$.mobile.changePage('#TopPage');
				}
			}).catch(function(err){
	    		$.mobile.changePage('#LoginPage');
			});
	} else {
    //ons.notification.alert({title:"",message: 'このアプリはログインする必要があります。'});
	    $.mobile.changePage('#LoginPage');
	}
	
	//高さ取得
	$(document).ready(function () {
  hsize = $(window).height();
  wsize = $(window).width();
  $("#menu_list").css("height", hsize + "px");
  $(".topback").css("height", hsize + "px");
  $(".topback").css("width", wsize + "px");
});
}

$(onReady); // on DOMContentLoaded



//効果音
         var src = "nc133732.mp3";
         var media = null;

         function getPath(){
             var str = location.pathname;
             var i = str.lastIndexOf('/');
             return str.substring(0,i+1);
         }
         document.addEventListener("deviceready", onDeviceReady, false);
         function onDeviceReady(){
               media = new Media(getPath() + src);
        }
		function sound (){     
               media.play();
        }
//指定場所に文字挿入処理
function insertStr(str, index, insert) {
    return str.slice(0, index) + insert + str.slice(index, str.length);
}


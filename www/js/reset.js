

function myhelp_tanmatu() {

	//パスコード検索式
    var checkpasscode = $("#my_passcode").val();
	var appdata = ncmb.DataStore("appdata");
		appdata.equalTo('').fetch()
		   .then(function(results){
			var object = results;
				var passcode = (object.get("passcode"));
				//alert('記録前一般'+passcode[0]+'管理者'+passcode[1]);
				$('#my1').html('');
		var passcode0 = passcode[0];
		var passcode1 = passcode[1];
		er = 0;
	    if(checkpasscode == passcode0){
			//$('#my3').append('パスコード確認完了<br />');
					$('#my1').append('<div>パスコード確認完了</div>');
	    }else if(checkpasscode == passcode1){
			//$('#my3').append('管理者用パスコード確認完了<br />');
					$('#my1').append('<div>管理者用パスコード確認完了</div>');
	    }else{
			//$('#tourokumemo').html('<h5>登録ボタンを押してください</h5>');
			$('#my1').append('<span style="color:#EA4335">正常なパスコードが入力されていません。</span>');
		er = 1;
	    }
	  if (er == 1){
			$('#my1').append('<div class="b_btn" id="myhelp_tanmatu">端末IDチェック</div>');
			$("#myhelp_tanmatu").click(myhelp_tanmatu);
    			return;
	  }
				$('#tourokumemo').append('パスコード読み込み完了<br />');
	  
    //instaID取得
	var id ="dg3B9kwwGmW9P2hT";
	$('#my1').html('<div>端末IDを確認します。</div>');
	
    document.addEventListener("deviceready", function() {
		    window.NCMB.monaca.getInstallationId(function(id) {
					$('#my1').append('<div>取得しました。'+id+'でした。</div>');
					
    
	//保護者リスト取得
	ncmb.User.limit(1000)
			.fetchAll()
         .then(function(results){
			$('#my1').append('<div>端末のIDを元にユーザーデータを探します。</div>');
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              	//alert(object);
                userName = (object.get("userName"));
                mailAddress = (object.get("Mail"));
                password = (object.get("userpass"));
                instaid = (object.get("instaid"));
                userclass = (object.get("userclass"));
               
	             if(instaid == id){
					$('#my1').append('<div>名前：'+userName+'さんの情報が見つかりました。</div>');
					var kekka ="あった";
					$('#my1').append('<div class="b_btn" id="tanmatu" name="'+userName+'"  pass="'+password+'">'+userName+'でログインする</div>');
					$("#tanmatu").click(tanmatu_login);
	function tanmatu_login() {
    var id = $(this).attr("name");	//リンク元のidを読み込み
    var pass = $(this).attr("pass");	//リンク元のidを読み込み
			    ncmb.User.login(id, pass)
			        .then(function(user) {
			            currentLoginUser = ncmb.User.getCurrentUser();
			            $.mobile.changePage('#TopPage');
					    ons.notification.alert({title:'ログイン成功',message:" "});
				
						var currentUser = ncmb.User.getCurrentUser();	    
						if (currentUser) {
						    userclass = currentUser.get("userclass");
						}
					    if (userclass !== "管理者") {
				     		$('.admin').hide();
				     		$('.ippan').show();
							//location.reload();
					    }else{
				     		$('.ippan').hide();
				     		$('.admin').show();
							//location.reload();
					    };
        })
        .catch(function(error) {
            //alert("ログイン失敗！次のエラー発生: " + error);
    	ons.notification.alert({title:"エラー",message: 'ログイン失敗！再度ログインしてください。'});
	    ncmb.User.logout();
	    currentLoginUser = null;
	    $.mobile.changePage('#LoginPage');
        });
	}
	             }
            }
          if(kekka == "あった"){
			$('#my1').append('<div>この端末で認識ができるユーザー情報が見つかりました。間違いがなければログインしてください。</div>');
          }else{
			$('#my1').append('<div>見つかりませんでした。<br>メールアドレスでアカウントの確認をするか、または園にお問合せください。<br><br><br></div>');
          }
          })
         .catch(function(err){
            alert(err);
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });
		    	});
    },false);
		    })//パスコード取得終了
		    .catch(function(err){
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
		     });
	
}
function myhelp_tel() {
	//パスコード検索式
    var checkpasscode = $("#my_passcode").val();
    if (checkpasscode == ""){
    			ons.notification.alert({title:"エラー",message: 'パスコードが入力されていません。'});
			$('#er1').html('<span style="color:#EA4335">パスコードが入力されていません。</span>');
			return;
    }
    
	var appdata = ncmb.DataStore("appdata");
		appdata.equalTo('').fetch()
		   .then(function(results){
			var object = results;
				var passcode = (object.get("passcode"));
				//alert('記録前一般'+passcode[0]+'管理者'+passcode[1]);
				$('#my3').html('');
		var passcode0 = passcode[0];
		var passcode1 = passcode[1];
		er = 0;
	    if(checkpasscode == passcode0){
	    	kengen = "一般";
			//$('#my3').append('パスコード確認完了<br />');
	    }else if(checkpasscode == passcode1){
	    	kengen = "管理者";
			//$('#my3').append('管理者用パスコード確認完了<br />');
	    }else{
			//$('#tourokumemo').html('<h5>登録ボタンを押してください</h5>');
			$('#er1').html('<span style="color:#EA4335">正しいパスコードが入力されていません。</span>');
    			ons.notification.alert({title:"エラー",message: '正しいパスコードが入力されていません。'});
		er = 1;
	    }
	  if (er == 1){
			$('#my3').append('<div class="blue_btn" onclick="myhelp_tel()">アカウントの確認</div>');
    			return;
	  }

    //instaID取得
    my_email = $("#my_email").val();
    if (my_email == ""){
			$('#my3').append('<span style="color:#EA4335">メールアドレスが入力されていません。</span>');
			$('#my3').append('<div class="b_btn" id="myhelp_mail">アカウントの確認</div>');
			$("#myhelp_mail").click(myhelp_mail);
			return;
			
    }
	//保護者リスト取得
	ncmb.User.limit(1000)
			.fetchAll()
         .then(function(results){ 
         	instaid = "";
			//$('#my3').append('<div>入力されたメールを元にユーザーデータを探します。</div>');
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              	//alert(object);
                userName = (object.get("userName"));
                password = (object.get("userpass"));
                mailAddress = (object.get("Mail"));
                instaid = (object.get("instaid"));
                userclass = (object.get("userclass"));
                group = (object.get("group"));
	             if(mailAddress == my_email){
                objectId_d = (object.get("objectId"));
                userName_d = (object.get("userName"));
                password_d = (object.get("userpass"));
                mailAddress_d = (object.get("Mail"));
                instaid_d = (object.get("instaid"));
                userclass_d = (object.get("userclass"));
                group_d = (object.get("group"));
                	if (userclass_d == "管理者" && kengen !== "管理者"){
						$('#my3').append('<div style="color:#EA4335">パスコードが一般ユーザー用の物です。</div>');
						$('#my3').append('<div class="blue_btn" id="myhelp_mail">アカウントの確認</div>');
						$("#myhelp_mail").click(myhelp_mail);
						return;
                	}
					$('#my3').append('<div style="color:#EA4335">'+userName+'さんの情報が見つかりました。</div>');
					$('#saisettei').html('<h5>前のアカウントのパスワードを再設定してログインします。<h5>');
					var kekka ="あった";
					$('#my3').append('<div>再設定するパスワードを入力して確認してください。</div>');
					$('#my3').append('<div><input class="tuika_form" type="text" id="new_pass"></div><div id="pasugime"></div>');
					$('#my3').append('<div class="blue_btn" mail="'+mailAddress+'" id="tanmatu1" name="'+userName+'"  pass="'+password+'">変更内容確認</div>');
					$("#tanmatu1").click(tanmatu_login1);
	//確定処理１
	function tanmatu_login1() {
    var new_pass = $("#new_pass").val();
    if(new_pass == ""){
		$('#pasugime').html('<div style="color:#EA4335">変更するパスワードを入力してください。</div>');
		return;
    }
    var id = $(this).attr("name");	//リンク元のidを読み込み
    var pass = $(this).attr("pass");	//リンク元のidを読み込み
    var mail = $(this).attr("mail");	//リンク元のidを読み込み
    //alert(id +"と"+pass+"と"+mail);
    //alert("どうかな"+userName_d+"さん");
		
																//前データ削除
																ncmb.User.login(id, pass)
														        .then(function(user) {
																	    				//tanmatu_login2(id,pass,new_pass);
															        	user.delete()
																	    .then(function(data){
																			    ncmb.User.logout()
																			    currentLoginUser = null;
																	    				//alert("ログアウト処理owari名前"+id+"新パス"+new_pass);
																	    				ncmb.User.login("damy", "damy").then(function(data){}).catch(function(err){});
					$('#my3').html('<div>確認ができたらログインボタンを押してください。</div>');
					$('#my3').append('<div class="pnk_box">お名前：'+userName_d+'<br>パスワード：-表示できません-<br>クラス：'+userclass_d+'<br>メール：'+mailAddress_d+'</div>');
					$('#my3').append('<div class="blue_btn" id="tanmatu2" name="'+userName_d+'"  pass="'+password_d+'">'+userName_d+'パスワードを決定してログインする。</div>');
					$("#tanmatu2").click(tanmatu_login2);
		
																//前データ削除
			    	
																	    				
																	    				
        
																	//ここまで削除処理	
        																})
																	    .catch(function(err){});
																	}).catch(function(err){
																	});
	function tanmatu_login2() {
		//alert("ここ");
	//ユーザー登録処理
    //alert("名前「"+userName+"」パス「"+new_pass+"」クラス「"+userclass+"」メール「"+mailAddress+"」グループ「"+group+"」インスタ「"+instaid);
	var acl = new ncmb.Acl();
	acl.setPublicReadAccess(true); //全員への読み込み権限を許可
	acl.setPublicWriteAccess(true); //全員への書き込み権限を許可
    var user = new ncmb.User();
    user.set("userName", userName_d)
        .set("password", new_pass)
        .set("userpass", new_pass)
        .set("userclass", userclass_d)
        .set("Mail", mailAddress_d)
        .set("group", group_d)
        .set("instaid", instaid_d)
    	.set("acl",acl); // aclを設定
			$('#my3').append('ユーザー情報をデータベースに登録中<br />');
    // 任意フィールドに値を追加 
    
    user.signUpByAccount()
        .then(function(user) {
    //過去のチャットデータのIDを新IDに差し替え
    nwe_name = user.userName;
    nwe_objectId = user.objectId;
	var ContactData = ncmb.DataStore("ContactData");
	ContactData.limit(1000)
				.fetchAll()
	         .then(function(results){
	            for (var i = 0; i < results.length; i++) {
	              var object = results[i];
	              name = object.name;
	              nameID = object.nameID;
	              message = object.message;
	              
	              if(nameID == objectId_d){
	              	alert("書き換え"+message);
            object.set('nameID', nwe_objectId).update();
	              	
	              }
	            }
	         });
			$('#saisettei').append('アプリ情報の初期化中<br />');
            //カレントユーザー登録
    		ncmb.User.login(userName_d, new_pass);
            currentLoginUser = ncmb.User.getCurrentUser();
					    if (userclass !== "管理者") {
				     		$('.admin').hide();
				     		$('.ippan').show();
					    }else{
				     		$('.ippan').hide();
				     		$('.admin').show();
					    };
	    	$.mobile.changePage('#TopPage');
		    ons.notification.alert({title:group,message:"変更が完了しました。"});
				//location.reload();
        })
        .catch(function(error) {
		    		ons.notification.alert({title:group,message:"次のエラー発生：" + error});
        });
        //ここまでユーザーの新規登録
	}
	             results;
	}
	//ここまで再登録ログイン
	             }
            }
          if(kekka == "あった"){
			
          }else{
			$('#my3').append('<div>入力されたメールアドレスは見つかりませんでした。</div>');
			$('#my3').append('<div class="b_btn" id="myhelp_mail">アカウントの確認</div>');
			$("#myhelp_mail").click(myhelp_mail);
          }
          })
         .catch(function(err){
            alert(err);
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });
	
		    })//パスコード取得終了
		    .catch(function(err){
    			ons.notification.alert({title:"",message: 'メールアドレスが見つかりません。'});
			$('#my3').append('<div class="b_btn" id="myhelp_mail">アカウントの確認</div>');
			$("#myhelp_mail").click(myhelp_mail);
    			
		     });
}//アカウント再作成処理


//パスワード表示処理
function pass_replay() {
	//パスコード検索式
    var checkpasscode = $("#my_passcode").val();
    if (checkpasscode == ""){
    			ons.notification.alert({title:"エラー",message: 'パスコードが入力されていません。'});
			return;
    }
    
	var appdata = ncmb.DataStore("appdata");
		appdata.equalTo('').fetch()
		   .then(function(results){
			var object = results;
				var passcode = (object.get("passcode"));
		var passcode0 = passcode[0];
		var passcode1 = passcode[1];
		er = 0;
	    if(checkpasscode == passcode0){
	    	kengen = "一般";
	    }else if(checkpasscode == passcode1){
	    	kengen = "管理者";
	    }else{
			ons.notification.alert({title:"エラー",message: '正しいパスコードが入力されていません。'});
		er = 1;
	    }
	  if (er == 1){
    			return;
	  }

    //instaID取得
    my_email = $("#my_email").val();
    if (my_email == ""){
    			ons.notification.alert({title:"エラー",message: 'メールアドレスが入力されていません。'});
			return;
			
    }
	//保護者リスト取得
	ncmb.User.limit(1000)
			.fetchAll()
         .then(function(results){ 
         	instaid = "";
			//$('#my3').append('<div>入力されたメールを元にユーザーデータを探します。</div>');
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              	//alert(object);
                userName = (object.get("userName"));
                password = (object.get("userpass"));
                mailAddress = (object.get("Mail"));
                instaid = (object.get("instaid"));
                userclass = (object.get("userclass"));
                group = (object.get("group"));
	             if(mailAddress == my_email){
                objectId_d = (object.get("objectId"));
                userName_d = (object.get("userName"));
                password_d = (object.get("userpass"));
                mailAddress_d = (object.get("Mail"));
                instaid_d = (object.get("instaid"));
                userclass_d = (object.get("userclass"));
                group_d = (object.get("group"));
                //alert("権限"+userclass_d+"条件"+kengen)
                	//呼び出しアカウントが管理者の場合、パスコードも管理者である必要がある
                	if (userclass_d == "管理者" && kengen !== "管理者"){
						ons.notification.alert({title:"エラー",message: 'パスコードが一般ユーザー用の物です。'});
						return;
                	}
					$('#saisettei').html('<h5>前のアカウントのパスワードを再設定してログインします。<h5>');
					ons.notification.alert({title:'「'+userName+'」さんのパスワードは',message: '「'+password_d+'」です。'});
					var kekka ="あった";
	             }
            }
          if(kekka == "あった"){
			
          }else{
    			ons.notification.alert({title:"エラー",message: '入力されたメールアドレスは見つかりませんでした。'});
          }
          })
         .catch(function(err){
            alert(err);
    			ons.notification.alert({title:"",message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });
	
		    })//パスコード取得終了
		    .catch(function(err){
    			ons.notification.alert({title:"",message: 'メールアドレスが見つかりません。'});
			$('#my3').append('<div class="b_btn" id="myhelp_mail">アカウントの確認</div>');
    			
		     });
}//アカウント再作成処理
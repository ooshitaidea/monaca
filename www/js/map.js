// This is a JavaScript file
	var elements ="";
    var roop ="";
    var roopend ="";
$(function(){
    //起動時にmobile backend APIキーを設定
        NCMB.initialize(appKey,clientKey);
});


function map_open(){
	insta_kousin();
	$.mobile.changePage('#map_page');
			$(".load").show();
			$('.blue_btn').show();
			$('.blue_btn2').hide();
	//会員情報から配信バス情報をセット
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    objectId = currentUser.get("objectId");
	    userclass = currentUser.get("userclass");
	    instaid = currentUser.get("instaid");
		title = currentUser.get("userName");
	}
	
	//管理者がバス情報を持ってたら発信ボタン表示
	var Bus = ncmb.DataStore("Bus");
		if(userclass == "管理者"){
		Bus.equalTo('user_id',objectId).fetch()	//現在のログインユーザーがバス情報の中に入ってないかチェック
		   .then(function(Bus_data){
				var bus_name = (Bus_data.get("name"));

				if(bus_name == undefined || bus_name == "登録無し"){
					$('#sousin').hide();
					$('#no_sousin').show();
				}else{
					$('#bus_name').html(bus_name);
					$('#sousin').show();
					$('#no_sousin').hide();
				}
				
			})
			.catch(function(err){
				$('#bus_name').html("登録無し");
				$('#sousin').hide();
				$('#no_sousin').show();
			});
		}
	
	//最初の一回だけ読み込み
	if(elements == ""){
	//alert("初期読み込み");
	var pmap = new Promise(function (resolve, reject) {
		setTimeout(function(){
		get_map(resolve, reject);
		}, 1000);
	}); 
	

		//バス停登録情報をマップに表示
        var Point = ncmb.DataStore ("Point");
        Point.equalTo('name',title)
        	.limit(1000)
        	.fetch()
    	.then(function(results) {
    		//alert(instaid);
    		bustei_instaid = results.get("instaid");
    		bustei_geo = results.get("geo");
    		bustei_name = results.get("name");
    		//alert('名前'+bustei_name+'インスタ'+instaid+'検索インスタ'+bustei_instaid);
            var bustei_myLatlng = new google.maps.LatLng(bustei_geo.latitude,bustei_geo.longitude);
			$('#map_log').html(bustei_name+'さんが現在登録されているバス停はこちらです');
				InfoWindow.setPosition(bustei_myLatlng);			//既存のウィンドウを移動
				InfoWindow.setContent(bustei_name);				//既存のウィンドウの内容を変更
				map.panTo(bustei_myLatlng);						//中心地を合わせて移動
    	})
		.catch(function(err){
			if(userclass !== "管理者"){
				$('#map_log').html("現在登録されているバス停がありません。<br>");
			}
		});
	Promise.all([pmap]).then(function (value) {
		mapdata = value[0];
		map = mapdata[0];
		InfoWindow = mapdata[1];
		geoPoint = mapdata[2];
			

	
	//各バスの位置情報ボタン読み込み
	var SpotClass = ncmb.DataStore("Bus");
    SpotClass.limit(1000)
		.order("No",true)
		.fetchAll()
		.then(function(stores) {
		// 検索が成功した場合の処理
			$('#viwe').html("");
			
		elements = document.getElementById("map_canvas");
            for (var i = 0; i < stores.length; i++){
				var store = stores[i];
				var storeName = store.get("name");
				var colo = "";
					if (i == 0){colo = "4a67ad";
					}else if (i == 1){colo = "ff5a60";
					}else if (i == 2){colo = "f6b214";
					}
				$('#viwe').prepend('<div id="vi" class="bus_btn" name="'+storeName+'" style="background:#'+ colo +'"><div class="icon"><img src="img/bus_compass.png"></div>'+storeName+'を<br>表示');
				$(".load").hide();
			}
			map_view();
			saveSpot();
			sousin();
			})						
			.catch(function(error) {
				// 検索に失敗した場合の処理
				$(".load").hide();
				$('#map_log').html('<div class="white_block" onclick="onLogoutBtn()">読込できません！再度ログインしてください<br><i class="fa fa-sign-out"></i></div>');
				//alert(error.message);
			});
			
			
		//バスの位置表示内部処理
		function map_view(){
		  $('#viwe').on('click', '#vi', function(event) {
		    if (self.clickEnabled == true) {
				$('.load').show();
				//alert(InfoWindow);
				self.clickEnabled = false;
				setTimeout(function(){ self.clickEnabled = true; }, 500);
				var bus_name = $(this).attr("name");
				var BusClass = ncmb.DataStore("Bus"); 
				BusClass.equalTo('name',bus_name)
					.fetch()
					.then(function(stores) {
					jikan = moment(stores.updateDate).format('DD日HH時mm分ss秒');
				$('#map_log').html(bus_name+'の現在地表示しました。<br>'+jikan);
		                  // 検索が成功した場合の処理
		                      var store = stores;
		                      var detail = "";
		                      var storeName = store.get("name");
		                      detail += storeName +"<br>";
		                      var storeLocation = store.get("geo");
		                      var myLatlng = new google.maps.LatLng(storeLocation.latitude, storeLocation.longitude);
								//markToMap(detail, myLatlng, map);		//マップに追加ウィンドウ	
								InfoWindow.setPosition(myLatlng);			//既存のウィンドウを移動
								InfoWindow.setContent(detail);				//既存のウィンドウの内容を変更
								map.panTo(myLatlng);						//中心地を合わせて移動
							$(".load").hide();
		               })
		              .catch(function(error) {
							$(".load").hide();
							//alert(error);
		              });
		    }
		    event.stopPropagation();
		  });
		}
		
		
		

		//スポットを登録する内部処理
		function saveSpot(){
		  $('#savespot').on('click', function(event) {
		    if (self.clickEnabled == true) {
		      self.clickEnabled = false;
		      setTimeout(function(){ self.clickEnabled = true; }, 500);
				$('.load').show();
				$('#load_txt').html("バス停登録中");
				$('.blue_btn').hide();
				$('.blue_btn2').show();
		    insta_kousin();
		    //位置情報が取得できたときの処理
				var id = localStorage.getItem('instaid');
				//alert(id);
		
		        //位置情報オブジェクトを作成
		        //グーグルマップ用位置情報作成
					google_geo = new google.maps.LatLng(geoPoint.latitude,geoPoint.longitude);
		
					InfoWindow.setPosition(google_geo);			//既存のウィンドウを移動
					InfoWindow.setContent(title);				//既存のウィンドウの内容を変更
					map.panTo(google_geo);						//中心地を合わせて移動
		        //Spotクラスのインスタンスを作成★
		        var Point = ncmb.DataStore ("Point");
				var new_Point = new Point();
		        Point.equalTo('name',title)
		        	.limit(1000)
		        	.fetch()
		    	.then(function(results) {
		            results.set('geo', geoPoint);
		            results.set("instaid" , id).update();
					$(".load").hide();
					$('#load_txt').html("ロード中");
					ons.notification.alert({title:'スポットを更新しました',message:'バスがこの近くまで来た時に通知が来ます'});
					$('#map_log').html('現在登録されているバス停はこちらです');
		        })
				.catch(function(err){ // エラー処理
					new_Point.set("name",title);
					new_Point.set("geo" , geoPoint);
					new_Point.set("instaid" , id);
		
					//保存を実行★
					new_Point.save();
					$(".load").hide();
					$('#load_txt').html("ロード中");
					ons.notification.alert({title:'スポットを登録しました',message:'バスがこの近くまで来た時に通知が来ます'});
					$('#map_log').html('現在登録されているバス停はこちらです');
					});
					
			     	$('.blue_btn').show();
					$('.blue_btn2').hide();
					
		    }});
		}
	// イベントの設定
	google.maps.event.addListener( InfoWindow, "closeclick", function( arg ) {
		InfoWindow.open(map);
	} ) ;
		
		
	
	
		//現在地送信
		function sousin() {
			$('#sousin').on('click', function(event) {
			if (self.clickEnabled == true) {
				self.clickEnabled = false;
				setTimeout(function(){ self.clickEnabled = true; }, 500);
			      
			//送信中はマップ操作系ボタンを非表示
			$('[id=vi]').hide();
			if(roopend == "owari"){
				roopend = "";
			    $('[id=vi]').show();
				return;
			}
			
			if(mode !== "debug"){
				//アプリを閉じなように固定
				window.plugins.insomnia.keepAwake();
			}
			var p0 = new Promise(function (resolve, reject) {
				get_geo(resolve, reject);//現在地
			});
			var pbus = new Promise(function (resolve, reject) {
				get_Bus(resolve, reject);//自分がセットしてるバス情報
			});
			
			if(roop == "") {
				$('#bus_sousin_btn').html('<div class="bus_btn admin" id="sousin" style="background:#fb3e24;"><div class="icon"><img src="img/bus_pin2.png"></div>送信<br>停止する</div>');
				$('#map_log').html("バスの位置情報送信開始・・・<br>");
				roop = "on";
				sousin();
			}else if (roop == "on"){
				roop = "";
				roopend = "owari";
				$('#map_log').prepend("現在地送信を停止します<br>");
				$('#bus_sousin_btn').html('<div class="bus_btn admin" id="sousin" style="background:#34a9db;"><div class="icon"><img src="img/bus_pin2.png"></div>現在地<br>発信開始</div>');
				sousin();
				return;
			}
			data_point = [];
			var new_xy = new google.maps.LatLng(33.262569,130.2968555);
			var tokyo  = new google.maps.LatLng(35.681298,139.766247);
			
			Promise.all([p0]).then(function (value) {
					geo_value = value[0];
					//markToMap("東京", new_xy, map);
			});
			
			//ここからループ
		    var kurikaesi = setInterval(function(){
		    
		    //ループ内での座標取得
			var p2= new Promise(function (resolve, reject) {
				get_geo(resolve, reject);
			});
			
			Promise.all([p0, pbus, p2]).then(function (value) {
				geo_value = value[0];
				Bus_value = value[1];
				geo_value2 = value[2];
		            var bass = Bus_value.get("name");
		            var kyori = Bus_value.get("kyori");
		                var user_name = Bus_value.get("user_name");
					InfoWindow.setContent(bass);				//既存のウィンドウの内容を変更
		        //現在位置情報オブジェクトを作成
		            var myLatlng = new google.maps.LatLng(geo_value.latitude,geo_value.longitude);
		            var new_geo = new google.maps.LatLng(geo_value2.latitude,geo_value2.longitude);
		            //alert(geo_value2.latitude+"あ"+geo_value2.longitude);
			
			if (roop == ""){
				if(mode !== "debug"){
					//アプリを閉じれるように解除
					window.plugins.insomnia.allowSleepAgain();
				}
				$('#map_log').prepend("現在地送信を停止しました<br>");
				clearInterval(kurikaesi);
			     	$('[id=vi]').show();
				return;
			}
		        
			//登録ポイントに近づいたらプッシュ通知
				//alert(bass);
			var Point = new NCMB.Query('Point');
				Point.withinKilometers("geo",geo_value2,kyori);
		    Point.find({
		        success: function(points) {
		            // 検索が成功した場合の処理
		            for (var i = 0; i < points.length; i++){
		                var point = points[i];
		                var name = point.get("name");
		                var instaid = point.get("instaid");
		                if ( data_point.indexOf(name) == -1) {
							//alert("バス"+bass+data_point+"ポイント"+name);
							data_point.push(name);
							$("#map_log").html(bass+'が通過したポイント【'+data_point+'】<br>最後に'+name+'の近くに行きました。<br>');
							Bus_value.set('true_point', data_point).update();
							    NCMB.Push.send({
							      title: '【GPS通知】',
							      message: bass+'が'+name+'付近に来ています',
							      immediateDeliveryFlag: true,
							      target: ["ios", "android"],
							      badgeIncrementFlag:false,
							      badgeSetting:1,
								  sound: "default",
							      searchCondition: {
										"objectId": instaid,
							      },
							    });
						}
		            }
		        },
		        error: function(error) {
					$("#map_log").append(error.message);
		        }
		    });
		    var kousin_time = new Date();
				kousin_time = moment(kousin_time).format('HH時mm分ss秒');
				$("#map_time").html('('+kousin_time+"に更新)");
			//中心地変更
				map.panTo(new_geo);
			//データベース座標更新
				Bus_value.set('geo', geo_value2).update();
			//ピン表示
				//markToMap(bass, new_geo, map);
			//ピン表示ダミー
				//markToMap("東京", tokyo, map);
			//ピン移動
				InfoWindow.setPosition(new_geo);
			//ピンはね
				//InfoWindow.setAnimation(google.maps.Animation.BOUNCE);
			
			//自作ピンのポップアップ有効化？
				infowindow.set("noSuppress", true);
						
			}, function (value) {
			});
		    
		    },5000);	//送信間隔
			    }});
		}
		

	}, function (value) {
	});
	
	}else{
		$(".load").hide();
	}
		
	
	
	
	
	
}
//ピンを立てる
function markToMap(title, myLatlng, map){
		var InfoWindow = new google.maps.InfoWindow({
			position: myLatlng,
			content:title,
			noSuppress: true
		});
	InfoWindow.open(map);
}

//位置情報取得に失敗した場合のコールバック
var onError = function(error){
	ons.notification.alert({title:'現在位置取得エラー',message:'位置情報を取得できませんでした。端末の設定で位置情報の取得を許可しているかご確認ください。'});
	$(".load").hide();
};

//位置情報取得時に設定するオプション('
var option = {
    timeout: 8000   //タイムアウト値(ミリ秒)
};


//バスget
function get_Bus(resolve, reject) {
	var Bus = ncmb.DataStore("Bus");
        Bus.equalTo('user_id',objectId)
		.fetch()
    	.then(function(results) {
                resolve(results);
        })
		.catch(function(err){ // エラー処理
			ons.notification.alert({title:"",message: 'データベースの読み込みができませんでした'});
		});
};

//位置情報取得
function get_geo(resolve, reject) {
    var onSuccess = function (location){
        var geoPoint = new NCMB.GeoPoint(location.coords.latitude, location.coords.longitude);
		resolve(geoPoint);
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
};

//初回マップ生成
function get_map(resolve, reject) {
    var onSuccess = function (location){
        var geoPoint = new NCMB.GeoPoint(location.coords.latitude, location.coords.longitude);
		//マップ表示
		var mapOptions = {
			center: en_point[1],	//中心地設定
			zoom: 15,	//ズーム設定
			mapTypeId: google.maps.MapTypeId.ROADMAP,	//地図のタイプを指定
			mapTypeControl: false	//マップの表示タイプ変更ボタンを削除
		};
        var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
		//マップ表示ここまで
		
		//初期マップピン表示
		var InfoWindow = new google.maps.InfoWindow({
			position: en_point[1],
			content:en_point[0],
			noSuppress: true
		});
	InfoWindow.open(map);
	//自作ピンのポップアップ有効化？
		InfoWindow.set("noSuppress", true);
	resolve([map,InfoWindow,geoPoint]);
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
};



//デフォルトマップ情報のポップアップ制限
(function fixInfoWindow() {
    var set = google.maps.InfoWindow.prototype.set;
    google.maps.InfoWindow.prototype.set = function(key, val) {
        if (key === "map") {
            if (! this.get("noSuppress")) {
                return;
            }
        }
        set.apply(this, arguments);
    };
})();




   
        
        ///// Called when app launch
        $(function() {
          NCMB.initialize(appKey, clientKey);
	 	  $('#photojyokyo').html('写真データをロード中です');
        });





function Phototouroku_page() {
			$('.blue_btn').show();
			$('.blue_btn2').hide();
	     	$('#picture_area').hide();
		$.mobile.changePage('#Phototouroku');
		$('#picture_area').html('<img id="picture" src="" width="70%">');
		$('#photo_form_checkbox').html('');
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			$('#photo_form_checkbox').prepend('<div><input type="checkbox" id="0'+for_c+'"><label for="0'+for_c+'">'+class_datalist[for_c]+'</label></div>');
		}
		$('input').val("");
		$('textarea').val("");
}
	kazu = 0;
function kuria() {
	kazu = kazu+1;
	//$("label").removeClass("class属性値");
	//	$('.target').html('test'+kazu);
	alert($('#id_1').attr('name'));
	$('.target').each(function(){
		var txt = $(this).text();
		$(this).text(
			txt.replace(/on/g,"")
		);
	});
    						//alert("クリア");
}
    
    
    
    
	//データベースからフォトデータ読み込み
function photopage() {
	$('.load').show();
	    $.mobile.changePage('#photomenu');
		$('#photo_title').html('Photo Album');
	    
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    userclass = currentUser.get("userclass");
	    objectId = currentUser.get("objectId");
	}
	
	$('.classlist').html('');
	for(for_c = 0;for_c < class_datalist.length ;for_c++){
		$('.classlist').prepend('<li id="pas'+class_datalist[for_c]+'">'+class_datalist[for_c]+'</li>');
	}
	$('.classlist').prepend('<li id="pasmix" class="none">全クラス</li><li class="spase"></li>');
	
		//個別ページへの移動処理　タイトル変更
		$('.classlist li').each(function(){
			$(this).click(function(){
	    		$.mobile.changePage('#photoPage');
    			//alert($(this).attr("id"));
				var idname = $(this).attr("id").substring(3);
				var classname = '.';
				classname += idname;
				if(idname == "mix"){
					idname="全クラス";
				}
				$('#photo_title').html(idname);
				$('#Parks li:not(classname)').css('display','none');
				$(classname).fadeIn(200);
			});
		});	
	
	
	
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
            results.set('photo_open', open_time).update();
        })
		.catch(function(err){ // エラー処理
		});
	
	    
	var ImgData = ncmb.DataStore("ImgData");
	ImgData.limit(1000)
			.fetchAll()
	         .then(function(results){
				$('#photojyokyo').html('');
				$('#Parks').html('');
	         	if (results.length == 0){
					$('#Parks').prepend('<li>申し訳ありませんが、写真は現在何も登録されていません。</li>');
	         	};
	         	
					var deleteicon = '';
				if (userclass == "管理者") {
					var deleteicon = '<img src="img/delete_icon.png">';
				}else{
					var deleteicon = '';
				};
					var hozonicon = '';
				
	            for (var i = 0; i < results.length; i++) {
	              var object = results[i];
	              objectid =  object.objectId;
	              ImgNo = object.ImageNo;
	              ImgName = object.ImageName;
	              ImageText = object.ImageText;
	              ImgClass = object.ImageClass;
	              ImgData = object.createDate;
			       	ImgData = ImgData.replace( /T/g , "/" );
       				ImgData = ImgData.substr( 0, ImgData.length-14 );
					var ImgClass = ImgClass.join(" ");
					var url = imgsrc+ImgNo+'.jpg';
					if(ImageText == undefined || ImageText ==""){
						main = "";
					}else{
						main = '<div class="img_text">'+ImageText+'</div>';
					}
				$('#Parks').prepend('<li class="mix '+ImgClass+'">'+
					'<div class="img_area"><img src="'+imgsrc+ImgNo+'.jpg" onload="imgLoded(this)"/><div id="delete" class="'+objectid+'">'+deleteicon+'</div></div>'+
					'<div class="cf"><div class="left"><div class="title">'+ImgName+'</div><div class="data">'+ImgData+'</div></div>'+
					main +'<div id="img_hozon" class="'+url+'" name='+ImgName+'>'+hozonicon+'</div>'+
					'</li>');
	            }
	            img_hozon();
	            imgDeleteLink();
	         $(".load").hide();
	          })
	         .catch(function(err){
				//$('#photojyokyo').html('写真データの読み込みが失敗しました。');
				$('.classlist').html('');
	         $(".load").hide();
				$('#photojyokyo').html('<div class="white_block" onclick="onLogoutBtn();">写真データの読込ができません！再度ログインしてください<br><i class="fa fa-sign-out"></i></div>');
					//ons.notification.alert({title:"エラー",message: '写真データの読み込みが失敗しました。再度ログインしてください。'});
					//alert(err);
	          });
}



//画像保存処理
function img_hozon() {
  $('#Parks').on('click', '#img_hozon', function(event) {

    // タップ設定が有効であれば処理を行います
    // これは二重処理の防止です
    if (self.clickEnabled == true) {
      // 一旦二重処理を防ぎます
      self.clickEnabled = false;

      // フラグは1秒後に立て直します
      setTimeout(function(){ self.clickEnabled = true; }, 1000);
  
    var url = $(this).attr("class");
    var imgname = $(this).attr("name");
        ons.notification.confirm({
            title: '',
            message: '保存するためにブラウザで画像を開きます',
            buttonLabels: ['いいえ', 'はい'],
            animation: 'default',
            cancelable: true,
            callback: function(index) {
                if(index == -1) {
                    console.log('confirmのコールバック:キャンセル');
                } else if(index == 0) {
                    console.log('confirmのコールバック:No');
                } else if(index == 1) {
                    console.log('confirmのコールバック:Yes');
                    //終了タグは後ろ
					var ref = window.open(url, '_system');
                }
            }
        });
    }
    event.stopPropagation();
  });
}
//画像デリート処理
function imgDeleteLink() {
  $('#Parks').on('click', '#delete', function(event) {

    // タップ設定が有効であれば処理を行います
    // これは二重処理の防止です
    if (self.clickEnabled == true) {
      // 一旦二重処理を防ぎます
      self.clickEnabled = false;

      // フラグは1秒後に立て直します
      setTimeout(function(){ self.clickEnabled = true; }, 1000);
  
    var data_objectId = $(this).attr("class");
	var data_li = $(this).parents("li");
	 
	var ImgData = ncmb.DataStore("ImgData");
        ImgData.equalTo('objectId',data_objectId)
        	.fetch()
    	.then(function(results) {
				var delete_title = (results.get("ImageName"));
        
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
                    
	 
                    
					
	var ImgData = ncmb.DataStore("ImgData");
	var ImgData = new ImgData();
	ImgData.set("objectId", data_objectId)
      .delete()
      .then(function(result){
			ons.notification.alert({title:"",message: '写真を削除しました。'});
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

// メモ削除成功時の処理
var successRemoveMemoCallback = function(){
  hideLoadingDialog();
  getList();
};
      
       function toBlob(base64) {
            var bin = atob(base64.replace(/^.*,/, ''));
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            // Blobを作成
            try{
                var blob = new Blob([buffer.buffer], {
                    type: 'image/jpeg'
                });
            }catch (e){
                return false;
            }
            return blob;
       }

        //カメラから撮影
   　　 function snapPicture(){
	 	  $('#camerajyokyo').html('カメラ起動中');
            navigator.camera.getPicture (onSuccess, onFail, { 
					quality: 50,
					targetWidth: 500,
					targetHeight: 900,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA
                });
                
            //成功した際に呼ばれるコールバック関数
            function onSuccess (imageData) {
	 	  $('#camerajyokyo').html('撮影したファイルをアップロード中');
                	//ファイル名決める
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
					       var fileName = files.length + 1 +".jpg"; //保存File名
			                var byteCharacters = toBlob(imageData);
			                var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
			                NCMBFile.save().then(function() {
                		
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("picture");
								$('#picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
						$('#camerajyokyo').html('画像の認識ができました。<br>詳細情報を入力して登録してください。');
					    });
                },
                function(error) {
                　// The file either could not be read, or could not be saved to NCMB.
                  alert(JSON.stringify(error));
                });
            }
    
            //失敗した場合に呼ばれるコールバック関数
            function onFail (message) {
                alert ('エラーです: ' + message);
            }
   　    }
   　 

        //ファイルから選択
   　　 function snapPicture2(){
            navigator.camera.getPicture (onSuccess, onFail, { 
					quality: 50,
					targetWidth: 500,
					targetHeight: 900,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
                
            //成功した際に呼ばれるコールバック関数
            function onSuccess (imageData) {
	 	  $('#camerajyokyo').html('選択したファイルをアップロード中');
                	//ファイル名決める
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
					       var fileName = files.length + 1 +".jpg"; //保存File名
			                var byteCharacters = toBlob(imageData);
			                var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
			                NCMBFile.save().then(function() {
                		
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("picture");
								$('#picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
						$('#camerajyokyo').html('画像の認識ができました。<br>詳細情報を入力して登録してください。');
					    });
                },
                function(error) {
                　// The file either could not be read, or could not be saved to NCMB.
                  alert(JSON.stringify(error));
                });
            }
    
            //失敗した場合に呼ばれるコールバック関数
            function onFail (message) {
                alert ('エラーです: ' + message);
            }
   　    }
   　 
   　 
   　 
$("document").ready(function(){
	
	
    $("#file_photo").change(function() {
	 	  $('#camerajyokyo').html('選択したファイルをアップロード中');
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
		      // 検索成功後処理
		       file_count = 0;
		       file_count = files.length + 1;
      		   var fileName = file_count+".jpg"; //保存File名
    	
			       //アップロード処理
				      var fileData = document.getElementById("file_photo").files[0];
				      
      var file = document.getElementById("file_photo").files[0];
      if (file != null) {
        var reader = new FileReader();
        reader.onload = onImageLoad;
        reader.readAsDataURL(file);
      }
      
    function onImageLoad(e) {
      var largeData = e.target.result;
      var smallData = makeSmall(largeData);
      //previewLarge.src = largeData;
      //previewSmall.src = smallData;
    }
    
    // 画像データ(DataURL)を縮小して返す
    function makeSmall(data) {
      // 画像データの縦横サイズを取得する
      var image = document.createElement('img');
      image.src = data;
      var width = image.naturalWidth;
      var height = image.naturalHeight;

      // 縮小する。今回は縦横それぞれ1/2
      var canvas = document.createElement('canvas');
      if (width >= 500){
      	//alert("横はは"+width+"で大きいので縮小");
      yoko = 500;
      tate = height * (500/width);
		//$('#camerajyokyo').html('画像サイズが長すぎたため<br>縮小しました<br>横('+width+')縦('+height+')<br>から<br>横('+yoko+')縦('+tate+')<br>比率('+(500/width)+')');
      
      //alert("縮小率は"+ (500/width)+"で、高さは"+tate+"横は"+yoko);
      }else{
      	//alert("問題ないからそのままいくよ");
      	yoko = width;
      	tate = height;
      }
      canvas.width = yoko;
      canvas.height = tate;
      //canvas.width = width / 2;
      //canvas.height = height / 2;
      canvas.getContext("2d").drawImage(image, 0, 0, yoko,tate);
      //canvas.getContext("2d").drawImage(image, 0, 0, width / 2, height / 2);
      url = canvas.toDataURL('image/jpeg');
      //var base64data = url.split(',')[1];
      var byteCharacters = toBlob(url);
				      
				      
				      
				      
				      
				      
				      
				      
				      //ncmb.File.upload(fileName, byteCharacters)
				      //.then(function(res){
							var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
							NCMBFile.save().then(function(res) {
				          // アップロード後処理
						$('#camerajyokyo').append('<br>画像の認識ができました。<br>詳細情報を入力して登録してください。');	
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("picture");
								$('#picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
		    				//return canvas.toDataURL();
				        })
				        .catch(function(err){
				          // エラー処理
								$('#jyoukyo').append('アップロードに失敗にしています'+err+'<br>');
				        });
    }
		    }).catch(function(err){
		    	alert(err+"ファイルアップロードエラー");
		    	});
    });
});
      
      
      
      

function onFormSend() {
	     	$('.blue_btn').hide();
			$('.blue_btn2').show();


    var name;
    src = $("#picture").attr('src');
    if (src == ""){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		ons.notification.alert({title:'',message:"写真を挿入してください。"});
    			return;
    }
    
    name = $("#imgname").val();
    text = $("#img_honbunname").val();
    if (name == ""){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		ons.notification.alert({title:'',message:"写真のタイトルを入力してください。"});
    			return;
    }
    var EnjiClass=[];
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
 			if($("#0"+for_c).prop('checked')) {EnjiClass.push(class_datalist[for_c]); }
		}
						
		     				//alert("データ"+EnjiClass);
						
	//既存のデータ数カウント
		ncmb.File.equalTo("")
			.limit(1000)
			.fetchAll()
			.then(function(files){
				// 検索成功後処理
				var fileName = 0;
				var fileName = files.length;
				var fileData =  new NCMB.File(fileName);
				
					var ImgData = ncmb.DataStore("ImgData");
					var imgdata = new ImgData();
					//alert("name："+name);
					//alert("fileName："+fileName);
					//alert("strname："+strname);
					//alert("クラス名処理前："+strclass);
					imgdata.set("ImageName", name)
							.set("ImageText", text)
							.set("ImageNo", fileName)
							.set("ImageClass", EnjiClass)
							.save()
							.then(function(imgdata){
							var imgdata_id = (imgdata.get("objectId"));
							// 保存後の処理
		     				//alert("Photoページに登録されました");
							$('#upkakunin').html('');
							$('#camerajyokyo').html('');
							
    NCMB.Push.send({
      title:"【写真追加】",
      message: "Photo Albumに写真が追加されました"+imgdata_id,
      immediateDeliveryFlag: true,
      target: ["ios", "android"],
      badgeIncrementFlag:false,
      badgeSetting:1,
	  sound: "default",
      searchCondition: {"albume":"受信する"},
    }).then(function(e) {
    });
						    
		     				//alert("strは！！！！"+strname+"と"+strclass+"です");
    						//ons.notification.alert({title:"アップロードが成功しました",message: ' '});
							Phototouroku_page();
					    ons.notification.alert({title:'',message:"アップロード成功"});
						     	$('.blue_btn').show();
								$('.blue_btn2').hide();
							})
							.catch(function(err){
							// エラー処理
		     				//alert("データベースアップロードエラー"+err);
					    		ons.notification.alert({title:'データベースアップロードエラー',message:err});
					     	$('.blue_btn').show();
							$('.blue_btn2').hide();
							$('#upkakunin').html('');
							});
			})
			.catch(function(err){
				// エラー処理
		     	$('.blue_btn').show();
				$('.blue_btn2').hide();
				alert("ファイルリクエストエラー"+err);
			});
			
			
			
			
}















function toukou_app() {
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
	     	$('#oshirase_picture_area').hide();
	    $.mobile.changePage('#oshirase_touroku');
	    $('#oshirase_picture_area').html('<img id="oshirase_picture" src="" width="70%">');
	 	  $('#oshirase_photo_form_checkbox').html('');
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			$('#oshirase_photo_form_checkbox').prepend('<div><input type="checkbox" id="00'+for_c+'"><label for="00'+for_c+'">'+class_datalist[for_c]+'</label></div>');
		}

    						$('input').val("");
    						$('textarea').val("");
}


        //カメラから撮影
   　　 function oshirase_snapPicture(){
	 	  $('#oshirase_camerajyokyo').html('カメラ起動中');
            navigator.camera.getPicture (onSuccess, onFail, { 
					quality: 50,
					targetWidth: 500,
					targetHeight: 900,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA
                });
                
            //成功した際に呼ばれるコールバック関数
            function onSuccess (imageData) {
	 	  $('#oshirase_camerajyokyo').html('撮影したファイルをアップロード中');
                	//ファイル名決める
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
					       var fileName = files.length + 1 +".jpg"; //保存File名
			                var byteCharacters = toBlob(imageData);
			                var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
			                NCMBFile.save().then(function() {
                		
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("oshirase_picture");
								$('#oshirase_picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
						$('#oshirase_camerajyokyo').html('画像の認識ができました。<br>詳細情報を入力して登録してください。');
					    });
                },
                function(error) {
                　// The file either could not be read, or could not be saved to NCMB.
                  alert(JSON.stringify(error));
                });
            }
    
            //失敗した場合に呼ばれるコールバック関数
            function onFail (message) {
                alert ('エラーです: ' + message);
            }
   　    }
   　 

        //ファイルから選択
			function oshirase_snapPicture2(){
            navigator.camera.getPicture (onSuccess, onFail, { 
					quality: 50,
					targetWidth: 500,
					targetHeight: 900,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
                
            //成功した際に呼ばれるコールバック関数
            function onSuccess (imageData) {
	 	  $('#oshirase_camerajyokyo').html('選択したファイルをアップロード中');
                	//ファイル名決める
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
					       var fileName = files.length + 1 +".jpg"; //保存File名
			                var byteCharacters = toBlob(imageData);
			                var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
			                NCMBFile.save().then(function() {
                		
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("oshirase_picture");
								$('#oshirase_picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
						$('#oshirase_camerajyokyo').html('画像の認識ができました。<br>詳細情報を入力して登録してください。');
					    });
                },
                function(error) {
                　// The file either could not be read, or could not be saved to NCMB.
                  alert(JSON.stringify(error));
                });
            }
    
            //失敗した場合に呼ばれるコールバック関数
            function onFail (message) {
                alert ('エラーです: ' + message);
            }
   　    }

$("document").ready(function(){
	
	
    $("#oshirase_file_photo").change(function() {
	 	  $('#oshirase_camerajyokyo').html('選択したファイルをアップロード中');
					  ncmb.File.equalTo("")
						.limit(1000)
					    .fetchAll()
					    .then(function(files){
		      // 検索成功後処理
		       file_count = 0;
		       file_count = files.length + 1;
      		   //var fileName = file_count+"uploaded.jpg"; //保存File名
      		   var fileName = file_count+".jpg"; //保存File名
    	
			       //アップロード処理
				      var fileData = document.getElementById("oshirase_file_photo").files[0];
				      
      var file = document.getElementById("oshirase_file_photo").files[0];
      if (file != null) {
        var reader = new FileReader();
        reader.onload = onImageLoad;
        reader.readAsDataURL(file);
      }

    function onImageLoad(e) {
      var largeData = e.target.result;
      var smallData = makeSmall(largeData);
      //previewLarge.src = largeData;
      //previewSmall.src = smallData;
    }
    
    // 画像データ(DataURL)を縮小して返す
    function makeSmall(data) {
      // 画像データの縦横サイズを取得する
      var image = document.createElement('img');
      image.src = data;
      var width = image.naturalWidth;
      var height = image.naturalHeight;

      // 縮小する。今回は縦横それぞれ1/2
      var canvas = document.createElement('canvas');
      if (width >= 500){
      	//alert("横はは"+width+"で大きいので縮小");
      yoko = 500;
      tate = height * (500/width);
		//$('#camerajyokyo').html('画像サイズが長すぎたため<br>縮小しました<br>横('+width+')縦('+height+')<br>から<br>横('+yoko+')縦('+tate+')<br>比率('+(500/width)+')');
      
      //alert("縮小率は"+ (500/width)+"で、高さは"+tate+"横は"+yoko);
      }else{
      	//alert("問題ないからそのままいくよ");
      	yoko = width;
      	tate = height;
      }
      canvas.width = yoko;
      canvas.height = tate;
      //canvas.width = width / 2;
      //canvas.height = height / 2;
      canvas.getContext("2d").drawImage(image, 0, 0, yoko,tate);
      //canvas.getContext("2d").drawImage(image, 0, 0, width / 2, height / 2);
      url = canvas.toDataURL('image/jpeg');
      //var base64data = url.split(',')[1];
      var byteCharacters = toBlob(url);
				      
				      
				      
				      
				      
				      
				      
				      //ncmb.File.upload(fileName, byteCharacters)
				      //.then(function(res){
							var NCMBFile = new NCMB.File(fileName, byteCharacters, 'image/jpeg');
							NCMBFile.save().then(function(res) {
				          // アップロード後処理
						$('#oshirase_camerajyokyo').append('<br>画像の認識ができました。<br>詳細情報を入力して登録してください。');	
			                  //NCMBサーバーからファイルをダウンロード
			                  var getFile =  new NCMB.File(fileName);
			                  var image_canvas = document.getElementById("oshirase_picture");
								$('#oshirase_picture_area').show();
			                  getFile.fetchImgSource(image_canvas);
		    				//return canvas.toDataURL();
				        })
				        .catch(function(err){
				          // エラー処理
								$('#oshirase_jyoukyo').append('アップロードに失敗にしています'+err+'<br>');
				        });
    }
		    }).catch(function(err){
		    	alert(err+"ファイルアップロードエラー");
		    	});
    });
});

function oshirase_onFormSend() {
	     	$('.blue_btn').hide();
			$('.blue_btn2').show();
				     

    var name;
    name = $("#oshirase_imgname").val();
    honbun = $("#oshirase_honbunname").val();
    src = $("#oshirase_picture").attr('src');
    if (name == ""){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		ons.notification.alert({title:'',message:"タイトルを入力してください。"});
    			return;
    }
    var EnjiClass=[];
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			if($("#00"+for_c).prop('checked')) {EnjiClass.push(class_datalist[for_c]); }
		}
	EnjiClass.push("管理者");
						
		     				//alert("データ"+EnjiClass);
						
	//既存のデータ数カウント
		ncmb.File.equalTo("")
			.limit(1000)
			.fetchAll()
			.then(function(files){
				// 検索成功後処理
				var fileName = 0;
				var fileName = files.length;
				var fileData =  new NCMB.File(fileName);
				
				    if (src == ""){
				    	status = "no_img";
				    }else{
				    	status = "oshirase";
				    }
					var oshirase = ncmb.DataStore("oshirase");
					var oshirase = new oshirase();
					//alert("name："+name);
					//alert("fileName："+fileName);
					//alert("strname："+strname);
					//alert("クラス名処理前："+strclass);
					oshirase.set("title", name)
							.set("article_id", fileName)
							.set("kurasu", EnjiClass)
							.set("status", status)
							.set("content", honbun)
							.save()
							.then(function(oshirase){
							var imgdata_id = (oshirase.get("objectId"));
							// 保存後の処理
		     				//alert("Photoページに登録されました");
							$('#oshirase_upkakunin').html('');
							$('#oshirase_camerajyokyo').html('');
							
    NCMB.Push.send({
      title: '【お知らせ】'+name,
      message: honbun,
      immediateDeliveryFlag: true,
      target: ["ios", "android"],
      badgeIncrementFlag:false,
      badgeSetting:1,
	  sound: "default",
      searchCondition: {
			"userclass": {"$in": EnjiClass }
      },
    }).then(function(e) {
    	
	var mail_title = '【お知らせ】'+name;
	var mail_message = honbun;
	var mail_img = "";
	if(src !== ""){
	var mail_img = imgsrc+fileName+'.jpg';
	}
	var mail_add =mailsave+mail_title+"&message="+mail_message+" \ " + mail_img;
		    var ref = window.open(mail_add, '_blank');
	//alert("メールで受信するユーザーにはメールで送信します。");
	//ref.addEventListener('alert("メールで受信するユーザーにはメールで送信します。")');
  var count = 0;
  var countup = function(){
    console.log(count++);
  };
	var id = setInterval(function(){
    countup();
    if(count > 1){　
      clearInterval(id);　//idをclearIntervalで指定している
		    ref.close();
	ons.notification.alert({title:'',message:"送信完了"});
    }}, 1000);
    });
						    
		     				//alert("strは！！！！"+strname+"と"+strclass+"です");
    						//ons.notification.alert({title:"アップロードが成功しました",message: ' '});
							toukou_app();
						     	$('.blue_btn').show();
								$('.blue_btn2').hide();
							})
							.catch(function(err){
							// エラー処理
		     				//alert("データベースアップロードエラー"+err);
						     	$('.blue_btn').show();
								$('.blue_btn2').hide();
					    		ons.notification.alert({title:'データベースアップロードエラー',message:err});
							$('#oshirase_upkakunin').html('');
							});
			})
			.catch(function(err){
				// エラー処理
		     	$('.blue_btn').show();
				$('.blue_btn2').hide();
				alert("ファイルリクエストエラー"+err);
			});
			
			
			
			
}

function event_tuikapage(){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		$("#karenda").addClass("no_vew");
	    $.mobile.changePage('#event_touroku');
	 	  $('#event_checkbox').html('');
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			$('#event_checkbox').prepend('<div><input type="checkbox" id="01'+for_c+'"><label for="01'+for_c+'">'+class_datalist[for_c]+'</label></div>');
		}
    						//$('input').val("");
		var now = new Date();
		now_time = moment(now).format('YYYY-MM-DD');
		$('#event_time_area').html('<input type="date" class="event_data" id="event_time" value="'+now_time+'">');
}

function event_tuika() {
	     	$('.blue_btn').hide();
			$('.blue_btn2').show();
				     

    var name;
    name = $("#event_name").val();
    time = $("#event_time").val();
    if (name == ""){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		ons.notification.alert({title:'エラー',message:"タイトルを入力してください。"});
    			return;
    }
    if (time == ""){
	     	$('.blue_btn').show();
			$('.blue_btn2').hide();
		ons.notification.alert({title:'エラー',message:"日付を入れてください"});
    			return;
    }
		     				//alert(time);
    var EnjiClass=[];
		     				//alert("データ"+EnjiClass);
		for(for_c = 0;for_c < class_datalist.length ;for_c++){
			if($("#01"+for_c).prop('checked')) {EnjiClass.push(class_datalist[for_c]); }
		}
	EnjiClass.push("管理者");
						
		     				//alert("データ"+EnjiClass);
						
				
					var event = ncmb.DataStore("event");
					var event = new event();
					event.set("name", name)
							.set("EnjiClass", EnjiClass)
							.set("time1", time)
							.save()
							.then(function(event){
								ons.notification.alert({title:'',message:"イベントが追加されました"});
    							$('input').val("");
							var event_id = (event.get("objectId"));
							// 保存後の処理
		     				//alert("Photoページに登録されました");
							
//    NCMB.Push.send({
//      title: '【イベントが追加されました。】'+name,
//      message: "",
//      immediateDeliveryFlag: true,
//      target: ["ios", "android"],
//      badgeIncrementFlag:false,
//      badgeSetting:1,
//	  sound: "default",
//      searchCondition: {
//			"userclass": {"$in": EnjiClass }
//      },
//    }).then(function(e) {
//    });
						    
							//alert("strは！！！！"+strname+"と"+strclass+"です");
							//ons.notification.alert({title:"アップロードが成功しました",message: ' '});
							event_tuikapage();
								$('.blue_btn').show();
								$('.blue_btn2').hide();
							})
							.catch(function(err){
							// エラー処理
							//alert("データベースアップロードエラー"+err);
								$('.blue_btn').show();
								$('.blue_btn2').hide();
								ons.notification.alert({title:'データベースアップロードエラー',message:err});
							});
			
			
			
			
}

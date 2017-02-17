/**
 * Created by beat on 17/2/16.
 */
import './masktest.less'
var $ = require('jquery');

$(function () {
    var $loadingbg = $(".loading-bg");
    var image1,image2,myBoard2,myBoard1;
    $("#inputImage1").change( function(){
        var file = $(this)[0].files[0];
        var reader = new FileReader();
        reader.onloadstart = function (e) {
            $loadingbg.show();
        };

        reader.onabort = function (e) {
            $loadingbg.fadeOut();
        };
        reader.onerror = function (e) {
            $loadingbg.fadeOut();
        };
        reader.onload = function (e) {
            $loadingbg.fadeOut();
            $(".image1").attr("src",e.target.result);
            $(".image1")[0].onload= function(){
                var w = $(".image1").width();
                var h = $(".image1").height();

                $("#huaban1").empty().width(w).height(h);
                myBoard1 = new DrawingBoard.Board('huaban1',{
                    controlsPosition:"right",
                    webStorage: false,
                    enlargeYourContainer: true,
                });

                myBoard1.setImg(e.target.result,{'stretch' : true,
                    callback: function () {
                        myBoard1.saveHistory();
                        myBoard1.setImg(e.target.result,{'stretch' : true});
                    }
                });
            };
        };
        reader.readAsDataURL(file)
    });

    $("#inputImage2").change( function(){
        var file = $(this)[0].files[0];
        var reader = new FileReader();
        reader.onloadstart = function (e) {
            $loadingbg.show();
        };

        reader.onabort = function (e) {
            $loadingbg.fadeOut();
        };
        reader.onerror = function (e) {
            $loadingbg.fadeOut();
        };
        reader.onload = function (e) {
            $loadingbg.fadeOut();
            $(".image2").attr("src",e.target.result);
            $(".image2")[0].onload= function(){
                var w = $(".image2").width();
                var h = $(".image2").height();

                $("#huaban2").empty().width(w).height(h);
                myBoard2 = new DrawingBoard.Board('huaban2',{
                    controlsPosition:"right",
                    webStorage: false,
                    enlargeYourContainer: true,
                });
                myBoard2.setImg(e.target.result,{'stretch' : true,
                    callback: function () {
                        myBoard2.saveHistory();
                        myBoard2.setImg(e.target.result,{'stretch' : true});
                    }
                });
            };
        };
        reader.readAsDataURL(file)
    });

    $(".hecheng").click(function () {
        if(!myBoard1||!myBoard2){
            alert("请选择两张图片");
            return ;
        }
        image1 = myBoard1.getImg();
        image2 = myBoard2.getImg();
        var nametime = new Date().getTime();
        var imgname = nametime+image1.slice(-15,-10).toLowerCase();
        var formData = new FormData();
        formData.append("imgname", imgname);
        formData.append("imagedata1",convertBase64UrlToBlob(image1));
        formData.append("imagedata2",convertBase64UrlToBlob(image2));
        $loadingbg.show();
        $.ajax({
            url : 'http://106.75.48.34/test_filter_producer.php',
            type : 'POST',
            data : formData,
            // cache: false,
            processData: false,
            contentType : false,
            success : function(data) {
                if (data=='yes'){
                    $.ajax({
                        url: "http://106.75.16.207:8081/serach_pic.php?filename="+imgname,
                        processData: false,
                        contentType : false,
                        success:function (data) {
                            if (CheckUrl(data)) {
                                $(".result-img").attr("src",data);
                                $('#myModal').modal('show');

                                $loadingbg.fadeOut();
                            }else {
                                console.log(data);
                                $loadingbg.fadeOut();
                            }
                        },
                        error:function(responseStr){
                            console.log("上传图片或风格成功,第二个请求获取图片失败:"+JSON.stringify(responseStr));
                            alert("当前使用人数较多,请稍后再试。");
                            $loadingbg.fadeOut();
                        }
                    });
                }else {
                    console.log("上传图片或风格成功,单返回yes失败:"+JSON.stringify(data));
                    alert("当前使用人数较多,请稍后再试。");
                    $loadingbg.fadeOut();
                }
            },
            error : function(responseStr) {
                console.log("上传图片和图片风格失败:"+JSON.stringify(responseStr));
                alert("当前使用人数较多,请稍后再试。");
                $loadingbg.fadeOut();
            }
        });
    });

    function adjustimg($img) {
        var width =$img.width();
        var height = $img.height();
        var canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        var ctx=canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.drawImage($img[0], 0 , 0,width,height);
        return canvas.toDataURL();
    }

    function CheckUrl(str) {
        var RegUrl = new RegExp( /^http:\/\/.*jpeg$/);
        if (!RegUrl.test(str)) {
            return false;
        }
        return true;
    }

    function convertBase64UrlToBlob(urlData){
        var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob( [ab] , {type : 'image/jpeg'});
    }
});
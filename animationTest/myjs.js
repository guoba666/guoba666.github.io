$(function(){
    var currentLink = window.location.pathname;
    currentLink=currentLink.split("/");
    currentLink=currentLink[currentLink.length-1];
    var liArray=$("ul").children("li");
    for(var i=0;i<liArray.length;i++){
        var a = $(liArray[i]).children();
        if(a.attr("href")==currentLink){
            a.addClass("selected");
        }
    }
    function check(){
        if($("#name").val().length==0){
            var info = $("#nameLabel");
            info.text("昵称不能为空！");
            info.css("color","red");
        }else{
            var info = $("#nameLabel");
            info.text("昵称:");
			info.css("color","white");
        }
        if($("#content").val().length==0){
            var info = $("#contentLabel");
            info.text("留言内容不能为空！");
            info.css("color","red");
        }else{
            var info = $("#contentLabel");
            info.text("留言内容:");
			info.css("color","white");
        }
    }
    $("#send-btn").click(function(){
        if($("#name").val().length==0 || $("#content").val().length==0){
            check();
        }
        else{
			$(this).addClass("active");
			$(".bt-text").addClass("active");
			$(".loader").addClass("active");
            check();
            var box = $("<div class='comment-box'></div>");
			var content = $("<div class='comment-content'></div>");
			content.text($("#content").val());
			var head =$("<div class='comment-head'></div>");
			var author=$("<span class='comment-author'></span>");
			author.text($("#name").val());
			var delbtn =$("<a class='del' title='删除'></a>");
			$(delbtn).click(function(){
				$(this).parent().parent().addClass("delState");
			    setInterval(function(){
					$(delbtn).parent().parent().remove();
				},1000);
			})
			head.append(author);
			head.append(delbtn);
			box.append(head);
			box.append(content);
			setTimeout(function(){
				box.fadeIn();
				$("#displayArea").prepend(box);
				$("#send-btn").removeClass("active");
				$(".bt-text").removeClass("active");
				$(".loader").removeClass("active");
			},1200);
        }
    })
    $("#content").focus(function(){
        $(this).css("border","3px solid #30aed6");
    })
    $("#content").focusout(function(){
        $(this).css("border","none");       
    })
    $("#name").focus(function(){
        $(this).css("border","3px solid #30aed6");
    })
    $("#name").focusout(function(){
        $(this).css("border","none");       
    })
	
})
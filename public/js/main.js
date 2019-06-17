// project util.js
$(function(){
    // 登录注册切换
    $('.j_userTab span').on('click',function(){
        var _index = $(this).index();
        $(this).addClass('user_cur').siblings().removeClass('user_cur');
        $('.user_login,.user_register').hide();
        if( _index==0 ){
            $('.user_login').css('display','inline-block');
            $('.user_register').hide();
        }else{
            $('.user_login').hide();
            $('.user_register').css('display','inline-block');
        }
    });

    // 登录校验
    var reg = /^[^<>"'$\|?~*&@(){}]*$/;
    var $login = $('#login');
    var $register = $('#register');
    var $userForm = $('.user_form');
    var $userLogined = $('.user_logined');
    $('.user_login_btn').on('click',function(){
        if( $login.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(0).find('input').val().trim()) ){
            $login.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $login.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $login.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($login.find('.user_input').eq(1).find('input').val().trim()) ){
            $login.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $login.find('.user_input').eq(0).find('input').val().trim(),
                password: $login.find('.user_input').eq(1).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                console.log(data);
                $login.find('.user_err span').text( data.message ).show();
                if(data.code == 200){
                    setTimeout(function(){
                       window.location.reload();
                    },1000)
                }
            }
        })
    });

    $('.user_register_btn').on('click',function(){
        if( $register.find('.user_input').eq(0).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('用户名不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(0).find('input').val().trim()) ){
            $register.find('.user_err span').text('用户名不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() == '' ){
            $register.find('.user_err span').text('密码不能为空').show();
            return false;
        }
        if( !reg.test($register.find('.user_input').eq(1).find('input').val().trim()) ){
            $register.find('.user_err span').text('密码不能含有特殊字符').show();
            return false;
        }
        if( $register.find('.user_input').eq(1).find('input').val().trim() != 
            $register.find('.user_input').eq(2).find('input').val().trim()
        ){
            $register.find('.user_err span').text('两次输入的密码不一致').show();
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $register.find('.user_input').eq(0).find('input').val().trim(),
                password: $register.find('.user_input').eq(1).find('input').val().trim(),
                repassword: $register.find('.user_input').eq(2).find('input').val().trim()
            },
            dataType: 'json',
            success: function(data){
                $register.find('.user_err span').text( data.message ).show();
                if(data.code == 200) {
                    setTimeout(function(){
                       window.location.reload();
                    },1000)
                } 
            }
        })
    });

    // 退出
    $('#loginOut').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/user/logout',
            success: function(data){
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    });

    var prepage = 2;
    var page = 1;
    var pages = 0;
    var comments = [];
        // 提交评论
    $('.discuss_submit').on('click',function(){
        page = 1;

        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                contentid: $('.discuss_id').val(),
                content: $('.discuss_input').val()
            },
            dataType: 'json',
            success: function(res){
                if(!res.code){
                    $('.discuss_input').val('');
                    comments = res.data.comments.reverse();
                    renderComments(comments);
                }
            }
        })
    });

    if($('.discuss_id').val()) {
        $.ajax({
            url: '/api/comment',
            data: {
                contentid: $('.discuss_id').val()
            },
            dataType: 'json',
            success: function(res){
                if(!res.code){
                    comments = res.data.reverse();
                    renderComments(comments);
                }
            }
        })
    }

    $('.pager').delegate('a','click',function() {
        if ($(this).parent().hasClass('pre')) {
            page--;
        } else {
            page++;
        }
        renderComments(comments);
    })


    function renderComments(list){

        $('#contentCount').html(list.length);
        pages = Math.max(Math.ceil(list.length / prepage),1);
        var start = Math.max(0,(page-1) * prepage);
        var end = Math.min(start + prepage,list.length);

        var $lis = $('.pager li');
        $lis.eq(1).html(page + ' / ' + pages);

        if(page <= 1) {
            page = 1;
            $lis.eq(0).html('<i>没有上一页了</i>');
        } else {
            $lis.eq(0).html('<a href="javascript:;">上一页</a>');
        }

        if(page >= pages) {
            page = pages;
            $lis.eq(2).html('<i>没有下一页了</i>');
        } else {
            $lis.eq(2).html('<a href="javascript:;">下一页</a>');
        }

        if(comments.length == 0) {
            $('.discuss_list').html('<div>还没有评论</div>');
        } else {
            var commentsStr = "";
            for(var i = start; i < end; i++) {
                list[i].postTime = formatDate( list[i].postTime );
                commentsStr += `<li>
                        <p class="discuss_user"><span>${list[i].username}</span><i>发表于 ${list[i].postTime}</i></p>
                        <div class="discuss_userMain">
                            ${list[i].content}
                        </div>
                    </li>`
            };
            $('.discuss_list').html( commentsStr );
        }
    };

    function formatDate( date ){
        var curDate = new Date( date );
        return curDate.getFullYear()+'年'+(curDate.getMonth()+1)+'月'+curDate.getDate()+'日'+
        curDate.getHours()+':'+curDate.getMinutes()+':'+curDate.getSeconds();
    };

    // 打字效果
    var str = 'hello world';
    var i = 0;
    function typing(){
        var divTyping = $('.banner h2');
        if (i <= str.length) {
            divTyping.text( str.slice(0, i++) + '_' );
            setTimeout(function(){typing()}, 200);
        }else{
            divTyping.text( str );
        }
    }
    typing();
});
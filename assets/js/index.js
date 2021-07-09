$(function() {
    getUserInfo()

    // 点击按钮实现退出功能
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('是否退出当前页面?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 删除本地存储的token，然后跳转页面
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
          });
    })
})

// 获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // haaders是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res)
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 成功后调用用户头像
            renderAvater(res.data)
        },
        // 如果不登陆，不能直接访问index页面
        // 无论是否登陆成功，都调用complete
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.message === "身份认证失败！" && res.responseJSON.status === 1 ) {
        //         // 如果认证失败 需要清空token，强制将页面跳转到login
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvater(user) {
    // 获取用户的名称
    var name = user.username || user.nickname
    // 将用户名渲染到网页
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染用户头像
    // 如果存在头像，则显示，并把网页的另一个隐藏
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr(src, user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperClass;
        $('.text-avatar').html(first).show()
    }
}
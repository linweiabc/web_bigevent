$(function() {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return '昵称必须在1-6个字符之间'
            }
        }
    })
    initUserInfo()

    var layer = layui.layer
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                console.log(res);
                // 调用form.val为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 阻止重置按钮的默认行为（清空所有数据）
    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单提交的事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                window.parent.getUserInfo()
            }
        })
    })
})
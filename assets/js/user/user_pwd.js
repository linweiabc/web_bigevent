$(function() {
    var form = layui.form
    // 密码检验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧的密码不能一样'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '确认密码与新密码不一致'
            }
        }
    })

    // 更新密码操作
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败！')
                }
                layui.layer.msg('密码更新成功')
                // 将表单转为原生js，调用表单重置命令
                $('.layui-form')[0].reset()
            }
        })
    })
})
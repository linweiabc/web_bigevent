$(function() {
    initArtCate()

    // 获取文章管理列表内容
    function initArtCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
               var htmlStr = template('tpl-table', res)
               $('tbody').html(htmlStr)
            }
        })
    }
    // 给添加文章分类按钮绑定点击事件
    // indexadd作为layer.open的返回值
    var indexadd = null
    $('#addArtCate').on('click', function() {
        indexadd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          });
    })

    // 对于动态生成的表单，需要通过代理的方式为表单绑定submit事件
    var layer = layui.layer
    $('body').on('submit', '#form-add',function(e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章类别失败！')
                }
                layer.msg('添加文章类别成功！')
                // 关闭弹出层
                layer.close(indexadd)
                initArtCate()
            }
        })
    })

    // 通过代理的方式，对编辑按钮绑定点击事件
    var indexedit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok');
        indexedit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
            });
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // lay-filter="form-edit"可以快速为表格填充res.data;
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的方式，给编辑弹出表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！')
                initArtCate()
                layer.close(indexedit)
                initArtCate()
            }
        })
    })

    // 通过代理的方式，给删除弹出表单绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log('ok');
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
          $.ajax({
            method: "GET",
            url: "/my/article/deletecate/" + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败！')
                    }
                layer.msg('删除文章分类成功！')
                layer.close(index)
                initArtCate()
                }

            })
          });

    })
})
$(function() {
    // 获取文章类别，渲染至页面
    var layer = layui.layer
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章分类获取失败')
                }
                // 调用模板引擎渲染文章分类
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 对于动态生成的数据记得调用form.render方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 绑定选择封面按钮
    $('#chooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的变化事件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files[0]
        // 判断是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files)
        // 裁剪图片
        $image
        .cropper('destroy')// 销毁旧的裁剪区域
        .attr('src', newImgURL)// 重新设置图片路径
        .cropper(options)// 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var artstate = '已发布'

    // 为存为草稿按钮绑定事件
    $('#btnSave2').on('click', function() {
        artstate = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        // 基于form表单，快速创建formdata对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd
        fd.append('state', artstate)
        // 打印fd的键和值
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        // 将裁剪后的图片，输出为文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            // 发起ajax请求
            publishArticle(fd)
        })
        
    })
    function publishArticle(data) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: data,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
              }
        })
    }
})
$(function() {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage
    // 定义时间美化格式
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    
    initTable()  
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取文章列表失败！')
            }
            // layer.msg('获取文章列表成功')
            // 使用模板引擎渲染页面的数据
            // layer.msg('获取文章列表成功！')
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total)
          }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
          method: 'GET',
          url: '/my/article/cates',
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取分类数据失败！')
            }

            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            console.log(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            form.render()
          }
        })
      }

    // 筛选区域
    $('#form-search').on('submit', function(e) {
      e.preventDefault()
      var cate_id = $('[name=cate_id]').val()
      var state = $('[name=state]').val()
      q.cate_id = cate_id
      q.state = state
      initTable()
    })

    // 分页方法
    function renderPage(total) {
      // console.log(total);
      laypage.render({
        elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
        ,count: total //数据总数，从服务端得到
        ,limit: q.pagesize
        ,curr: q.pagenum,
        layout: ['count', 'limit','prev', 'page', 'next', 'skip'],
        // 规定显示多少页
        limits: [2, 3, 5, 10],
        jump: function(obj, first) {
          // 把选定的页码赋给q这个查询参数
          q.pagenum = obj.curr
          // 把最新的条目数赋值给q的查询对象
          q.pagesize = obj.limit
          if (!first) {
            initTable()
          }
        }
      });
    }

    // 通过代理形式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
      // console.log( '点击了')
       // 获取删除按钮的个数
      var len = $('.btn-delete').length
      // 获取到文章的 id
      var id = $(this).attr('data-id')
      layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
          method: 'GET',
          url: '/my/article/delete/' + id,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            // 数据删除完成后，需判断当前页码是否还有数据，如果没有数据，需要将页码减1
            if (len === 1) {
              // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
              // 页码值最小必须是 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
          }
        })
        //do something
        layer.close(index);
      })
    })
    // 未完成
    // $('tbody').on('click', '.btn-edit', function() {
    //   var fd = new FormData($('tbody')[0])
    //   fd.forEach(function(v, k) {
    //         console.log(k, v);
    //     })
    //   $.ajax({
    //     method: 'POST',
    //     url: '/my/article/edit',
    //     data: fd,
    //     success: function(res) {
    //         if (res.status !== 0) {
    //           return layer.msg('修改文章失败！')
    //         }
    //         layer.msg('修改文章成功！')
    //         // 发布文章成功后，跳转到文章列表页面
    //         location.href = '/article/art_list.html'
    //       }
    //   })
    // })
})
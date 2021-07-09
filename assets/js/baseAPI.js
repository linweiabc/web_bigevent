// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 统一为有权限的接口，设置请求头 indexOf，没有元素返回-1
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
  // 会先调用 ajaxPrefilter 这个函数
  // 在这个函数中，可以拿到我们给Ajax提供的配置对象
  options.complete = function(res) {
    // console.log(res);
    if (res.responseJSON.message === "身份认证失败！" && res.responseJSON.status === 1 ) {
        // 如果认证失败 需要清空token，强制将页面跳转到login
        localStorage.removeItem('token');
        location.href = '/login.html';
    }
  }
})

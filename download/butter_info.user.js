// ==UserScript==
// @name         企业信息平台优化
// @namespace    https://jeay.net
// @version      0.3
// @description  企业信息平台优化，增加分月展示、官网来源筛选，修改表格样式，优化小屏幕显示
// @author       Jeay
// @require      https://lib.baomitu.com/jquery/2.2.4/jquery.min.js
// @match        http://10.0.0.24:8888/*search.php
// @match        http://218.29.222.66:8888/*search.php
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // 适应更小的屏幕
    if($(window).width() > 1200){
        $('.right').css({'width': '86%','max-width': '1460px'});
    }
    if($(window).width() <= 1200){
        $('.right').css('width', $(window).width() -165);
        $('.ulist td').css('padding','5px 2px');
    }
    if($(window).width() <= 1000){
        $('td[width="400"]').attr('width','100');
    }
    // 月份快捷键
    const date=new Date;
    const year=String(date.getFullYear()).substr(2);
    const month = date.getMonth()+1;
    let re_months = [];
    // 计算前六个月
    for (let i = 0; i < 8; i++) {
      let j = Number.parseInt(month) - i;
      let y = Number.parseInt(year);
      if (j < 1) {
        j = 12 + j;
        y = y-1;
      }
      j = String(j).padStart(2, '0');
      re_months.push(y+j);
    }
    // 添加按钮
    let html = ''
    for (const m of re_months) {
      html += '<li data-m="'+ m +'"><button>'+m+'</button></li>';
    }
    $('form[name="RegForm"]').after('<ul class="fnav">' + html + '</ul>');
    $('form[name="RegForm"]').after('<style>.fnav{margin: 30px 0 0 50px}.fnav li{display:inline;cursor: pointer;margin-right: 8px;padding:5px}.fnav button{padding:5px}</style>');
    // 按钮添加点击事件
    $('.fnav li').click(function(){
        $('input[name="date1"]').val($(this).attr("data-m")+'01');
        $('input[name="date2"]').val($(this).attr("data-m")+'31');
        $('form[name="RegForm"]').submit();
    });
    // 统计数据
    let zzyh = [];
    let wzyx = [];
    let total = [];
    // 遍历表格，分析来源
    $('.ulist tr').each(function(){
        $(this).find('td:eq(9)').hide()
        if($.trim($(this).find('td:eq(3)').text()) === "主站优化"){
            zzyh.push('<tr>'+$(this).html()+'</tr>');
            total.push('<tr>'+$(this).html()+'</tr>');
        }
        if($.trim($(this).find('td:eq(3)').text()) === "微站营销"){
            wzyx.push('<tr>'+$(this).html()+'</tr>');
            total.push('<tr>'+$(this).html()+'</tr>');
        }
    });
    $('.ulist tr').click(function(){
        const url = $(this).find('td:eq(9)').find('a').attr('href')
        if (url) {
            $(this).css('cursor','pointer')
            window.open(url)
        }
    })
    // 展示总计数据
    html = '<li id="t">总计：'+total.length+'</li><li id="z">主站优化：'+zzyh.length+'</li><li id="w">微站营销：'+wzyx.length+'</li>';
    $('form[name="RegForm"]').after('<ul class="fnav">'+ html + '</ul>');
    // 显示详情表
    // 先保存表头
    const th = '<tr>'+$('.ulist tr:eq(0)').html()+'</tr>\n';
    // console.log($('.ulist tr:eq(0)'));
    $("#t").click(function(){
        $('.ulist').html(th + total.join('\n'));
    });
    $("#z").click(function(){
        $('.ulist').html(th + zzyh.join('\n'));
    });
    $("#w").click(function(){
        $('.ulist').html(th + wzyx.join('\n'));
    });
})();
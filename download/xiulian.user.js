// ==UserScript==
// @name         【haowuliaoa】 自动修炼
// @namespace    https://jeay.net/
// @version      1.0
// @description  自动点击修炼：打开https://www.haowuliaoa.com/games/xx，点击右上角 自动修炼；单位显示优化
// @author       Jeay
// @match        https://www.haowuliaoa.com/games/xx
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 自动点击
    $('.fly-nav-user').append('<li class="layui-nav-item" id="auto_xiuliam" style="margin-left:10px"><button class="btn btn-default">开始自动修炼</button></li>')
    $('#auto_xiuliam').click(function() {
        if ($(this).find('button').html() == '开始自动修炼') {
            window.t = setInterval(
                function(){
                    $('button.btn.btn-lg.btn-default').click()
                },
            50)
            $(this).find('button').html('停止自动修炼')
        }else{
            clearInterval(t)
            $(this).find('button').html('开始自动修炼')
        }
    })
    // 自动升级
    // setInterval(function(){
    //     if($("button:contains(升级):first").prop('disabled') === false){
    //         $("button:contains(升级):first").click()
    //     }
    // },5e3)
    // 表格宽度
    $('#info td:contains(名称)').width(100)
    $('#info td:contains(能力)').width(330)
    $('#info td:contains(升级需求)').width(240)
    // 单位显示
    // @param   String    num_str
    function fomatNum(num_str) {
        num_str = num_str.replace(/,/g, '')
        const num_int = Number.parseInt(num_str)
        const num_len = num_str.length
        let unit
        let base
        if (num_len>15) {
            unit = 'P'
            base = 1e15
        }else if (num_len>12) {
            unit = 'T'
            base = 1e12
        }else if (num_len>9) {
            unit = 'G'
            base = 1e9
        }else if (num_len>6) {
            unit = 'M'
            base = 1e6
        }else if (num_len>3) {
            unit = 'K'
            base = 1e3
        }else{
            return false
        }
        let res = (num_int / base).toPrecision(3)
        return String(res)+unit
    }
    setInterval(function(){
        update_dom($('h1 span'))
        $('#info span').each(function(){
            update_dom($(this))
        })
        $('.col-md-4.text-right span').each(function(){
            update_dom($(this))
        })
        $('#status span').each(function(){
            update_dom($(this))
        })
        $('#itemRow span').each(function(){
            update_dom($(this))
        })
    },1e3)
    function update_dom(el){
        if(/^\d.*\d$/.test(el.html())){
            const fomatedNum = fomatNum(el.html())
            if(fomatedNum){
                const resEl = el.next('.unit')
                const fomatedRes = '（' + fomatedNum + '）'
                if (resEl.length>0) {
                    resEl.html(fomatedRes)
                }else{
                    el.after('<i class="unit" style="color:#9f43cf;margin-left:10px">' + fomatedRes + '</i>')
                }
            }
        }
    }
    $('.col-md-4.text-right').append('<p id="realinc">实际增量<span style="color:#9f43cf;"> 计算中... </span>每秒</p>')
    window.realinc_rec = Number.parseInt($('h1 span').html().replace(/,/g, ''))
    // console.log(realinc_rec)
    setInterval(function(){
        // 记录值
        const now_rec = Number.parseInt($('h1 span').html().replace(/,/g, ''))
        const inc =  Number.parseInt((now_rec - realinc_rec) / 5)
        const inc_str = String(inc)
        $('#realinc span').html(inc_str)
        realinc_rec = now_rec
    },5e3)
    $('#info span').each(function(){
        const h = $(this).html()
        if (/[\u4e00-\u9fa5]{4}(\d[\d,]+).*/.test(h)) {
            // console.log(h)
            const re_res = h.match(/([\u4e00-\u9fa5]+)(\d[\d,]+)(.+)/)
            if (re_res) {
                const res = re_res[1] + '<span>' + re_res[2] + '</span>' + re_res[3]
                $(this).parent().html(res)
            }
        }
    })
})();

// ==UserScript==
// @name         防控物资用户信息填写
// @namespace    https://jeay.net
// @version      0.2
// @description  用于提前填写用户信息
// @author       Jeay
// @match        http://s1.kuistar.cn:8000/*
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    if (location.pathname == '/') {
        $('.content').append('<form class="form-horizontal" role="form"><div class="form-group"><label>姓名</label><input type="text" class="form-control" name="jname" placeholder="请输入姓名"></div><div class="form-group"><label>身份证号</label><input type="text" class="form-control" name="jid" placeholder="请输入身份证号"></div><div class="form-group"><label>电话号码</label><input type="text" class="form-control" name="jtel" placeholder="请输入电话号码"></div><div class="form-group"><button type="button" class="btn btn-primary btn-block" id="save_data">保存</button></div></form>')
        $('#save_data').click(function(){
            localStorage.setItem('jname',$('input[name=jname]').val())
            localStorage.setItem('jid',$('input[name=jid]').val())
            localStorage.setItem('jtel',$('input[name=jtel]').val())
            $(this).removeClass('btn-primary').addClass('btn-success').html('已保存')
        })
        if (localStorage.getItem('jname')) {
            $('input[name=jname]').val(localStorage.getItem('jname'))
        }
        if (localStorage.getItem('jid')) {
            $('input[name=jid]').val(localStorage.getItem('jid'))
        }
        if (localStorage.getItem('jtel')) {
            $('input[name=jtel]').val(localStorage.getItem('jtel'))
        }
    }
    if (location.pathname == '/list') {
        $('[name=fkwz]').val($('[name=fkwz]').find('option:last').attr('value'))
        setTimeout(() => {
            $('[name=fkwz]').change()
        }, 500);
        if (localStorage.getItem('jname')) {
            $('input[name=name]').val(localStorage.getItem('jname'))
        }
        if (localStorage.getItem('jid')) {
            $('input[name=card]').val(localStorage.getItem('jid'))
        }
        if (localStorage.getItem('jtel')) {
            $('input[name=phone]').val(localStorage.getItem('jtel'))
        }
    }
    if (location.pathname == '/my') {
        if (localStorage.getItem('jname')) {
            $('input[name=name]').val(localStorage.getItem('jname'))
        }
        if (localStorage.getItem('jid')) {
            $('input[name=card]').val(localStorage.getItem('jid'))
        }
    }
})();

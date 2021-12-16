// ==UserScript==
// @name            [Proxy]请求转发，服务器的请求转发到本地浏览器处理
// @namespace       https://jeay.net
// @version         1.2
// @description     该插件会将服务器的请求转发到本地浏览器执行，并返回数据给相关接口，需要配合相关服务器接口使用，不能单独运行，在不同的请求域名出现时会有安全提醒，请仔细其确认时本人的操作后再点击允许
// @author          Jeay
// @match           http://192.168.7.196:8000/*
// @require         https://www.lmlq.com/js/jquery.js
// @require         https://lib.baomitu.com/axios/0.19.2/axios.min.js
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// ==/UserScript==

(async function() {
    'use strict';
    $(()=>{
        $('#tampermonkey_proxy_start').click(()=>{
            console.log('插件启动')
            // 1. 数据接收地址，这里需要存入后台的接收地址，用于接收请求完成后回复的结果
            window.recv = sessionStorage.getItem('tmk_proxy_recv')
            if(recv) {
                console.log('查询启动')
                // 开始创建查询，监控sessionStorage中是否有新任务
                window.t = setInterval(function(){
                    console.log('没有收到任务，继续等待3秒')
                    // tmk_proxy_quests需要前端事先存入好任务内容，数组结构，内容格式示例: [{id:1,url:'https://.....',msg:'想要给后台带去的消息'},{...},.....]
                    let quests = sessionStorage.getItem('tmk_proxy_quests')
                    if (quests && quests.length > 0) {
                        // 停止查询
                        clearInterval(t)
                        console.log('收到任务，开始处理')
                        // 开始处理任务
                        handleQuest(quests)
                    }
                }, 3000)
            }
        })
    })
    async function handleQuest(quests){
        try {
            quests = JSON.parse(quests)
        } catch (error) {
            alert('任务格式不正确')
            return false
        }
        for (const quest of quests) {
            console.log(quest)
            const res = await get_data(quest.url)
            if (res && res.length > 50) {
                // 获取的数据发送到后端
                send_data(quest.id, {response: res, msg: quest.msg})
            }
        }
    }

    function send_data(data) {
        if(windown.recv) {
            axios.post(recv, data)
        }
    }
    // function google_verification_code(dname){
    //     const r=confirm('发生错误，可能需要验证码，将在浏览器中打开该错误页面')
    //     if (r==true){
    //         window.open("https://www.google.com/search?ie=utf-8&oe=utf-8&hl=en-US&q=site:"+dname)
    //     }
    //     else {
    //         window.open("https://www.google.com/search?ie=utf-8&oe=utf-8&hl=en-US&q=site:"+dname)
    //     }
    // }
    function get_data(url){
        console.log(url)
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    reject(response.response)
                },
                onerror : function(err){
                    resolve(err)
                },
            })
        }).catch((e) => {console.log(e)})
    }

    // const res = await get_data('https://www.so.com/')
    // console.log(res)


})();
// ==UserScript==
// @name         ajax总结填写分析
// @namespace    https://www.jeay.net/
// @version      0.2
// @description  try to take over the world!
// @author       jeay
// @match        http://10.0.0.3:8083/*fid=123*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
/*
 * @Author: jeay
 * @Date: 2018-06-09 11:44:16
 * @Last Modified by: jeay
 * @Last Modified time: 2020-02-03 11:19:42
 */
const AllUser = {
    2001876: 'zpn',
    2001901: 'wjj',
    2001904: 'shm',
    2001906: 'lff',
    // 2001916: 'gzl',
    2001930: 'hsj',
    2001966: 'wrj',
    2003606: 'yj',
    // 2003666: 'hs',
    2003744: 'lln',
    // 2005038: 'zwb',
    2005044: 'smj',
    2005091: 'zlj',
    // 2005096: 'jys',
    2005113: 'myt',
    2005164: 'lss',
    // 2005437: 'yxc',
    2005536: 'lzr',
    2005600: 'zk',
    2005601: 'llt',
    2005722: 'zke',
    2005601: 'lmz',
    2006351: 'nyx',
    2006462: 'zzh',
    2006486: 'sky',
    2006496: 'yll',
    2006514: 'jnn'
}
if (/fid=123/.test(location.href) && localStorage.length>0) {
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            // const element = localStorage[key];
            const el = document.querySelector('#thread_' + key)
            const nowUser = localStorage[key].split(',')
            if (el !== null && nowUser.length > 11){
                //console.log(nowUser)
                const noSum = []
                for (const key in AllUser) {
                    if (AllUser.hasOwnProperty(key)) {
                        const user = AllUser[key];
                        if (key == 2001876) {
                            continue
                        }
                        if (nowUser.indexOf(key) === -1) {
                            noSum.push(user)
                        }
                    }
                }
                el.innerHTML = el.innerHTML + '<span style="color:red;background-color:yellow">' + noSum.join(',') + '</span>'
            }
        }
    }
}

const jsGetAjaxPromise = function(url){
    return new Promise(function(resolve, reject ){
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send();
    })
}

function getUserList(tid,page) {
    return new Promise(async (resolve, reject)=>{
        let url = 'http://10.0.0.3:8083/forum.php?mod=viewthread&tid=' + tid +'&extra=page%3D1&page=' + page
        let res = await jsGetAjaxPromise(url)
        let userList = localStorage.getItem(tid) ? localStorage.getItem(tid).split(',') : []
        for (const iterator of res.currentTarget.response.match(/class="xw1">(\d+)<\/a>/gi)) {
            userList.push(iterator.match(/>(\d+)</)[1])
        }
        if (page == 1) {
            userList.splice(0,1)
        }
        localStorage.setItem(tid,userList)
        // console.log(userList)
        resolve()
    })
}

function CheckSummary() {
    (async ()=>{
        document.getElementById("check").removeEventListener('click',CheckSummary)
        document.getElementById("check").innerHTML='<a>checking now</a>'
        // 获取列表部分
        const tableEl = document.querySelector(".bm_c table")
        // 分析所有链接
        const tpsEl = tableEl.querySelectorAll(".tps a")
        // let tidlist = []
        for (const item of tpsEl) {
            let itemm = item.href.match(/.*&tid=(\d+).*&page=(\d+).*/)
            const tid = itemm[1]
            const page = itemm[2]
            if (page == 2) {
                //如果是第二页 就先读取第一页
                console.log(tid+' page1')
                await getUserList(tid,1)
            }
            console.log(tid+' page '+page)
            await getUserList(tid,page)

            const el = document.querySelector('#thread_' + tid)
            const nowUser = localStorage[tid] ? localStorage[tid].split(',') : []

            if (el !== null && nowUser.length > 11){
                el.innerHTML = el.innerHTML + '<span class="ulist" style="color:red;background-color:yellow"></span>'
                const spanEl = document.querySelector('#thread_' + tid + " .ulist")
                //console.log(nowUser)
                const noSum = []
                for (const key in AllUser) {
                    if (AllUser.hasOwnProperty(key)) {
                        const user = AllUser[key];
                        if (key == 2001876) {
                            continue
                        }
                        if (nowUser.indexOf(key) === -1) {
                            noSum.push(user)
                        }
                    }
                }
                spanEl.innerHTML = noSum.join(',')
            }
        }
        document.getElementById("check").innerHTML='<a>checked</a>'
    })()
}

const groupnavEl = document.querySelector("#groupnav")
groupnavEl.innerHTML = groupnavEl.innerHTML + '<li id="check"><a>Check Now</a></li>'
document.getElementById("check").addEventListener('click',CheckSummary);
})();
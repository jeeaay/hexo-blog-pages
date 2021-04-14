#!/bin/sh
#1: 80-port test
#You can Write one of your server ip here
ipaddarr=`ifconfig|grep "inet addr:"|grep -v "127.0.0.1"|head -n 1|cut -d: -f2|awk '{print $1}'`
#80 port test
PortCheck=`netstat -ant | grep ${ipaddarr}:80|grep "TIME_WAIT" &>/dev/null`
Port="$?"
httpdCheck=`ps aux|grep httpd|grep -v grep &>/dev/null`
PID="$?"
if [ "$Port" -ne "0" -o "$PID" -ne 0 ];then 
         http="err"
fi 
#2: load average test
TOP_SYS_LOAD_NUM=10
SYS_LOAD_NUM=`uptime | awk '{print $(NF-1)}' |cut -d, -f1`
isLoad=`awk -v num1=$TOP_SYS_LOAD_NUM -v num2=$SYS_LOAD_NUM 'BEGIN{print(num1>num2)?"1":"0"}'`
if [ "$isLoad" -eq 0 ]; then
    load="over"
fi
#3: mysql tset
CMDCHECK=`lsof -i:3306 &>/dev/null` 
Port="$?"
PIDCHECK=`ps aux|grep mysql|grep -v grep&>/dev/null`  
PID="$?"
if [ "$Port" -ne "0" -o "$PID" -ne 0 ];then 
         mysql="err"
fi 
#### restart mysql & httpd 
if [[ $http == "err" ]]; then
    pkill httpd
    sleep 5
    service httpd start  
    echo "#Http err@" $(date +"%y-%m-%d %H:%M:%S") "restart httpd" 
fi
if [[ $load == "over" ]]; then
    pkill httpd
    sleep 5
    service httpd start  
    echo "#Over load($SYS_LOAD_NUM)@" $(date +"%y-%m-%d %H:%M:%S") "restart httpd" 
fi
if [[ $mysql == "err" ]]; then
    pkill mysqld
    sleep 5
    service mysqld start  
    echo "#Mysql err@" $(date +"%y-%m-%d %H:%M:%S") "restart mysql" 
fi
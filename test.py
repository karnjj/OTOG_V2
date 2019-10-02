import platform
import re
import os
import shutil
import signal
import sys
import _thread as thread
import time
import urllib
import socketserver as SocketServer
import subprocess
import codecs
import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="0000",
    database="OTOG"
)
ioeredirect = " 0<env/input.txt 1>env/output.txt 2>env/error.txt"
langarr = {
    "C" : {"extension":"c", "system":"find /usr/bin/ -name gcc", "compile":"gcc uploaded/[codefilename].c -O2 -fomit-frame-pointer -o compiled/[codefilename]" + ioeredirect, "execute":"compiled/[exename][inputfile]"},
    "C++": {"extension": "cpp", "system": "find /usr/bin/ -name g++", "compile": "g++ uploaded/[codefilename].cpp -O2 -fomit-frame-pointer -o compiled/[codefilename]" + ioeredirect, "execute": "compiled/[exename][inputfile]"}
}


def file_read(filename):
    if not os.path.exists(filename):
        return ""
    f = codecs.open(filename, "r", "utf-8")
    d = f.read()
    f.close()
    return d.replace("\r", "")


def file_write(filename, data):
    f = codecs.open(filename, "w", "utf-8")
    f.write(data.replace("\r", ""))
    f.close()

# Program Compiled
def create(codefilename, language):
    os.system("chmod 777 compiled/" + codefilename)
    os.system("rm compiled/" + codefilename)
    if(language not in ('C', 'C++')):
        return
    print("Compiling Code File ...")
    result = None
    compilecmd = langarr[language]["compile"]
    compilecmd = compilecmd.replace("[codefilename]", codefilename)
    os.system(compilecmd)
    if not os.path.exists("compiled/" + codefilename):
        result = "Compilation Error"

    if result == None:
        print("Code File Compiled to Executable.")
    else:
        print("Compilation Error")
    return result

# Program Execution
def execute(language, userid, probname, probid, testcase, timelimit, memlimit, that_time):
    exename = probid + "_" + userid + "_" + that_time
    global timediff
    inputfile = " <source/" + probname + "/" + \
        testcase + ".in 1>env/output.txt 2>env/error.txt"
    cmd = "ulimit -v " + str(memlimit) + ";" + \
        langarr[language]["execute"] + "; exit;"
    cmd = cmd.replace("[exename]", exename)
    cmd = cmd.replace("[inputfile]", inputfile)
    os.system("chmod 777 .")
    if(os.path.exists("env/error.txt")):
        os.system("chmod 777 env/error.txt")
    if(os.path.exists("env/output.txt")):
        os.system("chmod 777 env/output.txt")
    print(cmd)
    starttime = time.time()
    proc = subprocess.Popen([cmd], shell=True, preexec_fn=os.setsid)
    try:
        proc.communicate(timeout=timelimit)
        t = proc.returncode
    except subprocess.TimeoutExpired:
        t = 124
    endtime = time.time()
    timediff = endtime - starttime
    os.system("chmod 777 .")
    if(os.path.exists("/proc/"+str(proc.pid))) :
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    print("Return Code : " + str(t))
    return t


def cmpfunc(fname1, fname2):
    f1 = open(fname1)
    f2 = open(fname2)
    f1_line = f1.readline()
    f2_line = f2.readline()
    while f1_line != '' or f2_line != '':
        f1_line = f1_line.rstrip()
        f2_line = f2_line.rstrip()
        if f1_line != f2_line:
            f1.close()
            f2.close()
            return False
        f1_line = f1.readline()
        f2_line = f2.readline()
    f1.close()
    f2.close()
    return True


while 1:
    mycursor = mydb.cursor(buffered=True)
    mycursor.execute("SELECT * FROM Config")
    configs = mycursor.fetchone()
    mycursor.execute("SELECT * FROM Result WHERE status = 0 ORDER BY time")
    myresult = mycursor.fetchone()
    if(myresult != None):
        print(myresult)
        mycursor.execute(
            "SELECT * FROM Problem WHERE id_Prob = " + str(myresult[3]))
        myprob = mycursor.fetchone()
        cnt = 0
        ans = ""
        sumtime = 0
        result = None
        that_time = str(myresult[1])
        id_prob = str(myresult[3])
        name_prob = str(myprob[2])
        id_user = str(myresult[2])
        time_limit = float(myprob[4])
        mem_limit = int(myprob[5])
        result = create(id_prob + "_" + id_user + "_" + that_time, "C++")
        print(result)
        if(os.path.exists("source/" + name_prob + "/script.php")) :
            case = file_read("source/" + name_prob + "/script.php")
            idx = case.find("cases = ")
            testcase = ''
            testcase = testcase + case[idx + 8]
            if(case[idx + 9] != ';'):
                testcase = testcase + case[idx + 9]
            print("Testcase : " + testcase)
        else :
            testcase = '-1'
            result = "No Testcases."
        if(result == None):
            for x in range(int(testcase)):
                result = None
                t = execute("C++", id_user, name_prob, id_prob,
                            str(x + 1), time_limit, mem_limit*1024, that_time)
                result_user = "env/output.txt"
                result_src = "source/" + name_prob + "/" + str(x + 1) + ".sol"
                timetaken = 0
                if t == 124:
                    result = "TLE"
                    file_write('env/error.txt',
                               "Time Limit Exceeded - Process killed.")
                    timetaken = timediff
                elif t == 139:
                    file_write(
                        'env/error.txt', 'SIGSEGV||Segmentation fault (core dumped)\n' + file_read("env/error.txt"))
                    timetaken = timediff
                elif t == 136:
                    file_write(
                        'env/error.txt', 'SIGFPE||Floating point exception\n' + file_read("env/error.txt"))
                    timetaken = timediff
                elif t == 134:
                    file_write('env/error.txt', 'SIGABRT||Aborted\n' +
                               file_read("env/error.txt"))
                    timetaken = timediff
                elif t != 0:
                    file_write('env/error.txt', 'NZEC||return code : ' +
                               str(t) + "\n" + file_read("env/error.txt"))
                    timetaken = timediff
                else:
                    timetaken = timediff
                sumtime = sumtime + timetaken
                if(result == None and t == 0):
                    if(cmpfunc(result_user, result_src)):
                        ans = ans + 'P'
                        cnt = cnt + 1
                    else:
                        ans = ans + '-'
                elif(result == 'TLE'):
                    ans = ans + 'T'
                else:
                    ans = ans + 'X'
                sql = "UPDATE Result SET result = %s WHERE idResult = %s"
                val = ('Running in testcase ' + str(x+1) , myresult[0])
                mycursor.execute(sql, val)
                mydb.commit()
        else:
            ans = result
        print(ans)
        errmsg = file_read("env/error.txt")
        print("TIME : " + str(sumtime))
        score = (cnt / int(testcase)) * 100
        sql = "UPDATE Result SET result = %s, score = %s, timeuse = %s, status = 1, errmsg = %s WHERE idResult = %s"
        val = (ans, score, round(sumtime, 2), errmsg, myresult[0])
        mycursor.execute(sql, val)
    mydb.commit()
    time.sleep(1)

import platform,re, os, shutil, signal, sys, _thread as thread, time, urllib, socketserver as SocketServer, subprocess, codecs
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="0000",
  database="OTOG"
)
mycursor = mydb.cursor()
ioeredirect = " 0<env/input.txt 1>env/output.txt 2>env/error.txt"
langarr = {
"C++": {"extension": "cpp", "system": "find /usr/bin/ -name g++", "compile": "g++ uploaded/[codefilename].cpp -O2 -fomit-frame-pointer -o compiled/[codefilename]"+ioeredirect, "execute": "compiled/[exename][inputfile]"}
}
def file_read(filename):
	if not os.path.exists(filename): return "";
	f = codecs.open(filename,"r","utf-8"); d = f.read(); f.close(); return d.replace("\r","")
def file_write(filename,data):
	f = codecs.open(filename,"w","utf-8"); f.write(data.replace("\r","")); f.close();

def create(codefilename,language):
	os.system("rm compiled/"+codefilename)
	if(language not in ('C','C++','C#','Java','Pascal')): return
	print("Compiling Code File ...")
	result = None
	compilecmd = langarr[language]["compile"]
	compilecmd = compilecmd.replace("[codefilename]", codefilename)
	#print(compilecmd)
	os.system(compilecmd)
	if not os.path.exists("compiled/"+codefilename):
		result="CE"

	if result==None: print("Code File Compiled to Executable.")
	else: print("Compilation Error")
	return result

# Program Execution
def execute(language, exename, testcase, timelimit, memlimit):
	global timediff
	inputfile = " <source/"+testcase+".in 1>env/output.txt 2>env/error.txt"
	cmd = "su otog -c \"ulimit -v " + str(memlimit*1000) + ";"+langarr[language]["execute"]+"; exit;\""
	cmd = cmd.replace("[exename]", exename)
	cmd = cmd.replace("[inputfile]", inputfile)
	print(cmd)
	os.system("chmod 777 .")
	if(os.path.exists("source/"+inputfile+".in")): os.system("chmod 777 source/"+testcase+".in")
	if(os.path.exists("env/error.txt")): os.system("chmod 777 env/error.txt")
	if(os.path.exists("env/output.txt")): os.system("chmod 777 env/output.txt")

	starttime = time.time()
	proc = subprocess.Popen([cmd], shell=True, preexec_fn=os.setsid)
	try:
		print(proc.communicate(timeout=timelimit))
		t = proc.returncode
	except subprocess.TimeoutExpired:
		t = 124
	endtime = time.time()
	timediff = endtime - starttime
	os.system("chmod 777 .")
	os.system("pkill "+ exename)
	print("Return Code : "+str(t))
	return t


ans = ""
sumtime = 0
result = None	
file_name = "654"
result = create(file_name,"C++");
print(result);
if(result==None) :
	for x in range(1):
		t = execute("C++", file_name, 1.0, 248, str(x+1))
		result_user = file_read("env/output.txt")
		result_src = file_read("source/"+str(x+1)+".sol")
		timetaken = 0
		if t == 124:
			result = "TLE"
			#kill(codefilename,run["language"])
			file_write('env/error.txt', "Time Limit Exceeded - Process killed.")
			timetaken = timediff
		elif t == 139:
			file_write('env/error.txt', 'SIGSEGV||Segmentation fault (core dumped)\n'+file_read("env/error.txt"))
			timetaken = timediff
		elif t == 136:
			file_write('env/error.txt', 'SIGFPE||Floating point exception\n'+file_read("env/error.txt"))
			timetaken = timediff
		elif t == 134:
			file_write('env/error.txt', 'SIGABRT||Aborted\n'+file_read("env/error.txt"))
			timetaken = timediff
		elif t != 0:
			file_write('env/error.txt', 'NZEC||return code : '+str(t)+"\n"+file_read("env/error.txt"))
			timetaken = timediff
		else:
			timetaken = timediff
		sumtime = sumtime + timetaken
		if(result == None and t == 0) :
			if(result_user == result_src): ans = ans + 'P'
			else : ans = ans + '-' 
		elif(result == 'TLE') :
			ans = ans + 'T'
		else: ans = ans + 'X'
	print(ans)
	print("TIME : " + str(sumtime))
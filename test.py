import platform,re, os, shutil, signal, sys, _thread as thread, time, urllib, socketserver as SocketServer, subprocess, codecs
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="0000",
  database="OTOG"
)
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
	os.system("chmod 777 compiled/"+codefilename)
	os.system("rm compiled/"+codefilename)
	if(language not in ('C','C++','C#','Java','Pascal')): return
	print("Compiling Code File ...")
	result = None
	compilecmd = langarr[language]["compile"]
	compilecmd = compilecmd.replace("[codefilename]", codefilename)
	#print(compilecmd)
	os.system(compilecmd)
	if not os.path.exists("compiled/"+codefilename):
		result="Compilation Error"

	if result==None: print("Code File Compiled to Executable.")
	else: print("Compilation Error")
	return result

# Program Execution
def execute(language, username, fullname, filename, testcase, timelimit, memlimit):
	exename = filename
	global timediff
	inputfile = " <source/"+fullname+"/"+testcase+".in 1>env/output.txt 2>env/error.txt"
	cmd = "ulimit -v " + str(memlimit*1000) + ";"+langarr[language]["execute"]+"; exit;"
	cmd = cmd.replace("[exename]", exename)
	cmd = cmd.replace("[inputfile]", inputfile)
	#print(cmd)
	os.system("chmod 777 .")
	if(os.path.exists("env/error.txt")): os.system("chmod 777 env/error.txt")
	if(os.path.exists("env/output.txt")): os.system("chmod 777 env/output.txt")

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
	os.system("pkill "+ exename)
	print("Return Code : "+str(t))
	return t
def cmpfunc(fname1,fname2) :
	# Open file for reading in text mode (default mode)
	f1 = open(fname1)
	f2 = open(fname2)

	# Read the first line from the files
	f1_line = f1.readline()
	f2_line = f2.readline()

	# Loop if either file1 or file2 has not reached EOF
	while f1_line != '' or f2_line != '':

	    # Strip the leading whitespaces
	    f1_line = f1_line.rstrip()
	    f2_line = f2_line.rstrip()

	    # Compare the lines from both file
	    if f1_line != f2_line:
	    	f1.close()
	    	f2.close()
	    	return False

	    #Read the next line from the file
	    f1_line = f1.readline()
	    f2_line = f2.readline()

	# Close the files
	f1.close()
	f2.close()
	return True
while 1 :
	mycursor = mydb.cursor()
	mycursor.execute("SELECT * FROM Result WHERE status = 0 ORDER BY time")
	myresult = mycursor.fetchone()
	print(myresult);
	if(myresult != None) :
		mycursor.execute("SELECT * FROM Problem WHERE id_Prob = "+str(myresult[3]))
		myprob = mycursor.fetchone()
		cnt = 0
		ans = ""
		sumtime = 0
		result = None
		file_name = str(myresult[3])
		full_name = str(myprob[2])
		user_name = str(myresult[2])
        time = str(myresult[1])
		time_limit = float(myprob[4])
		mem_limit = int(myprob[5])
        FileInDir = file_name+"_"+user_name+"_"+str(time)
		result = create(FileInDir,"C++");
		print(result);
		case = file_read("source/"+full_name+"/script.php")
		idx = case.find("cases = ")
		testcase = ''
		testcase = testcase + case[idx+8]
		if(case[idx+9] != ';') :testcase = testcase + case[idx+9]
		print("Testcase : " + testcase)
		if(result==None) :
			for x in range(int(testcase)):
				t = execute("C++", user_name, full_name, FileInDir,str(x+1), time_limit, mem_limit)
				result_user = "env/output.txt"
				result_src = "source/"+full_name+"/"+str(x+1)+".sol"
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
					if(cmpfunc(result_user,result_src)):
						ans = ans + 'P'
						cnt = cnt + 1
					else : ans = ans + '-'
				elif(result == 'TLE') :
					ans = ans + 'T'
				else: ans = ans + 'X'
		else :
			ans = result
		print(ans)
		print("TIME : " + str(sumtime))
		score = (cnt/int(testcase))*100
		sql = "UPDATE Result SET result = %s, score = %s, timeuse = %s, status = 1 WHERE idResult = %s"
		val = (ans, score, round(sumtime,2), myresult[0])
		mycursor.execute(sql, val)
	mydb.commit()
	time.sleep(1)

import numpy
from scipy.stats import norm
from scipy.stats import zscore
import mysql.connector
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="0000",
    database="OTOG"
)
mycursor = mydb.cursor()
idContest = input("Enter contest id : ")
sql = "select user_id,rating,sum(score) as sumscore,sum(time) as sumtime from (select R.user_id,R.prob_id,R.score,rating,time \
from (select user_id,prob_id, max(time) as latest from Result where contestmode = "+idContest+" group by user_id,prob_id) \
as x inner join Result as R on R.user_id = x.user_id and R.prob_id = x.prob_id and R.time = x.latest \
inner join User on R.user_id = User.idUser where User.state = 1 group by user_id,prob_id) as scoreb group by user_id order by sumscore desc, sumtime"
mycursor.execute(sql);
ranking = mycursor.fetchall()
arr = []
rank = []
user = []
prev = -1;
number = 0;
cnt = 0;
for e in ranking :
	cnt += 1
	sumscore = round(e[2])
	#if sumscore != prev : number = cnt
	arr.append(e[1])
	user.append(e[0])
	rank.append(cnt)
	prev = sumscore

std = max(numpy.std(arr),0.01)
mean = numpy.mean(arr)
zs = []
rating = []
for e in arr :
	zs.append((e-mean)/std)
for idx in range(0,len(zs)) :
	Pa = 1 - norm.cdf(zs[idx])
	Pb = (rank[idx]-1)/(len(rank)-1)
	dP = Pa - Pb
	if dP >= 0:
		rating.append(int(round((dP*100)+25)))
	else :
		rating.append(int(round((dP*100)-25)));
	arr[idx] += rating[idx]
for idx in range(len(user)) :
	sql = "update User set rating = %s where idUser = %s"
	val = (arr[idx],user[idx])
	mycursor.execute(sql, val)
confirm = input("Update now ?(y/n)")
if confirm == 'y' :
	mydb.commit()
print("SD : ",std)
print("MEAN : ",mean)
print("rank : ",rank)
print("z-score : ",zs)
print("rating : ",rating)
print("update : ",arr)
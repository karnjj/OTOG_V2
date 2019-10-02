import hashlib
import sys
import mysql.connector
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="0000",
    database="OTOG"
)
mycursor = mydb.cursor()
mycursor.execute("SELECT * FROM User")
user = mycursor.fetchall()
for i in range(0,len(user)):
    user[i] = list(user[i])
for i in range(0,len(user)):
    hashval = hashlib.sha256()
    s = user[i][2]
    hashval.update(s.encode('utf-8'))
    val = hashval.hexdigest()
    user[i][2] = val
    print(user[i][0])
    sql = "UPDATE User SET password = %s WHERE idUser = %s"
    value = (val, user[i][0])
    mycursor.execute(sql, value)
mydb.commit()
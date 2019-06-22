#include<bits/stdc++.h>
using namespace std;
const int mxn = 1e4 + 10;
int dy[] = {1,-1,0,0},dx[] = {0,0,-1,1};
bool arr[mxn][mxn];
struct data{
  int fi,se,walk;
};
queue<data> q;
int main () {
  ios::sync_with_stdio(0);
  cin.tie(0);
  int n;
  int c;
  int cnt = 0;
  int sx,sy;
  cin >> n;
  cin >> sx >> sy >> c;
  q.push({sx,sy,0});
  while (!q.empty()) {
    int cur_x = q.front().fi;
    int cur_y = q.front().se;
    int walk = q.front().walk;
    q.pop();
    arr[cur_y][cur_x] = 1;
    cnt++;
    if (cnt >= c) {
      cout << walk;
      return 0;
    }
    for(int i = 0; i < 4; i++) {
      if(arr[cur_y+dy[i]][cur_x+dx[i]]!=1 and cur_x+dx[i] > 0 and cur_y+dy[i] > 0
        and cur_x+dx[i] <= n and cur_y+dy[i] <= n) {
          q.push({cur_x+dx[i],cur_y+dy[i],walk+1});
          arr[cur_y+dy[i]][cur_x+dx[i]] = 1;
        }
    }
  }
}

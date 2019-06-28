#include<bits/stdc++.h>
using namespace std;
const int mxn = 1e4 + 10;
vector<int> adj[mxn];
int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  int n;
  int start = -1;
  cin >> n;
  for(int i = 0; i < n-1; i++) {
    int a,b;
    cin >> a >> b;
    adj[a].push_back(b);
    adj[b].push_back(a);
  }
  for(int i = 1; i <= n; i++) {
    if(adj[i].size() == 1) {
      start = i;
      break;
    }
  }
  int prev = start,now = start,cnt = 1;
  while(cnt != (n/2+1)) {
    //cout << "\n" << now << " " << prev;
    for(auto e : adj[now]) {
      //cout << "list :" << e << " ";
      if(e != prev) {
        prev = now;
        now = e;
        break;
     }
    }
    cnt++;
  }
  cout << now;
}

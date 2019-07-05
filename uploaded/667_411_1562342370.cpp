#include<bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
typedef struct {
  int node,w;
}data;
vector<data> adj[10010];
void add(int u,int v,int w) {
  adj[u].push_back({v,w});
  adj[v].push_back({u,w});
}
priority_queue<pii,vector<pii>,greater<pii>> pq;
int flag[10010];
int dist[10010];
int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  int start,endd,n,m;
  cin >> n >> m >> start >> endd ;
  for(int i = 0; i <= n; i++) {
    dist[i] = INT_MAX;
  }
  for(int i = 0; i < m; i++) {
    int u,v,w;
    cin >> u >> v >> w;
    add(u, v, w);
    }
  dist[start] = 0;
  pq.push({dist[start],start});
  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();
    flag[u] = 1;
    for(auto e : adj[u]) {
      if(dist[e.node] > dist[u] + e.w and flag[e.node] != 1) {
        dist[e.node] = dist[u] + e.w;
        pq.push({dist[e.node],e.node});
      }
    }
  }
  cout << dist[endd];
}

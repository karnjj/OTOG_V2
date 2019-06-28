#include <bits/stdc++.h>
using namespace std;
typedef struct { int u, v, w; } data;
vector<data> v;
int pat[100010];
int rnk[100010];
struct {
  bool operator()(data a, data b) const { return a.w < b.w; }
} cmp;
inline int find(int u) {
  if (pat[u] == u) {
    return u;
  } else
    return pat[u] = find(pat[u]);
}
inline void merge(int a, int b) {
  int u = find(a);
  int v = find(b);
  if (rnk[u] > rnk[v]) {
    pat[u] = v;
    rnk[u] += rnk[v];
  } else {
    pat[v] = u;
    rnk[v] += rnk[u];
  }
}
int main() {
  cin.tie(0);
  ios::sync_with_stdio(0);
  int n, m;
  cin >> n >> m;
  for (int i = 0; i <= n; i++)
    pat[i] = i;
  for (int i = 0; i <= n; i++)
    rnk[i] = 1;
  for (int i = 0; i < m; i++) {
    int a, b, c;
    cin >> a >> b >> c;
    v.push_back({a, b, c});
  }
  sort(v.begin(), v.end(), cmp);
  int sum = 0;
  vector<data>::iterator it = v.begin();
  vector<data>::iterator vend = v.end();
  for (it; it != vend; it++) {
    if (find(it->u) == find(it->v))
      continue;
    sum += it->w;
    merge(it->u, it->v);
  }
  cout << sum;
}

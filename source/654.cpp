#include <bits/stdc++.h>
using namespace std;
const int MAXN = 3e5 + 10;
string pat, txt;
int arr[MAXN];
vector<int> v[26];
int cnt[26];
void update(int idx, int n) {
  int node = idx;
  while (node < n) {
    arr[node] += 1;
    node += node & (-node);
  }
}
int getsum(int node) {
  int sum = 0;
  while (node > 0) {
    sum += arr[node];
    node -= node & (-node);
  }
  return sum;
}
int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  int mode;
  cin >> mode;
  cin >> txt >> pat;
  int sz = txt.size();
  unsigned long long sum = 0;
  for (int i = 0; i < sz; i++) {
    int now = txt[i] - 'a';
    v[now].push_back(i);
  }
  for (auto e : pat) {
    int now = e - 'a';
    int idx = v[now][cnt[now]++] + 1;
    if (mode == 0) {
      sum += idx;
    } else {
      int prev = getsum(idx);
      sum += idx - prev;
      // cout << sum << " ";
      update(idx, sz + 1);
    }
  }
  cout << sum;
}

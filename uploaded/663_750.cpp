#include<bits/stdc++.h>
using namespace std;
unordered_set<int> s[100010];
int main() {
  int a,b;
  cin >> a >> b;
  for(int i = 0; i < b; i++) {
    int t1,t2;
    cin >> t1 >> t2;
    s[t1].insert(t2);
  }
  for(int i = 1; i <= a; i++) {
    cout << i<< " "<< s[i].size() << "\n";
  }
}

#include<bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
unordered_map<unsigned long long,int> mp;
unsigned long long add(int a,int b) {
  return (a<<1)*(b<<1)*a-b;
}
int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);
  int t,q;
  int n;
  int a,b;
  cin >> t >> q;
  for(int i = 0; i < t; i++) {
    cin >> n;
    unsigned long long int hashval = 0;
    for(int j = 0; j < n-1; j++) {
      cin >> a >> b;
      hashval += add(a+1,b+2);
    }
    mp[hashval]++;
  }
  for(int i = 0; i < q; i++){
    cin >> n;
    unsigned long long int hashval = 0;
    for(int j = 0; j < n-1; j++) {
      cin >> a >> b;
      hashval += add(a+1,b+2);
    }
    cout << mp[hashval] << "\n";
  }
}

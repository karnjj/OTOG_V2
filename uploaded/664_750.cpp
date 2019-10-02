#include<bits/stdc++.h>
using namespace std;
const int maxn = 1e6+10;
int arr[maxn];
int main() {
  int i=0;
  while(cin >> arr[i++]) {
  }
  int maxx = 0;
  int sum = 0;
  for(int j = i-1; j >=0; j--) {
    if(arr[j] > maxx) {
      maxx = arr[j];
      sum++;
    }
  }
  cout << sum;
}

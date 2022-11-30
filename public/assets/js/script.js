var walletId = document.querySelectorAll('.cut-wallet');
var str = walletId.length;
console.log(walletId['0'])
for (let i = 0; i < str; i++) {
  var inText = walletId[i].innerText;
  
  if (inText.length > 12) {
    inText = inText.slice(0, 6) + '...' + inText.slice(-3);
  }
  walletId[i].innerText = inText;
}
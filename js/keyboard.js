
  
window.addEventListener("keydown", function (event) {

  if (event.defaultPrevented && !editMode) {
    return; // Should do nothing if the default action has been cancelled
  }

  let handled = false;
  
  let validKeys = ['Escape','+','=','-','ArrowRight',' ','ArrowLeft','ArrowDown','ArrowUp','R'];

  if(validKeys.includes(event.key) && !editMode)
  {
    
    goKey(event.key);
  }

  if(event.key < 10 && event.key >=0){
  //  console.log(event.key)
    if(document.getElementById(event.key)!=null)
    {
      document.getElementById(event.key).click();
     // setSlot(event.key);

     console.log(this)
    }
  }
    

  if (handled) {
    // Suppress "double action" if event handled
    event.preventDefault();
  }
}, true);

let goKey = function (key){
  
switch (key) {  
  case '+':    
   // addSlot()
    break;
  case '=':
   // addSlot()
    break;
  case '-':
   // removeSlot();
    break;
  case 'R':
    break;
  case ' ':
  //  console.log('Space');
    document.getElementById(parseInt(slotId)).click();
  break;
  case 'ArrowRight':
    document.getElementById(parseInt(slotId) + 1).click();
  break;
  case 'ArrowLeft':
    document.getElementById(parseInt(slotId) - 1).click();
  break;
  case 'ArrowDown':
    document.getElementById(parseInt(slotId) + 4).click();
  break;
  case 'ArrowUp':
    document.getElementById(parseInt(slotId) - 4).click();
   /*  setTimeout(
      function(){
        document.getElementById(key).classList.toggle('on')
      },
      200); 
      document.getElementById(key).classList.toggle('on'),400; */
  break;
  case 'Escape':  
   
  break;
  default:
    break;
}

}




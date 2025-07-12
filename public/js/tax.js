let taxPrice = document.getElementById("switchCheckDefault");
        taxPrice.addEventListener("click",()=>{
         let taxes = document.getElementsByClassName("tax-info");
         for(tax of taxes){
          if(tax.style.display != "inline"){
            tax.style.display = "inline";
          }else{
            tax.style.display = "none";
          }
         }
        })
import { db, auth } from "./firebase.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// Elements

const dateInput = document.getElementById("attendanceDate");
const saveBtn = document.getElementById("save");

const today = new Date().toISOString().split("T")[0];

let isAdmin = false;


// Set default date

dateInput.value = today;
dateInput.max = today;



// Check admin login

auth.onAuthStateChanged(async(user)=>{


if(user){


const adminSnap = await getDoc(
doc(db,"admins",user.uid)
);


if(adminSnap.exists()){


isAdmin = true;

dateInput.removeAttribute("max");


}


}


});




// Load attendance when page opens

loadAttendance();



// Toggle buttons

document.querySelectorAll(".toggle").forEach(button=>{


button.addEventListener("click",()=>{


if(button.textContent==="❌"){

button.textContent="✅";

}else{

button.textContent="❌";

}


});


});





// Date change

dateInput.addEventListener("change",async()=>{


const selectedDate = dateInput.value;


if(!isAdmin && selectedDate !== today){


alert("Only admin can edit previous dates");


dateInput.value = today;


}



loadAttendance();


});






// Load saved attendance

async function loadAttendance(){


const selectedDate = dateInput.value;



try{


const snap = await getDoc(
doc(db,"Attendance",selectedDate)
);



if(!snap.exists()){

return;

}



const data = snap.data();



document.querySelectorAll("table tr").forEach((row,index)=>{


if(index===0)return;



const name =
row.children[0].textContent.trim();



if(data[name]){


row.children[1]
.querySelector("button")
.textContent =
data[name].day ? "✅":"❌";



row.children[2]
.querySelector("button")
.textContent =
data[name].night ? "✅":"❌";


}


});


}catch(error){

console.log("Load error:",error);

}


}







// Save attendance

saveBtn.addEventListener("click",async()=>{


console.log("Save button clicked");



const selectedDate = dateInput.value;



// Normal user only today

if(!isAdmin && selectedDate !== today){


alert("Only admin can edit previous dates");

return;


}




let attendance = {};



document.querySelectorAll("table tr").forEach((row,index)=>{


if(index===0)return;



const name =
row.children[0].textContent.trim();



const day =
row.children[1]
.querySelector("button")
.textContent==="✅";



const night =
row.children[2]
.querySelector("button")
.textContent==="✅";



attendance[name]={

day:day,

night:night

};


});




try{


await setDoc(

doc(db,"Attendance",selectedDate),

attendance,

{merge:true}

);



alert("Attendance Saved Successfully ✅");



}catch(error){


console.error(error);


alert("Save failed: "+error.message);


}



});
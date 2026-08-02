import { db, auth } from "./firebase.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// Date box
const dateInput = document.getElementById("attendanceDate");

const today = new Date().toISOString().split("T")[0];

let isAdmin = false;


// Check login and admin
auth.onAuthStateChanged(async(user)=>{


if(!user){

alert("Please login first");

return;

}


const adminRef = doc(db,"admins",user.uid);

const adminSnap = await getDoc(adminRef);



if(adminSnap.exists()){

// admins
isAdmin = true;

dateInput.removeAttribute("max");

dateInput.readOnly = false;


}else{


// Normal user

isAdmin = false;

dateInput.value = today;

dateInput.max = today;

dateInput.readOnly = true;


}



});




// Set today's date initially

dateInput.value = today;




// Toggle buttons

document.querySelectorAll(".toggle").forEach(btn=>{


btn.onclick=()=>{


btn.textContent =
btn.textContent==="❌" ? "✅" : "❌";


};


});




// Save Attendance

document.getElementById("save").onclick = async()=>{


const selectedDate = dateInput.value;



if(!isAdmin && selectedDate !== today){

alert("Only admin can change date");

return;

}




let data = {};



const rows = document.querySelectorAll("table tr");



rows.forEach((row,index)=>{


if(index===0) return;


const tds=row.querySelectorAll("td");


const name=tds[0].textContent.trim();


data[name]={

day:tds[1].textContent.includes("✅"),

night:tds[2].textContent.includes("✅")

};


});



await setDoc(
doc(db,"Attendance",selectedDate),
data
);



alert("Attendance Saved Successfully ✅");


};

// Duzenleme Modu degiskenleri
let editMode=false;
let editItem;
let editItemId;


//HTML den elemanlari cagirma

const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const submitBtn = document.querySelector(".submit-btn");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");


//form gonderildiginde calisacak fonksiyon
const addItem = (e)=> 
    // sayfanin yenilenmesini iptal ettik 
    {e.preventDefault();
        const value = input.value;
        if(value!== "" && !editMode){
            //silme islemleri icin benzersiz degere ihtiyacimiz var bunun icin id olusturuyoruz
            const id = new Date().getTime().toString();
            createElement(id, value);
            setToDefault();
            showAlert('Added succesfully', "success")
            addToLocalStorage(id,value);
        } else if (value !=="" && editMode){
            editItem.innerHTML = value;
            updateLocalStorage(editItemId, value);
            showAlert('Updated succesfully', "success")
            setToDefault();
        }
    }

//Uyari veren fonksiyon
 const showAlert =(text, action) =>{
    alert.textContent =`${text}`;
    alert.classList.add(`alert-${action}`);
    setTimeout(()=>{
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1500)
 };


 // Elemanlari Silme islemini yapacak fonksiyon
const deleteItem = (e) =>{
    const element = e.target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    itemList.removeChild(element);
    removeFromLocalStorage(id);
    showAlert("Item Deleted", "danger");

    // Egerki hic eleman yoksa clear list butonunu kaldir 
    if(!itemList.children.length)
        clearButton.style.display="none";

};


//Elemanlari guncelleyecek fonksiyon
const editItems = (e)=>{
    const element = e.target.parentElement.parentElement.parentElement;
   
    editItem = e.target.parentElement.parentElement.previousElementSibling;

    input.value = editItem.innerText;

    editMode = true;
    editItemId = element.dataset.id;
    addButton.textContent= "Update" ;

};


//Varsayilana degerlere donduren fonsiyon
const  setToDefault =() =>{
    input.value = "";
    editMode = false;
    editItemId = false;
    addButton.textContent= "Add" ;
}


// * Sayfa yüklendiğinde elemanları render edecek fonksiyo
const renderItems = () => {
    let items = getFromLocalStorage();
    console.log(items);
    if (items.length > 0) {
      items.forEach((item) => createElement(item.id, item.value));
    }
  };


// Eleman olusturan fonksiyon
const createElement = (id,value)=>{
    //yeni bir div olustur
    const newDiv = document.createElement("div");

    //bu dive bir attribute ekle
    newDiv.setAttribute("data-id", id); //!set attribute ile bir elemana attribute ekleriz bu ozellik bizden eklenecek ozelligin adini ve ozelligin degerini ister ornegin <div class=x data-id=232323>

    //olusturulan div e class ekle
    newDiv.classList.add("itemms-list-item")

    //bu divin html icerigini belirle
    newDiv.innerHTML =`
        <p class="item-name">${value}</p>
        <div class="btn-container">
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;


    const deleteBtn = newDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = newDiv.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItems);


    itemList.appendChild(newDiv);
    // showAlert("Item Added", "success");
};


// * Sıfırlama yapan fonksiyon
const clearItems = () => {
    const items = document.querySelectorAll(".itemms-list-item");
    if (items.length > 0) {
      items.forEach((item) => {
        itemList.removeChild(item);
      });
      clearButton.style.display = "none";
      showAlert("Empty List", "danger");
      // Localstorage ı temizle
      localStorage.removeItem("items");
    }
  };


// ! Localstorage a kayıt yapan fonksiyon
const addToLocalStorage = (id, value) => {
    const item = { id, value };
    let items = getFromLocalStorage();
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  };


// ! Localstorage dan verileri alan fonksiyon
  const getFromLocalStorage = () => {
    return localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [];
  };


// !Localstorage dan verileri kaldiran fonksiyon
const removeFromLocalStorage = (id) => {
    let items= getFromLocalStorage();
    items = items.filter((item) => item.id!== id);
    localStorage.setItem("items", JSON.stringify(items));
  
};


//! Localstorage i guncelleyen fonksiyon
const updateLocalStorage = (id, newValue) => {
    let items = getFromLocalStorage();
    items = items.map((item) => {
      if (item.id === id) {
        // Spread Operatör: Bu özellik bir elemanı güncellerken veri kaybını önlemek için kullanılır.Burada biz obje içerisinde yer alan value yu güncelledik.Ama bunu yaparken id değerini kaybetmemek için Spread Operatör
        return { ...item, value: newValue };
      }
      return item;
    });
    localStorage.setItem("items", JSON.stringify(items));
  };


form.addEventListener("submit", addItem);
window.addEventListener("DOMContentLoaded", renderItems);
clearButton.addEventListener("click", clearItems);
const box = document.querySelector(".box")

const inputSearch = document.querySelector(".inputSearch")
const btnAdd = document.querySelector(".btnAdd")
const select = document.querySelector(".select")

const AddDialog = document.querySelector(".AddDialog")
const AddForm = document.querySelector(".AddForm")
const AddTask = document.querySelector(".AddTask")

const EditDialog = document.querySelector(".EditDialog")
const EditForm = document.querySelector(".EditForm")
const EditTask = document.querySelector(".EditTask")


const Api = "https://66b99bb1fa763ff550f8d5f2.mockapi.io/back/todolist"

let idx = null

async function Get(word){
    try {
        const { data } = await axios.get(word ? Api + "?name=" + word : Api)
        getData(data)
    } catch (error) {
        console.error(error)
    }
}

select.onchange = async ()=>{
    let url = Api
    if(select.value != "All"){
        url+=`?status=${select.value == "Active" ? true : false}`
}
try {
    const  { data } = await axios.get(url)
    getData(data)
} catch (error) {
    console.error(error)
}
}

async function Post(obj){
    try {
        const {data} = await axios.post(Api, obj)
        Get()
        AddDialog.close()
    } catch (error) {
        console.error(error)
    }
}
btnAdd.onclick =()=>{
    AddDialog.showModal()
}
AddForm.onsubmit =(event)=>{
    event.preventDefault()
    let obj={
    name: AddForm["AddTask"].value,
    status: false
    }
    Post(obj)
}


async function Delete(id){
    try {
        const { data } = await axios.delete(`${Api}/${id}`)
        Get()
    } catch (error) {
        console.error(error)
    }
}


async function Put(id, obj){
    try {
        const { data } = await axios.put(`${Api}/${id}`, obj)
        Get()
        EditDialog.close()
    } catch (error) {
        console.error(error)
    }
}
const openEditDialog =(e)=>{
    EditDialog.showModal()
    EditForm["EditTask"].value = e.name
    idx = e.id
}
EditForm.onsubmit =(event)=>{
    event.preventDefault()
    let obj ={
        name: EditForm["EditTask"].value,
        status: false
    }
    Put(idx, obj)
}


async function Checked(e){
    let obj={
        name: e.name,
        status: !e.status
    }
    try {
        const {data} = await axios.put(`${Api}/${e.id}`, obj)
        Get()
    } catch (error) {
     console.error(error)   
    }
}



inputSearch.oninput =(event)=>{
    Get(event.target.value)
}

function getData(data){
    box.innerHTML = ""
    data.forEach((e,i) => {
        const tr = document.createElement("tr")
        const tdId = document.createElement("td")
        const tdName = document.createElement("td")
        const tdStatus = document.createElement("td")
        const buttons = document.createElement("div")
        const btnEdit = document.createElement("button")
        const btnDelete = document.createElement("button")
        const Checkbox = document.createElement("input")
        Checkbox.type = "checkbox"
        Checkbox.checked = e.status

        btnDelete.onclick=()=>{
            Delete(e.id)
        }

        btnEdit.onclick =()=>{
            openEditDialog(e)
        }

        Checkbox.onclick =()=>{
            Checked(e)
        }
     


        tdId.innerHTML = i+1
        tdName.innerHTML = e.name
        tdStatus.innerHTML = e.status?"Active":"Inactive"
        btnEdit.innerHTML = "Edit"
        btnDelete.innerHTML = "Delete"
        btnEdit.classList.add("btnEdit")
        btnDelete.classList.add("btnDelete")
        buttons.classList.add("buttons")
        Checkbox.classList.add("Checkbox")
        buttons.append(btnEdit, btnDelete, Checkbox)
        tr.append(tdId, tdName, tdStatus, buttons)
        box.appendChild(tr)
    })
}
Get()

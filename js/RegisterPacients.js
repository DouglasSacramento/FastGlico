"use strict";
/* VARIÁVEIS CRUD */
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_pacient")) ?? [];

const setLocalStorage = (dbPacient) =>
  localStorage.setItem("db_pacient", JSON.stringify(dbPacient));

//CRUD -> Create
const createPacient = (pacient) => {
  const dbPacient = getLocalStorage();
  pacient.id = new Date().getTime();
  dbPacient.push(pacient);
  setLocalStorage(dbPacient);
};

//CRUD -> Read
const readPacient = () => getLocalStorage();

//CRUD -> Update
const updatePacient = (index, pacient) => {
  const dbPacient = readPacient();
  dbPacient[index] = pacient;
  setLocalStorage(dbPacient);
};

//CRUD -> Delete
const deletePacient = (cpf) => {
  const cpfPacient = readPacient().findIndex((pacient) => pacient.cpf === cpf);
  const dbPacient = readPacient();
  dbPacient.splice(cpfPacient, 1);
  setLocalStorage(dbPacient);
};

//--------------------------------------------------------------------------------------
/* VARIÁVEIS GLOBAIS */
const countTotal = document.querySelector("h3");
const btnRegister = document.getElementById("btn-register");
const btnCancel = document.getElementById("cancel");
const btnSearch = document.getElementById("btn-search");
const btnSavePacient = document.querySelector("#savePacient");
const listenerInputCpf = document.getElementById("input-cpf");
const btnEditPacient = document.getElementById("btn-edit");
const table = document.querySelector("table");

const inputName = document.getElementById("name");
const inputBirth = document.getElementById("birth");
const inputCpf = document.getElementById("docCpf");

const infoTable = document.querySelector("table");
const listAllPacients = document.querySelector("h3");
const form = document.querySelector("#options-register");

//--------------------------------------------------------------------------------------
/* FUNÇÕES */
function newCount() {
  const count = readPacient().length;
  countTotal.innerHTML = `Total de aparelhos entregues: <span class="seeNames">${count} unidades</span> `;
}

function searchPacientByCpf(cpf) {
  const data = readPacient();

  const pacient = data.find((thisPacient) => thisPacient.cpf === cpf);
  return pacient;
}

function togglePage() {
  const goResgister = document.getElementById("go-register");
  const screenRegister = document.getElementById("screen-register");

  goResgister.classList.toggle("card");
  goResgister.classList.toggle("hide");

  screenRegister.classList.toggle("hide");
  screenRegister.classList.toggle("card");
}

function hideTable() {
  const inputValue = document.getElementById("input-cpf").value;
  if (inputValue === "") {
    document.querySelector("table").classList.add("hide");
  }
}

function clearInputsRegister() {
  document.getElementById("name").value = "";
  document.getElementById("birth").value = "";
  document.getElementById("docCpf").value = "";
}

function clearInputCpf() {
  document.getElementById("input-cpf").value = "";
}

function clearMessageNotPacient() {
  document.querySelector("h2").textContent = "";
}

function formatCpf(cpf) {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDateInput(date) {
  return date
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

function formatDateRegister() {
  const date = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return date.replace(",", " às").replace(":", "h");
}

function messageForUser() {
  document.querySelector("h2").textContent = "Paciente não Encontrado!";
}

function makeTable(pacient) {
  let message = document.querySelector("h2");
  const insertTable = document.querySelector("table");

  message.textContent = "";
  infoTable.classList.remove("hide");
  insertTable.innerHTML = `
    <thead>
      <tr>        
        <th>Nome</th>
        <th>Nascimento</th>
        <th>CPF</th>
      </tr>
    </thead>
    <tbody>
      <tr>        
        <td>${pacient.name}</td>
        <td>${formatDateInput(pacient.nascimento)}</td>
        <td id="cpf">${formatCpf(pacient.cpf)}</td>
        <td><i class="ph-bold ph-pencil-simple-line edit"></i></td>
        <td><i class="ph-bold ph-trash-simple delete"></i></td>
      </tr>
    </tbody>
    <p>Entregue em: <span>${pacient.date}</span></p>
  `;
}

function openModal(seeNames) {
  const modal = document.querySelector("dialog");

  if (seeNames.classList.contains("seeNames")) {
    let allNames = readPacient();
    modal.innerHTML = "";
    const titleModal = document.createElement("h4");
    titleModal.innerText = "PACIENTES";
    modal.appendChild(titleModal);

    allNames.forEach((pacient) => {
      const showPacients = document.createElement("p");
      showPacients.innerHTML = `<b>Nome:</b><span> ${pacient.name}</span><br><b>Cpf:</b> <span>${pacient.cpf}</span>`;
      modal.appendChild(showPacients);
    });
    modal.showModal();
    clearMessageNotPacient();
  }
}

function squeletCreate() {
  const pacient = {
    id: "",
    name: inputName.value.trim(),
    nascimento: inputBirth.value,
    cpf: inputCpf.value,
    date: formatDateRegister(),
  };
  return pacient;
}

function squeletEdit(cpf) {
  const index = readPacient().findIndex((pacient) => pacient.cpf === cpf);
  const data = readPacient();

  document.getElementById("name").value = data[index].name;
  document.getElementById("birth").value = data[index].nascimento;
  document.getElementById("docCpf").value = data[index].cpf;
}

function toggleClassEdit() {
  btnSavePacient.classList.remove("create-pacient");
  btnSavePacient.classList.add("edit-pacient");
  btnSavePacient.textContent = "Editar";
}

function toggleClassCreate() {
  btnSavePacient.classList.remove("edit-pacient");
  btnSavePacient.classList.add("create-pacient");
  btnSavePacient.textContent = "Salvar";
}

function createNewPacient(event) {
  if (event.target.classList.contains("create-pacient")) {
    const pacient = squeletCreate();
    const { name, nascimento, cpf } = pacient;
    if (
      !name ||
      !nascimento ||
      !cpf ||
      nascimento.length < 10 ||
      cpf.length < 14
    ) {
      alert("Todos os campos são necessários!");
      return;
    }

    if (searchPacientByCpf(cpf)) {
      alert("Este CPF já está cadastrado!");
      return;
    }

    const areSure = confirm("Confirmar a entrega do aparelho?");
    if (areSure == false) {
      return;
    }

    createPacient(pacient);
    clearInputsRegister();
    togglePage();
    clearInputCpf();
    hideTable();
    newCount();
    clearMessageNotPacient();
    countTotal.classList.remove("hide");
    listenerInputCpf.focus();
    return;
  }
}

function editingPacient(event) {
  if (event.target.classList.contains("edit-pacient")) {
    const cpfPacient = document.querySelector("tbody tr td#cpf").textContent;
    const index = readPacient().findIndex(
      (pacient) => pacient.cpf === cpfPacient
    );
    const data = readPacient();
    const pacient = {
      id: data[index].id,
      name: inputName.value.trim(),
      nascimento: inputBirth.value,
      cpf: inputCpf.value,
      date: data[index].date,
      updated: formatDateRegister(),
    };

    const { name, nascimento, cpf } = pacient;
    if (
      !name ||
      !nascimento ||
      !cpf ||
      nascimento.length < 10 ||
      cpf.length < 14
    ) {
      alert("Todos os campos são necessários!");
      return;
    }

    if (cpf !== data[index].cpf && searchPacientByCpf(cpf)) {
      alert("Este CPF já está cadastrado!");
      return;
    }

    const areSure = confirm("Confirmar alterações?");
    if (areSure == false) {
      return;
    }

    updatePacient(index, pacient);
    clearInputsRegister();
    togglePage();
    clearInputCpf();
    hideTable();
    newCount();
    clearMessageNotPacient();
    countTotal.classList.remove("hide");
    listenerInputCpf.focus();
    return;
  }
}

//--------------------------------------------------------------------------------------
/* EVENTOS */
newCount();
listenerInputCpf.focus();

btnRegister.addEventListener("click", () => {
  togglePage();
  toggleClassCreate();

  countTotal.classList.add("hide");
  inputName.focus();
});

btnCancel.addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("h2").textContent = "";
  countTotal.classList.remove("hide");
  clearInputCpf();
  clearInputsRegister();
  togglePage();
  hideTable();
  listenerInputCpf.focus();
});

btnSearch.addEventListener("click", (event) => {
  const cpf = document.getElementById("input-cpf").value;
  const pacient = searchPacientByCpf(cpf);
  event.preventDefault();

  if (pacient === undefined || cpf.length < 14) {
    messageForUser();
    infoTable.classList.add("hide");
  } else {
    makeTable(pacient);
  }

  listenerInputCpf.focus();
});

form.addEventListener("click", (event) => {
  event.preventDefault();

  createNewPacient(event);
  editingPacient(event);
});

listenerInputCpf.addEventListener("input", () => {
  hideTable();
  clearMessageNotPacient();
});

table.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const cpf = document.querySelector("tbody tr td#cpf").textContent;

    const areSure = confirm("Realmente deseja excluir paciente?");
    if (areSure == false) {
      return;
    }

    deletePacient(cpf);
    newCount();
    document.querySelector("table").classList.add("hide");
    document.getElementById("input-cpf").value = "";
    listenerInputCpf.focus();
    return;
  }

  if (event.target.classList.contains("edit")) {
    const cpfPacient = document.querySelector("tbody tr td#cpf").textContent;

    togglePage();
    toggleClassEdit();
    squeletEdit(cpfPacient);
  }
});

listAllPacients.addEventListener("click", (event) => {
  const seeNames = event.target;
  openModal(seeNames);
});

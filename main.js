const getLocalStorage = () => localStorage.getItem("db_pacient") ?? [];

const setLocalStorage = (dbPacient) =>
  localStorage.setItem("db_pacient", JSON.stringify(dbPacient));

//CRUD -> Create
const createPacient = (pacient) => {
  const dbPacient = JSON.parse(getLocalStorage());
  pacient.id = dbPacient.length + 1;
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
const deletePacient = (index) => {
  const dbPacient = JSON.parse(readPacient());
  dbPacient.splice(index, 1);
  setLocalStorage(dbPacient);
};

/* VARIÁVEIS */
const countTotal = document.querySelector("h3");

/* FUNÇÕES */
function newCount() {
  const count = JSON.parse(getLocalStorage()).length;
  countTotal.innerHTML = `Total de aparelhos entregues: <span>${count} unidades</span> `;
}

function searchPacientByCpf(cpf) {
  const data = localStorage.getItem("db_pacient");

  if (!data) {
    console.error(
      "Lista de pacientes vazia. Necessário realizar algum cadastro!"
    );
    return null;
  }

  const db_pacient = JSON.parse(data);
  const pacient = db_pacient.find((p) => p.cpf === cpf);
  return pacient || "CPF não encontrado";
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

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("birth").value = "";
  document.getElementById("cpf").value = "";
}

function formatCpf(cpf) {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDate(date) {
  return date
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
}

/* EVENTOS */
newCount();

document.getElementById("btn-register").addEventListener("click", () => {
  togglePage();
  countTotal.classList.add("hide");
});

document.getElementById("cancel").addEventListener("click", () => {
  document.getElementById("input-cpf").value = "";
  document.querySelector("h2").textContent = "";
  togglePage();
  hideTable();
  countTotal.classList.remove("hide");
});

document.getElementById("btn-search").addEventListener("click", () => {
  const cpf = document.getElementById("input-cpf").value;
  const pacient = searchPacientByCpf(cpf);
  const insertTable = document.querySelector("table");

  if ((pacient.name, pacient.nascimento, pacient.cpf === undefined)) {
    document.querySelector("h2").textContent = "Paciente não Encontrado!";
    if (cpf != pacient.cpf) {
      document.querySelector("table").classList.add("hide");
    }
    return;
  } else {
    document.querySelector("h2").textContent = "";
    document.querySelector("table").classList.remove("hide");
    insertTable.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Nascimento</th>
          <th>CPF</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${pacient.id}</td>
          <td>${pacient.name}</td>
          <td>${formatDate(pacient.nascimento)}</td>
          <td>${formatCpf(pacient.cpf)}</td>
          <td><i class="ph-bold ph-pencil-simple-line"></i></td>
          <td><i class="ph-bold ph-trash-simple"></i></td>
        </tr>
      </tbody>
      <p>Cadastro realizado em: 02/12/2024 às 22h43</p>
      `;
  }
});

document.getElementById("savePacient").addEventListener("click", () => {
  const pacient = {
    id: "",
    name: document.getElementById("name").value,
    nascimento: document.getElementById("birth").value,
    cpf: document.getElementById("cpf").value,
  };

  const { name, nascimento, cpf } = pacient;
  if (!name || !nascimento || !cpf) {
    alert("Todos os campos são necessários!");
    return;
  }

  const areSure = confirm("Confirmar a entrega do aparelho?");
  if (areSure == false) {
    return;
  }

  createPacient(pacient);
  clearInputs();
  togglePage();
  document.getElementById("input-cpf").value = "";
  hideTable();
  newCount();
  countTotal.classList.remove("hide");
});

document.getElementById("input-cpf").addEventListener("input", () => {
  hideTable();
  document.querySelector("h2").textContent = "";
});

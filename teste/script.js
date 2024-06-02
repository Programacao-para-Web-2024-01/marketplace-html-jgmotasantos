const input = document.querySelector("input.group-input");
const addButton = document.querySelector(".add-button");
const groupsHtml = document.querySelector(".groups");
const emptyImage = document.querySelector(".empty-image");
let groupsJson = JSON.parse(localStorage.getItem("groups")) || [];
const editSelectedButton = document.querySelector(".edit-selected");
const filterInput = document.querySelector(".filter-input");

showGroups();

function getGroupHtml(group, index) {
  return /* html */ `
    <li class="group">
      <label for="${index}">
        <input id="${index}" onclick="updateSelection(this)" type="checkbox">
        <span>${group.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="removeGroup(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function showGroups(filter = '') {
  const filteredGroups = groupsJson.filter(group => group.name.toLowerCase().includes(filter.toLowerCase()));
  if (filteredGroups.length === 0) {
    groupsHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    groupsHtml.innerHTML = filteredGroups.map(getGroupHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addGroup(group) {
  input.value = "";
  groupsJson.unshift({ name: group });
  localStorage.setItem("groups", JSON.stringify(groupsJson));
  showGroups();
}

input.addEventListener("keyup", e => {
  let group = input.value.trim();
  if (!group || e.key !== "Enter") {
    return;
  }
  addGroup(group);
});

addButton.addEventListener("click", () => {
  let group = input.value.trim();
  if (!group) {
    return;
  }
  addGroup(group);
});

function updateSelection(group) {
  let groupName = group.parentElement.lastElementChild;
  if (group.checked) {
    groupName.classList.add("selected");
  } else {
    groupName.classList.remove("selected");
  }
}

function removeGroup(group) {
  const index = group.dataset.index;
  groupsJson.splice(index, 1);
  localStorage.setItem("groups", JSON.stringify(groupsJson));
  showGroups();
}

editSelectedButton.addEventListener("click", () => {
  const selectedGroups = groupsJson.filter((group, index) => {
    const checkbox = document.getElementById(index);
    return checkbox.checked;
  });

  if (selectedGroups.length > 0) {
    const newGroupName = prompt("Digite o novo nome para o grupo selecionado:", selectedGroups[0].name);
    if (newGroupName && newGroupName.trim() !== "") {
      selectedGroups.forEach((group, index) => {
        const groupIndex = groupsJson.findIndex(g => g.name === group.name);
        groupsJson[groupIndex].name = newGroupName.trim();
      });
      localStorage.setItem("groups", JSON.stringify(groupsJson));
      showGroups();
    }
  }
});

filterInput.addEventListener("input", () => {
  const filter = filterInput.value.trim();
  showGroups(filter);
});

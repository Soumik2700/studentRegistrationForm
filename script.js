// Select input fields and buttons
const studentName = document.querySelector(".name");
const studentId = document.querySelector(".ID");
const studentEmail = document.querySelector(".email");
const studentContact = document.querySelector(".contact");
const addButton = document.querySelector(".addButton");
const studentTable = document.querySelector(".studentTable");
let inputValues = JSON.parse(localStorage.getItem('students')) || [];

// Load the data from localStorage when the page loads
window.addEventListener("load", () => {
    inputValues.forEach(student => addRowToTable(student));
});

// Function to validate the input fields
function validateInputs(inputs) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const idRegex = /^[0-9]+$/;
    const contactRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    console.log(nameRegex);

    if (!nameRegex.test(inputs.name)) {
        alert("Student name should contain only characters.");
        return false;
    }

    if (!idRegex.test(inputs.id)) {
        alert("Student ID should contain only numbers.");
        return false;
    }

    if (!emailRegex.test(inputs.email)) {
        alert("Please enter a valid email.");
        return false;
    }

    if (!contactRegex.test(inputs.contact)) {
        alert("Contact number should be exactly 10 digits.");
        return false;
    }

    return true;
}

// Function to add a new student row to the table
addButton.addEventListener("click", addRow);

function addRow() {
    const inputs = {
        name: studentName.value.trim(),
        id: studentId.value.trim(),
        email: studentEmail.value.trim(),
        contact: studentContact.value.trim()
    };

    // Validate if any field is empty or invalid
    if (!inputs.name || !inputs.id || !inputs.email || !inputs.contact) {
        alert("Please fill in all fields.");
        return;
    }

    if (!validateInputs(inputs)) {
        return;
    }

    // Check for duplicate student ID, email, or contact number
    if (inputValues.some(student => student.id === inputs.id || student.email === inputs.email || student.contact === inputs.contact)) {
        alert("A student with this ID, Email, or Contact already exists.");
        return;
    }

    // Add the new student to the array and update localStorage
    inputValues.push(inputs);
    localStorage.setItem('students', JSON.stringify(inputValues));

    // Add the new student row to the table
    addRowToTable(inputs);

    // Clear the form inputs after submission
    studentName.value = '';
    studentId.value = '';
    studentEmail.value = '';
    studentContact.value = '';
}

function addRowToTable(student) {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("addedRow");

    // Create table cells for each value
    Object.values(student).forEach(value => {
        const tableData = document.createElement("td");
        tableData.textContent = value;
        tableRow.appendChild(tableData);
    });

    // Add Edit and Delete buttons
    const editButton = createEditButton(student);
    const deleteButton = createDeleteButton(student);

    const tableDataEdit = document.createElement("td");
    const tableDataDelete = document.createElement("td");

    tableDataEdit.appendChild(editButton);
    tableDataDelete.appendChild(deleteButton);

    tableRow.appendChild(tableDataEdit);
    tableRow.appendChild(tableDataDelete);

    // Append the new row to the table body
    studentTable.appendChild(tableRow);
}

// Function to create Edit button with event listener
function createEditButton(student) {
    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        studentName.value = student.name;
        studentId.value = student.id;
        studentEmail.value = student.email;
        studentContact.value = student.contact;

        // Remove student from array and localStorage for editing
        inputValues = inputValues.filter(s => s.id !== student.id);
        localStorage.setItem('students', JSON.stringify(inputValues));

        // Remove the row from the table
        editButton.closest("tr").remove();
    });
    return editButton;
}

// Function to create Delete button with event listener
function createDeleteButton(student) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        // Remove student from array and localStorage
        inputValues = inputValues.filter(s => s.id !== student.id);
        localStorage.setItem('students', JSON.stringify(inputValues));

        // Remove the row from the table
        deleteButton.closest("tr").remove();
    });
    return deleteButton;
}

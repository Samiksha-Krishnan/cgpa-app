/* =================================
   HTML ELEMENTS
================================= */

const courses = document.getElementById("courses");

const semesters = document.getElementById("semesters");

const resultTable = document.getElementById("resultTable");

const formError = document.getElementById("formError");

const addCourseBtn =
    document.getElementById("addCourseBtn");

const addSemesterBtn =
    document.getElementById("addSemesterBtn");

const calculateBtn =
    document.getElementById("calculateBtn");

const resetBtn =
    document.getElementById("resetBtn");


/* =================================
   ADD COURSE
================================= */

function addCourse() {

    const course = document.createElement("div");

    course.className = "course";

    course.innerHTML = `

        <input
            type="text"
            class="subject"
            placeholder="Subject name"
        >

        <input
            type="number"
            class="marks"
            placeholder="Marks"
            min="0"
            max="100"
        >

        <input
            type="number"
            class="credits"
            placeholder="Credits"
            min="1"
            max="10"
        >

        <button class="remove-btn" type="button" aria-label="Remove course">
            ×
        </button>

    `;


    const removeBtn =
        course.querySelector(".remove-btn");


    removeBtn.addEventListener("click", function () {

        course.remove();

        updateCourseCount();

    });


    courses.appendChild(course);

    updateCourseCount();
}


/* =================================
   COURSE COUNT
================================= */

function updateCourseCount() {

    const count =
        document.querySelectorAll(".course").length;


    document.getElementById("courseCount")
        .textContent = count + " Courses";
}


/* =================================
   ADD PREVIOUS SEMESTER
================================= */

function addSemester() {

    const semester =
        document.createElement("div");


    semester.className = "semester";


    semester.innerHTML = `

        <input
            type="number"
            class="semester-gpa"
            placeholder="Semester GPA"
            min="0"
            max="10"
            step="0.01"
        >

        <input
            type="number"
            class="semester-credits"
            placeholder="Credits"
            min="1"
        >

        <button class="remove-btn" type="button" aria-label="Remove semester">
            ×
        </button>

    `;


    semester
        .querySelector(".remove-btn")
        .addEventListener("click", function () {

            semester.remove();

        });


    semesters.appendChild(semester);
}


/* =================================
   ERROR DISPLAY
================================= */

function showError(message) {

    if (!message) {

        formError.hidden = true;
        formError.textContent = "";

        return;
    }

    formError.hidden = false;
    formError.textContent = message;
}


/* =================================
   COLLECT FORM DATA
================================= */

function collectPayload() {

    const courseList =
        document.querySelectorAll(".course");

    const courseData = Array.from(courseList).map(function (course) {

        return {
            subject: course.querySelector(".subject").value,
            marks: course.querySelector(".marks").value === ""
                ? NaN
                : Number(course.querySelector(".marks").value),
            credits: course.querySelector(".credits").value === ""
                ? NaN
                : Number(course.querySelector(".credits").value),
        };

    });


    const semesterList =
        document.querySelectorAll(".semester");

    const semesterData = Array.from(semesterList).map(function (semester) {

        return {
            gpa: Number(semester.querySelector(".semester-gpa").value),
            credits: Number(semester.querySelector(".semester-credits").value),
        };

    });


    return { courses: courseData, semesters: semesterData };
}


/* =================================
   RENDER RESULTS
================================= */

function renderResults(data) {

    resultTable.innerHTML = "";

    data.results.forEach(function (row) {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${row.subject}</td>

            <td>${row.marks}</td>

            <td>${row.credits}</td>

            <td>${row.gradePoint}</td>

        `;

        resultTable.appendChild(tr);

    });


    document.getElementById("gpa")
        .textContent = data.gpa.toFixed(2);


    document.getElementById("cgpa")
        .textContent = data.cgpa.toFixed(2);


    document.getElementById("heroGpa")
        .textContent = data.gpa.toFixed(2);


    document.getElementById("totalCredits")
        .textContent = data.totalCredits;


    document.getElementById("totalGradePoints")
        .textContent = data.totalGradePoints;

}


/* =================================
   CALCULATE (calls the backend API)
================================= */

async function calculate() {

    showError("");


    const courseList =
        document.querySelectorAll(".course");


    if (courseList.length === 0) {

        showError("Add at least one course before calculating.");

        return;
    }


    const payload = collectPayload();


    calculateBtn.disabled = true;

    const originalLabel = calculateBtn.textContent;

    calculateBtn.textContent = "Calculating...";


    try {

        const response = await fetch("/api/calculate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(payload),

        });


        const data = await response.json();


        if (!response.ok) {

            showError(data.error || "Something went wrong. Please check your inputs.");

            return;
        }


        renderResults(data);


    } catch (err) {

        showError("Could not reach the server. Is it running?");

    } finally {

        calculateBtn.disabled = false;

        calculateBtn.textContent = originalLabel;

    }

}


/* =================================
   BUTTON EVENTS
================================= */

addCourseBtn.addEventListener(
    "click",
    addCourse
);


addSemesterBtn.addEventListener(
    "click",
    addSemester
);


calculateBtn.addEventListener(
    "click",
    calculate
);


/* =================================
   RESET
================================= */

resetBtn.addEventListener(
    "click",
    function () {

        courses.innerHTML = "";

        semesters.innerHTML = "";

        showError("");

        resultTable.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty"
                >
                    Add courses to see your result.
                </td>

            </tr>

        `;


        document.getElementById("gpa")
            .textContent = "0.00";


        document.getElementById("cgpa")
            .textContent = "0.00";


        document.getElementById("heroGpa")
            .textContent = "0.00";


        document.getElementById("totalCredits")
            .textContent = "0";


        document.getElementById("totalGradePoints")
            .textContent = "0";


        addCourse();
        addCourse();

    }
);


/* =================================
   START WITH TWO COURSES
================================= */

addCourse();

addCourse();

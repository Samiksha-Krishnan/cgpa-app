const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* =================================
   GRADE POINT FUNCTION
   (mirrors calculateGradePoint() from the original C++ program)
================================= */
function calculateGradePoint(marks) {
  if (marks >= 90) return 10;
  else if (marks >= 80) return 9;
  else if (marks >= 70) return 8;
  else if (marks >= 60) return 7;
  else if (marks >= 50) return 6;
  else if (marks >= 40) return 5;
  else return 0;
}

/* =================================
   VALIDATION HELPERS
================================= */
function isValidNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function validateCourse(course, index) {
  const errors = [];
  const subject =
    typeof course.subject === "string" && course.subject.trim()
      ? course.subject.trim()
      : `Subject ${index + 1}`;

  const marks = Number(course.marks);
  const credits = Number(course.credits);

  if (!isValidNumber(marks) || marks < 0 || marks > 100) {
    errors.push(`Course ${index + 1}: marks must be between 0 and 100.`);
  }
  if (!isValidNumber(credits) || credits < 1 || credits > 10) {
    errors.push(`Course ${index + 1}: credits must be between 1 and 10.`);
  }

  return { subject, marks, credits, errors };
}

function validateSemester(semester, index) {
  const errors = [];
  const gpa = Number(semester.gpa);
  const credits = Number(semester.credits);

  if (!isValidNumber(gpa) || gpa < 0 || gpa > 10) {
    errors.push(`Previous semester ${index + 1}: GPA must be between 0 and 10.`);
  }
  if (!isValidNumber(credits) || credits <= 0) {
    errors.push(`Previous semester ${index + 1}: credits must be greater than 0.`);
  }

  return { gpa, credits, errors };
}

/* =================================
   API: CALCULATE GPA / CGPA
================================= */
app.post("/api/calculate", (req, res) => {
  const { courses, semesters } = req.body || {};

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({ error: "At least one course is required." });
  }

  const errors = [];
  let totalGradePoints = 0;
  let totalCredits = 0;

  const results = courses.map((course, i) => {
    const { subject, marks, credits, errors: courseErrors } = validateCourse(
      course,
      i
    );
    errors.push(...courseErrors);

    const gradePoint = courseErrors.length ? 0 : calculateGradePoint(marks);

    if (!courseErrors.length) {
      totalGradePoints += gradePoint * credits;
      totalCredits += credits;
    }

    return { subject, marks, credits, gradePoint };
  });

  if (errors.length) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  // CGPA: current semester folded in as one weighted block, same as the
  // original program (semester GPA * semester credits, summed with previous
  // semesters' GPA * credits).
  let totalWeightedGPA = gpa * totalCredits;
  let totalSemesterCredits = totalCredits;

  const semesterList = Array.isArray(semesters) ? semesters : [];
  const semesterErrors = [];

  semesterList.forEach((semester, i) => {
    const { gpa: semGpa, credits: semCredits, errors: semErrors } =
      validateSemester(semester, i);
    semesterErrors.push(...semErrors);

    if (!semErrors.length) {
      totalWeightedGPA += semGpa * semCredits;
      totalSemesterCredits += semCredits;
    }
  });

  if (semesterErrors.length) {
    return res.status(400).json({ error: semesterErrors.join(" ") });
  }

  const cgpa =
    totalSemesterCredits > 0 ? totalWeightedGPA / totalSemesterCredits : 0;

  res.json({
    results,
    gpa: Number(gpa.toFixed(2)),
    cgpa: Number(cgpa.toFixed(2)),
    totalCredits,
    totalGradePoints: Number(totalGradePoints.toFixed(2)),
  });
});

app.listen(PORT, () => {
  console.log(`CGPA Calculator server running at http://localhost:${PORT}`);
});

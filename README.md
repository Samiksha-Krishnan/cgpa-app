# CGPA Calculator

A web-based CGPA/GPA calculator with an Express backend and a vanilla HTML/CSS/JS frontend. The grading logic mirrors the original C++ console program: marks are converted to grade points on a 0–10 scale, then combined with credits to compute semester GPA and overall CGPA.

## Features

- Add or remove any number of courses for the current semester
- Enter marks and credits per course; grade points are calculated automatically
- Add previous semesters' GPA and credits to compute overall CGPA
- Server-side validation (marks 0–100, credits within range, GPA 0–10)
- Reset the form back to a clean state

## Grade Point Scale

| Marks   | Grade Point |
|---------|-------------|
| 90–100  | 10          |
| 80–89   | 9           |
| 70–79   | 8           |
| 60–69   | 7           |
| 50–59   | 6           |
| 40–49   | 5           |
| 0–39    | 0           |

## Tech Stack

- **Backend:** Node.js, Express (`server.js`) — exposes `POST /api/calculate`
- **Frontend:** Static HTML/CSS/JS served from the `public/` folder, communicates with the backend via `fetch`

## Project Structure

```
cgpa-app/
├── server.js          # Express server + /api/calculate endpoint
├── package.json        # Dependencies (express)
├── .gitignore
└── public/
    ├── index.html       # Page markup
    ├── style.css        # Styling
    └── script.js        # Frontend logic (calls the backend API)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (includes npm)

### Installation

```bash
git clone https://github.com/Samiksha-Krishnan/cgpa-app.git
cd cgpa-app
npm install
```

### Run

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## API

### `POST /api/calculate`

**Request body:**

```json
{
  "courses": [
    { "subject": "Maths", "marks": 92, "credits": 4 },
    { "subject": "Physics", "marks": 67, "credits": 3 }
  ],
  "semesters": [
    { "gpa": 8.5, "credits": 20 }
  ]
}
```

**Response:**

```json
{
  "results": [
    { "subject": "Maths", "marks": 92, "credits": 4, "gradePoint": 10 },
    { "subject": "Physics", "marks": 67, "credits": 3, "gradePoint": 7 }
  ],
  "gpa": 8.71,
  "cgpa": 8.56,
  "totalCredits": 7,
  "totalGradePoints": 61
}
```

If validation fails (e.g. marks out of range, no courses provided), the API responds with a `400` status and an `error` message.

## License

No license specified.

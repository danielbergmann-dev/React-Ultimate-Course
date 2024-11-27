import React, { useState } from "react";
import "./styles.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const App = () => {
  const [fields, setFields] = useState([
    { label: "Du hältst dich an die Klassen- und Schulregeln.", name: "respectRules" },
    { label: "Du begegnest Kindern und Erwachsenen mit Respekt.", name: "respectOthers" },
    { label: "Du kannst Konflikte angemessen lösen.", name: "resolveConflicts" },
    { label: "Du erledigst zuverlässig und ordentlich deine Klassenarbeit.", name: "completeTasks" },
    { label: "Du beteiligst dich aktiv im Unterricht und achtest auf störungsfreies Arbeiten.", name: "activeParticipation" },
    { label: "Du arbeitest konstruktiv mit anderen Kindern zusammen.", name: "constructiveCooperation" },
    { label: "Du konzentrierst dich auf deine Aufgaben und lässt dich nicht ablenken.", name: "focusOnTasks" },
    { label: "Deine Arbeitsweise ist selbstständig und planvoll.", name: "workIndependently" },
    { label: "Du hältst die Schulmaterialien und deinen Arbeitsplatz in Ordnung.", name: "organizeWork" },
  ]);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    grade: "4",
    schoolYear: "2023 / 2024",
    fields: {
      respectRules: "",
      respectOthers: "",
      resolveConflicts: "",
      completeTasks: "",
      activeParticipation: "",
      constructiveCooperation: "",
      focusOnTasks: "",
      workIndependently: "",
      organizeWork: "",
    },
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name ist erforderlich";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Geburtsdatum ist erforderlich";
    Object.keys(form.fields).forEach((field) => {
      if (!form.fields[field]) {
        newErrors[field] = "Bitte wähle eine Option";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      fields: { ...prevForm.fields, [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Formular erfolgreich gesendet");
    }
  };

  const handleDownloadPDF = () => {
    const input = document.querySelector('.container');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('jahreszeugnis.pdf');
    });
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <img src="/logo1.png" alt="Logo 1" className="logo" />
        <div className="title">
          <h1>Jahreszeugnis der Grundschule</h1>
          <p>Schuljahr {form.schoolYear}</p>
        </div>
        <img src="/logo2.png" alt="Logo 2" className="logo" />
      </div>

      {/* Student Info */}
      <form onSubmit={handleSubmit}>
        <div className="student-info">
          <div>
            <label>Vorname Name:</label>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div>
            <label>Geburtsdatum:</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
            {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
          </div>
          <div>
            <label>Klasse:</label>
            <span>{form.grade}</span>
          </div>
          <div>
            <label>Schulbesuchsjahr:</label>
            <span>4</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="table">
          <div className="table-row">
            <div className="table-header" style={{ flex: 3 }}>Soziale Kompetenzen, Lern- und Arbeitsverhalten</div>
            <div className="table-header" style={{ flex: 1 }}>Besonders ausgeprägt</div>
            <div className="table-header" style={{ flex: 1 }}>Ausgeprägt</div>
            <div className="table-header" style={{ flex: 1 }}>Vorhanden</div>
            <div className="table-header" style={{ flex: 1 }}>Im Ansatz vorhanden</div>
          </div>
          {fields.map((item) => (
            <div className="table-row" key={item.name}>
              <div className="table-cell" style={{ flex: 3 }}>{item.label}</div>
              <div className="table-cell" style={{ flex: 1 }}>
                <input
                  type="radio"
                  name={item.name}
                  value="besonders ausgeprägt"
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell" style={{ flex: 1 }}>
                <input
                  type="radio"
                  name={item.name}
                  value="ausgeprägt"
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell" style={{ flex: 1 }}>
                <input
                  type="radio"
                  name={item.name}
                  value="vorhanden"
                  onChange={handleInputChange}
                />
              </div>
              <div className="table-cell" style={{ flex: 1 }}>
                <input
                  type="radio"
                  name={item.name}
                  value="im Ansatz vorhanden"
                  onChange={handleInputChange}
                />
              </div>
              {errors[item.name] && <span className="error">{errors[item.name]}</span>}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        
      <div className="table-row" style={{ marginTop: '20px' }}>
          <textarea
            className="feedback-input"
            placeholder="Hier können Sie Anmerkungen hinzufügen (max. 300 Zeichen)"
            maxLength="300"
            style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
          />
        </div>
        <div className="table-row" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            className="submit-button"
            onClick={handleDownloadPDF}
          >
            Als PDF speichern
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;

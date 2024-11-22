import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialElements = [
  { id: '1', type: 'Zeile', description: '', besondersAusgepraegt: '', ausgepraegt: '', vorhanden: '', imAnsatzVorhanden: '' }
];

function DragDropForm() {
  const [elements, setElements] = useState(initialElements);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedElements = Array.from(elements);
    const [removed] = reorderedElements.splice(result.source.index, 1);
    reorderedElements.splice(result.destination.index, 0, removed);
    setElements(reorderedElements);
  };

  const addElement = () => {
    setElements([...elements, { id: `${elements.length + 1}`, type: 'Zeile', description: '', besondersAusgepraegt: '', ausgepraegt: '', vorhanden: '', imAnsatzVorhanden: '' }]);
  };

  const handleChange = (id, field, value) => {
    const updatedElements = elements.map(element => element.id === id ? { ...element, [field]: value } : element);
    setElements(updatedElements);
  };

  const updateDescription = (id) => {
    const updatedElements = elements.map(element =>
      element.id === id ? { ...element, description: `${element.besondersAusgepraegt || ''} ${element.ausgepraegt || ''} ${element.vorhanden || ''} ${element.imAnsatzVorhanden || ''}`.trim() } : element
    );
    setElements(updatedElements);
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFontSize(12);
    doc.text('Kompetenzraster Bewertungsbogen', 10, 10);
    doc.autoTable({
      head: [['Beschreibung', 'Besonders Ausgeprägt', 'Ausgeprägt', 'Vorhanden', 'Im Ansatz Vorhanden']],
      body: elements.map(element => [
        doc.splitTextToSize(element.description, 90),
        element.besondersAusgepraegt ? 'X' : '',
        element.ausgepraegt ? 'X' : '',
        element.vorhanden ? 'X' : '',
        element.imAnsatzVorhanden ? 'X' : ''
      ]),
      styles: { cellWidth: 'auto', valign: 'middle', halign: 'center' },
      columnStyles: {
        1: { cellWidth: 90 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 }
      },
      startY: 20,
    });
    doc.save('kompetenzraster.pdf');
  };

  return (
    <div className="drag-drop-form" style={{ display: 'flex' }}>
      <div className="elements" style={{ width: '20%', marginRight: '20px' }}>
        <button onClick={addElement} style={{ marginBottom: '10px' }}>Neue Zeile hinzufügen</button>
        {elements.map((element, index) => (
          <div key={element.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
            Zeile {index + 1}
          </div>
        ))}
      </div>
      <div className="canvas" style={{ width: '80%' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%', minHeight: '500px', border: '2px dashed #ccc', padding: '20px' }}>
                {elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '10px',
                          padding: '10px',
                          border: '1px solid #ccc',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <textarea
                          placeholder="Beschreibung"
                          value={element.description}
                          onChange={(e) => handleChange(element.id, 'description', e.target.value)}
                          style={{ width: '100%', resize: 'none', height: '50px', marginBottom: '10px' }}
                        />
                        <select
                          value={element.besondersAusgepraegt}
                          onChange={(e) => handleChange(element.id, 'besondersAusgepraegt', e.target.value)}
                          style={{ marginRight: '10px' }}
                        >
                          <option value="">Wählen...</option>
                          <option value="besonders ausgeprägt">Besonders ausgeprägt</option>
                          <option value="immer">Immer</option>
                        </select>
                        <select
                          value={element.ausgepraegt}
                          onChange={(e) => handleChange(element.id, 'ausgepraegt', e.target.value)}
                          style={{ marginRight: '10px' }}
                        >
                          <option value="">Wählen...</option>
                          <option value="ausgeprägt">Ausgeprägt</option>
                          <option value="überwiegend">Überwiegend</option>
                        </select>
                        <select
                          value={element.vorhanden}
                          onChange={(e) => handleChange(element.id, 'vorhanden', e.target.value)}
                          style={{ marginRight: '10px' }}
                        >
                          <option value="">Wählen...</option>
                          <option value="vorhanden">Vorhanden</option>
                          <option value="grundlegend">Grundlegend</option>
                        </select>
                        <select
                          value={element.imAnsatzVorhanden}
                          onChange={(e) => handleChange(element.id, 'imAnsatzVorhanden', e.target.value)}
                          style={{ marginRight: '10px' }}
                        >
                          <option value="">Wählen...</option>
                          <option value="im Ansatz vorhanden">Im Ansatz vorhanden</option>
                          <option value="teilweise">Teilweise</option>
                        </select>
                        <button onClick={() => updateDescription(element.id)} style={{ marginTop: '10px' }}>Beschreibung anpassen</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <button onClick={generatePDF} style={{ marginTop: '20px' }}>PDF herunterladen</button>
    </div>
  );
}

export default DragDropForm;
const buildNote = (note, activeNoteId) => {
  const noteLi = document.createElement('li');
  noteLi.className = 'list-group-item d-flex justify-content-between align-items-start border mb-1';
  noteLi.className = Number(note.id) === Number(activeNoteId) ? `${noteLi.className} active` : noteLi.className;
  noteLi.setAttribute('type', 'button');
  noteLi.setAttribute('data-id', note.id);
  const notePreview = document.createElement('p');
  notePreview.className = 'mb-0 note-preview';
  const div = document.createElement('div');
  div.innerHTML = note.content.trim();
  notePreview.textContent = div.textContent;
  notePreview.setAttribute('data-id', note.id);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.className = 'btn-close close';
  button.setAttribute('data-id', note.id);
  button.setAttribute('aria-label', 'Close');
  noteLi.appendChild(notePreview);
  noteLi.appendChild(button);
  return noteLi;
};

const renderNotes = (activeNoteId, notes, elements) => {
  if (notes.length) {
    const fragment = document.createDocumentFragment();
    notes.reverse().forEach((note) => fragment.appendChild(buildNote(note, activeNoteId)));
    elements.notes.innerHTML = '';
    elements.notes.appendChild(fragment);
    return;
  }
  elements.notes.innerHTML = '';
};

const renderNote = (activeNoteId, notes, tinymce) => {
  if (activeNoteId !== null) {
    tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
    const currentNote = notes.find((note) => note.id === activeNoteId);
    tinymce.activeEditor.setContent(currentNote.content ?? '');
    return;
  }
  tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
  tinymce.activeEditor.setContent('<p><span style="font-size: 18pt;"><strong>Add a new note first</strong></span></p>');
};

const blocked = (elements, tinymce) => {
  tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
  elements.notes.childNodes.forEach((note) => note.setAttribute('disabled', true));
};

const unlocked = (elements, tinymce) => {
  tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
  elements.notes.childNodes.forEach((note) => note.removeAttribute('disabled'));
};

export default (state, notes, elements, tinymce) => {
  switch (state.status) {
    case 'init':
    case 'addedNote':
    case 'deleteCurrentNote':
    case 'focusOnNewNote':
    case 'changedNote':
      renderNote(state.activeNoteId, notes, tinymce);
      renderNotes(state.activeNoteId, notes, elements);
      break;
    case 'deleteNote':
      renderNotes(state.activeNoteId, notes, elements);
      break;
    case 'deleting':
      blocked(elements, tinymce);
      break;
    case 'deleted':
      unlocked(elements, tinymce);
      break;
    default:
  }
};

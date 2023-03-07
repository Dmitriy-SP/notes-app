import localforage from 'localforage';
import onChange from 'on-change';
import tinymce from 'tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import render from './render.js';

const greetingsText = '<p style="text-align: left;"><span style="font-size: 18pt;"><strong><span style="font-family: \'times new roman\', times, serif;">Hello!&nbsp;</span></strong></span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">Notes app is an service for creating, editing and storing notes.</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">To create a new note, click "<strong>Add a new note</strong>".</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">Use the menu above to edit the note.</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">To save changes click "<strong>Save note</strong>".</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">To delete a note, click on the note preview cross.</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">To switch to another note, click on it in the list of notes.</span><br><span style="font-family: \'times new roman\', times, serif; font-size: 18pt;">When you switch to another note or create a new one, the latest changes in the current note are saved.</span></p>';
const maxSignOfNotes = 4;

const dbGetItem = (key) => localforage.getItem(key)
  .catch((error) => {
    throw new Error(error);
  });

const dbSetItem = (key, value) => localforage.setItem(key, value)
  .catch((error) => {
    throw new Error(error);
  });

const dbGetKeys = async () => localforage.keys()
  .catch((error) => {
    throw new Error(error);
  });

const dbRemoveNote = (key) => localforage.removeItem(key)
  .catch((error) => {
    throw new Error(error);
  });

const dbGetNotes = async () => {
  try {
    const keys = await dbGetKeys();
    const notes = keys.map(async (key) => {
      const note = await dbGetItem(key);
      return note;
    });
    return (await Promise.all(notes));
  } catch (error) {
    throw new Error(error);
  }
};

const addId = async () => {
  const keys = await dbGetKeys();
  if (keys.length) {
    return (Number(keys[keys.length - 1]) + 1);
  }
  return 0;
};

const addDbId = (id) => {
  let stringId = id.toString();
  while (stringId.length < maxSignOfNotes) {
    stringId = `0${stringId}`;
  }
  return stringId;
};

const initialize = async () => {
  const keys = await dbGetKeys();
  if (keys.length) {
    const lastNote = await dbGetItem(keys[keys.length - 1]);
    return { activeNoteId: lastNote.id, status: 'init' };
  }
  const id = await addId();
  const welcomeNote = {
    content: greetingsText,
    id,
  };
  await dbSetItem(addDbId(id), welcomeNote);
  return { activeNoteId: id, status: 'init' };
};

export default async () => {
  const initialUiState = await initialize();

  const elements = {
    addNote: document.querySelector('button#addNote'),
    saveNote: document.querySelector('button#saveNote'),
    noteField: document.querySelector('div.textAreaSize'),
    notes: document.querySelector('#notes'),
    noteFields: document.querySelector('div.notes'),
  };

  const watchedState = onChange(initialUiState, async () => {
    const notes = await dbGetNotes();
    render(watchedState, notes, elements, tinymce);
  });

  tinymce.init({
    selector: 'textarea#editor',
    height: '100%',
    resize: false,
    plugins: 'advlist code emoticons link lists table',
    toolbar: 'fontfamily fontsize styles | bold italic | bullist numlist | link emoticons | language',
    skin: false,
    content_css: false,
    setup: (ed) => {
      ed.on('focusout', async () => {
        const content = ed.getContent();
        await dbSetItem(
          addDbId(watchedState.activeNoteId),
          { content, id: watchedState.activeNoteId },
        );
        watchedState.status = 'changedNote';
      });
    },
  })
    .then(() => {
      const a = document.querySelector('a.tox-promotion-link');
      a.remove();
    });

  const notes = await dbGetNotes();
  render(watchedState, notes, elements, tinymce);

  elements.addNote.addEventListener('click', async (e) => {
    e.preventDefault();
    const id = await addId();
    const emptyNote = {
      content: '',
      id,
    };
    await dbSetItem(addDbId(id), emptyNote);
    watchedState.activeNoteId = id;
    watchedState.status = 'addedNote';
    tinymce.execCommand('mceFocus', false, 'editor');
  });

  elements.saveNote.addEventListener('click', async (e) => {
    e.preventDefault();
    const content = tinymce.activeEditor.getContent();
    await dbSetItem(
      addDbId(watchedState.activeNoteId),
      { content, id: watchedState.activeNoteId },
    );
    watchedState.status = 'changedNote';
  });

  elements.notes.addEventListener('click', async (e) => {
    const id = Number(e.target.getAttribute('data-id'));
    if (e.target.hasAttribute('aria-label')) {
      watchedState.status = 'deleting';
      await dbRemoveNote(addDbId(id));
      const dbKeys = await dbGetKeys();
      watchedState.status = 'deleted';
      if (watchedState.activeNoteId === id) {
        watchedState.activeNoteId = dbKeys.length ? Number(dbKeys[dbKeys.length - 1]) : null;
        watchedState.status = 'deleteCurrentNote';
        return;
      }
      watchedState.status = 'deleteNote';
      return;
    }
    watchedState.activeNoteId = id;
    watchedState.status = 'focusOnNewNote';
  });
};

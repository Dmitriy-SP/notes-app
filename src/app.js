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
  while (stringId.length < 4) {
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
    content: 'someInitText',
    id,
  };
  await dbSetItem(addDbId(id), welcomeNote);
  return { activeNoteId: id, status: 'init' };
};

export default async () => {
  const initialUiState = await initialize();

  const elements = {
    addNote: document.querySelector('button.button-size-fit'),
    noteField: document.querySelector('div.textAreaSize'),
    notes: document.querySelector('#notes'),
    noteFields: document.querySelector('div.notes'),
  };

  const watchedState = onChange(initialUiState, async () => {
    const notes = await dbGetNotes();
    render(watchedState, notes, elements);
  });

  tinymce.init({
    selector: 'textarea#editor',
    height: '100%',
    resize: false,
    plugins: 'advlist code emoticons link lists table',
    toolbar: 'fontfamily fontsize styles | bold italic | bullist numlist | link emoticons',
    skin: false,
    content_css: false,
    setup: (ed) => {
      ed.on('change', async () => {
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
  render(watchedState, notes, elements);

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

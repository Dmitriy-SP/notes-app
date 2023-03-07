# Notes app

[![CI](https://github.com/Dmitriy-SP/notes-app/actions/workflows/github-action-check.yml/badge.svg)](https://github.com/Dmitriy-SP/notes-app/actions/workflows/github-action-check.yml)
<a href="https://codeclimate.com/github/Dmitriy-SP/notes-app/maintainability"><img src="https://api.codeclimate.com/v1/badges/c99294debc5e6ab0c04b/maintainability" /></a>

Notes app is a service for creating, editing and storing notes in your browser.<br>
<a href="https://notes-app-five-phi.vercel.app/">You can try web-version.</a>

- [Description](#Description)
- [Versions](#Examples)
- [Installation](#Installation)
- [Usage](#Usage)

## Description

This service allows you to add a lot of notes (maximum 999), edit them with <a href="https://www.tiny.cloud/powered-by-tiny/?utm_campaign=editor_referral&utm_medium=poweredby&utm_source=tinymce&utm_content=v6">tinyMCE</a> and save them in the your browser.

## Versions

### Desctop version

<img src="https://drive.google.com/uc?export=view&id=1BzO2E4hoaHhpbpEOhjQY6sk90cXdRElV" width="80%">

### Mobile version

<img src="https://drive.google.com/uc?export=view&id=1aY87gx_CAmuLJtFbtGTsFNoMBN-mZyfC" width="40%">

## Installation

```
git clone git@github.com:Dmitriy-SP/notes-app.git
make install
```

## Usage

Deploy local server:

```
$ make develop
```

Build production:

```
$ make build
```

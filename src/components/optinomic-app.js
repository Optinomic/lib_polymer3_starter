/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  LitElement,
  html
} from '@polymer/lit-element';

import {
  setPassiveTouchGestures
} from '@polymer/polymer/lib/utils/settings.js';

import {
  connect
} from 'pwa-helpers/connect-mixin.js';

import {
  installMediaQueryWatcher
} from 'pwa-helpers/media-query.js';

import {
  installOfflineWatcher
} from 'pwa-helpers/network.js';

// import { installRouter } from 'pwa-helpers/router.js';
import {
  updateMetadata
} from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import {
  store
} from '../store.js';

// These are the actions needed by this element.
import {
  updateLayout
} from '../actions/app.js';


// These are the elements needed by this element.
import {
  ButtonSharedStyles
} from './button-shared-styles.js';
import './optinomic-admin.js';
import './optinomic-help.js';
import './snack-bar.js';
import './my-view2.js';

class OptinomicApp extends connect(store)(LitElement) {
  _render({
    appTitle,
    _page,
    _snackbarOpened
  }) {
    // Anything that's related to rendering should be done in here.
    return html `
    
    ${ButtonSharedStyles}
    <style>
      :host {
        display: block;
        padding: 24px;
        max-width: 600px;
      }

      header {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .toolbar-list > a {
        display: inline-block;
        color: black;
        text-decoration: none;
        padding: 0 8px;
      }

      .toolbar-list > a[selected] {
        font-weight: bold;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        border-top: 1px solid #ccc;
        text-align: center;
      }

      /* Wide layout */
      @media (min-width: 460px) {
        header {
          flex-direction: row;
        }

        /* The drawer button isn't shown in the wide layout, so we don't
        need to offset the title */
        [main-title] {
          padding-right: 0px;
        }
      }
    </style>

    <header>
      <h1>${appTitle}</h1>
      <nav class="toolbar-list">
        <a selected?="${_page === 'start'}">Start | ${_page}</a>
      </nav>
    </header>

    <!-- Main content -->
    <main class="main-content mdc-typography">
      <my-view2 class="page" active?="${(_page === 'start') || (_page === undefined)}"></my-view2>
      <optinomic-help class="page" active?="${(_page === 'help')}"></moptinomicy-help>
    </main>

    <optinomic-admin></optinomic-admin>

    <footer>
      <p>YEAH: ${_page} = Made with &lt;3 by the Polymer team.</p>
    </footer>

    <snack-bar active?="${_snackbarOpened}">
      You are now ${_page === 'start' ? 'offline' : 'online'}.
    </snack-bar>

    `;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String
    }
  }

  _showHelp() {
    this._page = 'help';
  }

  _firstRendered() {
    // installRouter((location) => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
    installMediaQueryWatcher(`(min-width: 460px)`,
      (matches) => store.dispatch(updateLayout(matches)));

    this._page = 'start';
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      const pageTitle = properties.appTitle + ' - ' + changeList._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    // this._page = state.app.page;
    this._snackbarOpened = state.app.snackbarOpened;
  }
}

window.customElements.define('optinomic-app', OptinomicApp);
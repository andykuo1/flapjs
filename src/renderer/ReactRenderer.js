import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App.js';

class ReactRenderer
{
  constructor()
  {

  }

  render()
  {
    //Render the app in <div id="root"></div>
    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );
  }
}

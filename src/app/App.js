import React from 'react';
import { hot } from 'react-hot-loader';
import 'App.css';

import * as Config from 'config.js';

class App extends React.Component
{
  render()
  {
    return (
      <div>
        <h1>HELLO!</h1>
      </div>
      <svg width="100%", height="100%">
        <State x="100", y="100" />
      </svg>
    );
  }

  onNodeCreate(node)
  {

  }

  onNodeDestroy(node)
  {

  }

  onEdgeCreate(edge)
  {

  }

  onEdgeDestroy(edge)
  {

  }
}

function State(props)
{
  return <circle cx={props.x} cy={props.y} r=Config.NODE_RADIUS stroke=Config.NODE_STROKE_STYLE fill=Config.NODE_FILL_STYLE />;
}

export default hot(module)(App);

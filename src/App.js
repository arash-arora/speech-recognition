import "./App.css";
import React, { useState, useEffect } from "react";

//1. Import Dependecies
import * as tf from "@tensorflow/tfjs";
import * as speech from "@tensorflow-models/speech-commands";
import { model } from "@tensorflow/tfjs";

const App = () => {
  //2. Create Model and Action States
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null); //store actions recorded by the microphone
  const [labels, setLabels] = useState([]); //commands
  // labels.push("hello");

  //Create Recognizer - will run this model once the app starts up using useEffect()
  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT"); // loading our browser model
    console.log("Model Loaded");
    await recognizer.ensureModelLoaded(); // to check if it has actually been loaded
    console.log(recognizer.wordLabels()); // console logging the available labels (different commands)

    setModel(recognizer);
    setLabels(recognizer.wordLabels());
  };

  // triggering loadModel function everytime it notices a channge
  useEffect(() => {
    loadModel();
  }, []);
  //3. Listen for Actions - defining a function which actually listens to our actions
  function argMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]; // returns the index of highest score
  }

  // async functions wait to get a result
  const recognizeCommands = async () => {
    console.log("Listening for Commands");

    //listens our microphone if we're passing commands or what commands
    model.listen(
      (result) => {
        console.log(result);
        setAction(labels[argMax(Object.values(result.scores))]); //converting the max score into the appropriate label
        console.log(action);
      },
      //generates a spectrogram for every command and probability threshold
      { includeSpectrogram: true, probabilityThreshold: 0.9 }
    );
    setTimeout(() => {
      model.stopListening();
      alert("TimeOver");
    }, 10e3); //10e3 - 10 seconds
  };
  return (
    <div className='App'>
      <div className='commands'>
        <h1>Commands you can try out:</h1>
        {labels.map((label) => {
          return <span>{label} &nbsp; | </span>;
        })}
      </div>
      <button onClick={recognizeCommands}>Command</button>
      <div className='action'>{action ? action : "No Action Detected"}</div>
    </div>
  );
};

export default App;

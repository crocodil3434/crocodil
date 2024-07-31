import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

function Timer({ isOpen, onClose }) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [syllableCount, setSyllableCount] = useState(0);
  const [stutterCount, setStutterCount] = useState(0);
  const [spm, setSpm] = useState('0.00');
  const [ss, setSs] = useState('0.00');
  const [severity, setSeverity] = useState('Belirlenmemiş');

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 10);
        const minutes = time / 60000;
        const newSpm = ((syllableCount / minutes).toFixed(2)).toString();
        const newSs = (syllableCount > 0 ? ((stutterCount / syllableCount) * 100).toFixed(2).toString() : '0.00');
        setSpm(newSpm);
        setSs(newSs);
        setSeverity(getSeverity(newSs));
      }, 10);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, syllableCount, stutterCount]);

  function handleStartStop() {
    setIsActive(!isActive);
  }

  function handleReset() {
    setTime(0);
    setSyllableCount(0);
    setStutterCount(0);
    setSpm('0.00');
    setSs('0.00');
    setSeverity('Belirlenmemiş');
    if (isActive) {
      setIsActive(false);
      setTimeout(() => setIsActive(true), 10);
    }
  }

  function getSeverity(ssPercentage) {
    const ss = parseFloat(ssPercentage);
    if (ss >= 96) {
      return 'Çok Şiddetli';
    } else if (ss >= 89) {
      return 'Çok Şiddetli';
    } else if (ss >= 78) {
      return 'Şiddetli';
    } else if (ss >= 61) {
      return 'Şiddetli';
    } else if (ss >= 41) {
      return 'Orta';
    } else if (ss >= 24) {
      return 'Orta';
    } else if (ss >= 12) {
      return 'Hafif';
    } else if (ss >= 5) {
      return 'Hafif';
    } else {
      return 'Çok Hafif';
    }
  }

  if (!isOpen) return null;



  return (
    
    <Draggable handle=".handle">





<div className="fixed inset-0flex justify-center items-center z-50 shadow-xl">
<div className="relative bg-white rounded-lg p-5 max-w-md mx-auto">

      <button 
              className="absolute top-0 right-0 m-4 text-2xl text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              &times; {/* Unicode character for 'close' */}
            </button>
      <div className="handle cursor-move text-center text-white p-2 bg-teal-600">Buradan Taşıyınız</div>

      
<div className="container mx-auto p-4 max-w-md shadow-lg rounded-lg bg-white">

      <div className="flex flex-col items-center space-y-5">
        {/* Şiddet Eşdeğeri */}
        <div className="p-4 w-full">
          <div className="text-lg font-semibold text-center">Şiddet Eşdeğeri</div>
          <div className={`text-xl font-bold text-center my-2 ${severity === 'Çok Şiddetli' ? 'text-red-600' : 
                          severity === 'Şiddetli' ? 'text-orange-500' : 
                          severity === 'Orta' ? 'text-yellow-600' : 
                          severity === 'Hafif' ? 'text-green-500' : 'text-blue-500'}`}>
            {severity}
          </div>
        </div>

        {/* Timer */}
        <div className="text-4xl font-bold bg-gray-100 px-8 py-4 rounded-full shadow">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.
          {("0" + ((time / 10) % 100)).slice(-2)}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4 w-full">
        <button 
            className={`flex-grow py-3 px-6 text-white rounded-full shadow-lg ${isActive ? 'bg-red-500' : 'bg-blue-500'}`}
            onClick={handleStartStop}
          >
            {isActive ? 'Durdur' : 'Başlat'}
          </button>
          <button 
            className="flex-grow py-3 px-6 bg-gray-300 text-black rounded-full shadow-lg"
            onClick={handleReset} // Buton artık her zaman aktif
          >
            Sıfırla
          </button>
        </div>

        {/* Counters */}
        <div className="flex w-full justify-around">
          <div className="flex items-center">
            <button 
              className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg"
              onClick={() => setSyllableCount(c => c + 1)} 
              disabled={!isActive}
            >
              Hece
            </button>
            <span className="text-lg ml-3">{syllableCount}</span>
          </div>

          <div className="flex items-center">
            <button 
              className="bg-yellow-500 text-white py-3 px-6 rounded-full shadow-lg"
              onClick={() => setStutterCount(c => c + 1)} 
              disabled={!isActive}
            >
              Kekemelik
            </button>
            <span className="text-lg ml-3">{stutterCount}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex w-full justify-between mt-4 p-4 rounded-lg bg-gray-50">
          <div className="text-center">
            <div className="text-lg text-gray-700">SPM</div>
            <div className="text-xl text-gray-800">{spm}</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-gray-700">SS%</div>
            <div className="text-xl text-gray-800">{ss}%</div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>



    </Draggable>


  );
}

export default Timer;

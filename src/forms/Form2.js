import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

function Form2() {
  const location = useLocation();
  const { doctorId, patientId } = location.state || { doctorId: '', patientId: '' };
  const [inputThree, setInputThree] = useState('');
  const [inputFour, setInputFour] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formRef = collection(firestore, 'forms');
      await addDoc(formRef, {
        doctorId,
        patientId,
        formType: 'Form 2',
        inputThree,
        inputFour,
      });
      alert('Form 2 başarıyla kaydedildi.');
    } catch (error) {
      console.error('Form kaydederken hata oluştu:', error);
      alert('Form kaydedilemedi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input Three:
        <input type="text" value={inputThree} onChange={(e) => setInputThree(e.target.value)} />
      </label>
      <label>
        Input Four:
        <input type="text" value={inputFour} onChange={(e) => setInputFour(e.target.value)} />
      </label>
      <button type="submit">Submit Form 2</button>
    </form>
  );
}

export default Form2;

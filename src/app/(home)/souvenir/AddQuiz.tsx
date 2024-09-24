'use client'
import axios from '@/lib/axios'
import React from 'react'
import { useState } from 'react';

export default function Souvenir() {
const [question, setQuestion] = useState('');
const [answer, setAnswer] = useState('');
const [options, setOptions] = useState(['', '', '', '']);
const handleOptionChange = (index, value) => {
  const newOptions = [...options];
  newOptions[index] = value;
  setOptions(newOptions);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedOptions = options.map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      return `${letter}. ${option}`;
    });
  
    try {
      await axios.post('/questions', {
        question,
        answer,
        options: formattedOptions
      });
      alert('Question added successfully');
      setQuestion('');
      setAnswer('');
      setOptions(['', '', '', '']);
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

return (
    <form onSubmit={handleSubmit}>
      <div style={{ backgroundColor:'#5a5a5a',border: '4px solid gray', paddingLeft: '20px',borderRadius: '25px',display: 'grid', gridTemplateColumns: '100px auto', gap: '10px' }}>
        <label style={{paddingTop:'7px',display: 'block',textAlign: 'center'}}>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='Input your question here'
          required
          style={{backgroundColor:'#5a5a5a',borderTopRightRadius: '25px',borderBottomRightRadius: '25px', border: '1px solid gray',borderLeft: '5px solid gray' }}
        />
      </div>
      <div style={{ backgroundColor:'#5a5a5a',border: '4px solid gray', paddingLeft: '20px',borderRadius: '25px',display: 'grid', gridTemplateColumns: '100px auto', gap: '10px' }}>
        <label style={{paddingTop:'7px',display: 'block',textAlign: 'center'}}>Answer:</label>
        <select
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          style={{backgroundColor:'#5a5a5a',borderTopRightRadius: '25px',borderBottomRightRadius: '25px', border: '1px solid gray',borderLeft: '5px solid gray' }}
        >
          <option value="">Select an answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>
      <div style={{border: '4px solid gray', padding: '20px',borderRadius: '25px'}}>
        <label style={{display: 'block',textAlign: 'center',padding:'7px'}}>Options:</label>
        {options.map((option, index) => (
          <div key={index} style={{ backgroundColor:'#5a5a5a',border: '4px solid gray',marginBottom:'10px', paddingLeft: '20px',borderRadius: '25px',display: 'grid', gridTemplateColumns: '77px auto', gap: '10px' }}>
            <label htmlFor={`option-${index}`} style={{paddingTop:'7px',display: 'block',textAlign: 'center'}}>
              {String.fromCharCode(65 + index)}.{" "}
            </label>
            <input
              id={`option-${index}`}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              required
              style={{backgroundColor:'#5a5a5a',borderTopRightRadius: '25px',borderBottomRightRadius: '25px', border: '1px solid gray',borderLeft: '5px solid gray' }}
            />
          </div>
        ))}
      </div>
      <div style={{display: 'grid', placeItems: 'center'}}>
        <button type="submit" style={{ backgroundColor:'#5a5a5a',border: '4px solid gray', paddingLeft: '20px',borderRadius: '25px',width:'fit-content'}}>Save Question</button>
      </div>
      <style jsx>{`
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        label {
          font-weight: bold;
        }
        input, select {
          padding: 8px;
          font-size: 16px;
        }
        button {
          padding: 10px;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}
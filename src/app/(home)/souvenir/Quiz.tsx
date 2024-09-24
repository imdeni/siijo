'use client'

import Alert from '@/components/elements/alert/page'
import axios from '@/lib/axios'
import { Button, Card, CardBody, CardHeader, Image, Link, Skeleton, Spinner } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
// import React from 'react'
import toast from 'react-hot-toast'

import React, { useState, useEffect } from 'react';
// import axios from 'axios'

// const questions = [
//     {
//       id: 1,
//       question: "What is the capital of France?",
//       options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"],
//       answer: "C"
//     },
//     {
//       id: 2,
//       question: "What is 2 + 2?",
//       options: ["A. 3", "B. 4", "C. 5", "D. 6"],
//       answer: "B"
//     }
//     // Add more questions as needed
//   ];

export default function Souvenir() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Fetch the question data including options
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('questionsData'); // Adjust endpoint as needed
        const questionData = response;
        
        // Assuming the response includes both question and options
        setQuestions(questionData); // Set the questions state with the fetched data
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (event) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: event.target.value
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    return questions.reduce((score, question) => {
      if (answers[question.id] === question.answer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      {!showResults ? (
        <div>
          {currentQuestion && (
            <div>
              <h2>{currentQuestion.question}</h2>
              <form>
                {currentQuestion.options.map((option) => (
                  <div key={option.id}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.option_text.charAt(0)} // Assuming the option text starts with 'A', 'B', etc.
                        checked={answers[currentQuestion.id] === option.option_text.charAt(0)}
                        onChange={handleOptionChange}
                      />
                      {option.option_text}
                    </label>
                  </div>
                ))}
              </form>
              <button
                onClick={() =>
                  setCurrentQuestionIndex(
                    (prevIndex) => (prevIndex + 1) % questions.length
                  )
                }
              >
                Next
              </button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Your Score: {getScore()} / {questions.length}</h2>
          <button
            onClick={() => {
              setAnswers({});
              setCurrentQuestionIndex(0);
              setShowResults(false);
            }}
          >
            Restart Quiz
          </button>
        </div>
      )}
      <style jsx>{`
        .quiz-container {
          padding: 20px;
          max-width: 600px;
          margin: auto;
        }
        h2 {
          font-size: 24px;
        }
        button {
          margin-top: 10px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

  







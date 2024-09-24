'use client'
import { useRouter } from 'next/navigation';
import Alert from '@/components/elements/alert/page'
import axios from '@/lib/axios'
import { Button } from '@nextui-org/react'
import React, { useState, useEffect } from 'react';

export default function Admin() {
  const router = useRouter(); // Menggunakan useRouter untuk navigasi halaman
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [flagQuiz, setFlagQuiz] = useState(null);
  const [score, setScore] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [time, setTime] = useState(60 * 60); // Menginisialisasi dengan 60 menit (60 * 60 detik)
  const [isRunning, setIsRunning] = useState(false); // Status timer
  const [isTimeUp, setIsTimeUp] = useState(false); // Status apakah waktu sudah habis


  const restartQuiz = () => {
    setCurrentQuestionIndex(0); // Reset soal ke pertanyaan pertama
  setAnswers({}); // Reset jawaban
  setShowResults(false); // Sembunyikan hasil
  setTime(60 * 60); // Reset waktu ke 60 menit (sesuaikan dengan kebutuhan)
  setIsRunning(true); // Mulai kembali timer setelah restart
  setIsTimeUp(false); // Reset status waktu habis
  setFlagQuiz(0); // Mengatur ulang status quiz ke awal
  console.log("Restarting quiz...");
  // Tambahkan navigasi ulang jika diperlukan:
  // router.push('/path-to-quiz'); // Redirect ke halaman kuis lagi, jika perlu
};

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1); // Mengurangi waktu setiap detik
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false); // Hentikan timer
      setIsTimeUp(true); // Tampilkan notifikasi bahwa waktu habis
      handleSubmit();
    }

    return () => clearInterval(timer); // Membersihkan interval
  }, [isRunning, time]);

  // Fungsi untuk memulai timer
  const startTimer = () => {
    setIsRunning(true);
    setIsTimeUp(false); // Reset status waktu habis jika timer dimulai ulang
  };

  // Fungsi untuk menghentikan timer
  const stopTimer = () => setIsRunning(false);

  // Fungsi untuk mereset timer ke 60 menit
  const resetTimer = () => {
    setIsRunning(false);
    setTime(60 * 60); // Reset ke 60 menit
    setIsTimeUp(false); // Reset status waktu habis
  };

  // Mengonversi detik menjadi menit dan detik (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // const [nilaiScore, setNilaiscore] = useState(null);


    useEffect(() => {
      const fetchSession = async () => {
        try {
          // Fetch the session data from your API endpoint
          const response = await fetch('https://sijo.vercel.app/sijo/api/auth/session');
          const data = await response.json();
          const userEmail=data.user.email
          
            console.log(data)
          if (userEmail) {
            setUserEmail(userEmail);
            const emailResponse = await axios.get(`getFlag?email=${userEmail}`);
            const flagQuizData = emailResponse.flag_quiz;
            const scoreData = emailResponse.score;
            
            // console.log(emailResponse)
            setFlagQuiz(flagQuizData);
            setScore(scoreData);
          }

        } catch (error) {
          console.error('Error fetching session data:', error);
        }
      };
  
      fetchSession();
    }, []);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('questionsData');
        let questionData = response;

        if (Array.isArray(questionData)) {
          questionData = shuffleArray(questionData).slice(0, 20);
          setQuestions(questionData);
        } else {
          console.error('Expected an array but got:', questionData);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
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

  const handleDivClick = (value) => {
    handleOptionChange({ target: { value } });
  };

  const handleSubmit = async () => {
    setShowResults(true);
    const finalScore = getScore();
    console.log(finalScore)
    if (finalScore >= 0 && userEmail) {
      try {
        const response = await axios.post('/updateUserData', {
          email: userEmail,
          score: finalScore,
        });
        if (response.data.success) {
          console.log('User data updated successfully');
        } else {
          console.error('Failed to update user data:', response.data.error);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
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
    <div>

      {flagQuiz === 0 ? (
      <div className="quiz-container">
        {!showResults ? (
          <div>
<div className="p-4 flex justify-center"> 
  <div className="text-center bg-gray-700 text-white p-3 rounded-lg shadow-lg border border-gray-600 w-auto"> {/* Warna background disesuaikan dengan warna background pertanyaan */}
    <h1 className="text-xl font-bold mb-3">
      Waktu Tersisa: {formatTime()}
    </h1>
    {isTimeUp && <p className="text-red-500 mb-4 font-semibold">Waktu habis!</p>}
    
    <div className="space-x-2"> 
      <button 
        className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-400 transition-transform transform hover:scale-105" 
        onClick={startTimer}
        disabled={isRunning}
      >
        Mulai
      </button>
      <button 
        className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-400 transition-transform transform hover:scale-105"
        onClick={stopTimer}
        disabled={!isRunning}
      >
        Berhenti
      </button>
    </div>
  </div>
</div>
            <br />
            {currentQuestion && (
            <div className="bg-gray-800 p-6 rounded-xl max-w-xl mx-auto text-white">
            <h2 className="bg-gray-700 text-white text-center text-xl font-semibold py-4 rounded-lg mb-6 shadow-lg">
              {currentQuestion.question}
            </h2>
          
            <div className="text-center">
              <label className="text-lg font-medium text-gray-200">Pilih jawaban :</label>
              <form className="mt-4">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleDivClick(option.option_text.charAt(0))}
                    className="bg-gray-700 text-gray-200 flex items-center justify-between cursor-pointer border-2 border-gray-500 rounded-lg p-4 mb-4 hover:bg-teal-500 transition-all duration-300"
                  >
                    <label className="flex items-center text-base">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option.option_text.charAt(0)}
                        checked={answers[currentQuestion.id] === option.option_text.charAt(0)}
                        onChange={handleOptionChange}
                        className="mr-3"
                      />
                      {option.option_text}
                    </label>
                  </div>
                ))}
              </form>
            </div>
          
            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length)}
                className="bg-teal-500 text-white py-2 px-6 rounded-lg mr-4 hover:bg-teal-600 transition-all duration-300"
              >
                Next
              </button>
              
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Submit
              </button>
            </div>
          </div>
          
            )}
          </div>
        ) : (
          <div>
        {getScore() >= 14 ? (
          <>
            <h2>Your Score: {getScore()} / {questions.length}</h2>
            <a
              href="/images/congratulations.png"
              download="congratulations.png"
            >
              <button>Download Your Reward</button>
            </a>
          </>
        ) : (
          <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex items-center justify-center">
       <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div>
          <h2 className="text-5xl font-bold mb-4 text-blue-500">Skor anda: {score}</h2>
           <p className="text-xl mb-6 text-gray-300">Sayang sekali anda belum lulus </p>
           <p className="mb-6 text-gray-400">Silahkan kerjakan kembali</p>
           <a
             >
               <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-300 transform hover:scale-105" onClick={restartQuiz}>Kerjakan kembali</button>
             </a>
           </div>
          </div>
          </div>
        )}
      </div>
      )}
    </div>
    ) : (
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex items-center justify-center">
       <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        {score >= 14 ? (
           <>
          
          <h2 className="text-5xl font-bold mb-4 text-blue-500">Your Score: {score} / {questions.length}</h2>
    <p className="text-xl mb-6 text-gray-300">Selamat anda berhasil lulus!</p>
    <p className="mb-6 text-gray-400">Sertifikat bisa dilihat melalui tombol di bawah</p>
    
    <a href="/kelas">
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-300 transform hover:scale-105">
        Lihat Sertifikat
      </button>
    </a>
         </>
        ) : (
          <div>
         <h2 className="text-5xl font-bold mb-4 text-blue-500">Skor anda: {score}</h2>
          <p className="text-xl mb-6 text-gray-300">Sayang sekali anda belum lulus </p>
          <p className="mb-6 text-gray-400">Silahkan kerjakan kembali</p>
          <a
            >
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-300 transform hover:scale-105" onClick={restartQuiz}>Kerjakan kembali</button>
            </a>
          </div>
        )
      }
      </div>
      </div>)}
    </div>
  );
};

const formatQuestion = function (q) {
  const correct = Math.floor(Math.random() * 4);
  const answers = [...q.incorrect_answers];
  answers.splice(correct, 0, q.correct_answer);

  return {
    question: decodeURIComponent(q.question),
    answers: answers.map(decodeURIComponent),
    correct,
  };
};

export const fetchQuestions = async function () {
  const res = await fetch(
    "https://opentdb.com/api.php?amount=5&category=18&type=multiple&encode=url3986",
  );
  if (!res.ok) throw new Error("Problem receiving the questions.");

  const data = await res.json();
  if (data.results.length === 0) throw new Error("No questions received.");

  return data.results.map(formatQuestion);
};

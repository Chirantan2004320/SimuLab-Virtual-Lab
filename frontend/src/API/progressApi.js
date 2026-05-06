import api from "./api";

export const markExperimentCompleted = async ({
  labSlug,
  experimentSlug,
  points = 10,
}) => {
  const res = await api.post("/api/progress/complete", {
    labSlug,
    experimentSlug,
    points,
  });

  return res.data;
};

export const saveQuizResult = async ({
  labSlug,
  experimentSlug,
  correctAnswers,
  totalQuestions,
}) => {
  const res = await api.post("/api/progress/quiz", {
    labSlug,
    experimentSlug,
    correctAnswers,
    totalQuestions,
  });

  return res.data;
};

export const saveCodingSubmission = async ({
  labSlug,
  experimentSlug,
  problemTitle,
  language,
  code,
  result = "attempted",
}) => {
  const res = await api.post("/api/progress/coding", {
    labSlug,
    experimentSlug,
    problemTitle,
    language,
    code,
    result,
  });

  return res.data;
};
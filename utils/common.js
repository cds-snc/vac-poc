import { eligibilityMatch } from "../selectors/benefits";

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const questionIsRelevant = (
  question_variable_name,
  profileFilters,
  reduxState
) => {
  let relevantPaths = reduxState.eligibilityPaths.filter(
    ep =>
      ep.requirements &&
      eligibilityMatch(ep, profileFilters, reduxState.multipleChoiceOptions)
  );
  let returnValue = false;
  relevantPaths.forEach(ep => {
    ep.requirements.forEach(mcoId => {
      const linkedQuestion = reduxState.multipleChoiceOptions.filter(
        mco => mco.id === mcoId
      )[0].linked_question;
      if (linkedQuestion === question_variable_name) {
        returnValue = true;
      }
    });
  });
  return returnValue;
};

export const showQuestion = (question_variable_name, index, reduxState) => {
  if (index === 0) {
    return true;
  }

  const { questions, questionDisplayLogic } = reduxState;

  let questionsToHide = [];
  questionDisplayLogic.forEach(x => {
    const questionName = x.question[0];
    const usersAnswer = reduxState[questionName];
    if (x["has value"].indexOf(usersAnswer) > -1) {
      questionsToHide = questionsToHide.concat(x["exclude questions"]);
    }
  });

  if (questionsToHide.indexOf(question_variable_name) > -1) {
    return false;
  }

  const displayableQuestions = questions.filter(
    q => questionsToHide.indexOf(q.variable_name) == -1
  );
  const new_index = displayableQuestions
    .map(x => x.variable_name)
    .indexOf(question_variable_name);
  const previousQuestionAnswered =
    reduxState[displayableQuestions[new_index - 1].variable_name] !== "";
  if (!previousQuestionAnswered && question_variable_name !== "needs") {
    return false;
  }

  return true;
};

// taken from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
export const areCookiesDisabled = () => {
  try {
    // Create cookie
    document.cookie = "cookietest=1";
    const cookiesDisabled = document.cookie.indexOf("cookietest=") === -1;
    // Delete cookie
    document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    return cookiesDisabled;
  } catch (e) {
    return true;
  }
};

export const getLink = (url, page, referrer) => {
  // link for page, copying the query params of url except for referrer
  let link =
    page +
    "?" +
    Object.entries(url.query)
      .filter(x => x[0] !== "" && x[1] !== "" && x[0] !== "referrer")
      .map(x => {
        return x[0] + "=" + x[1];
      })
      .join("&");
  if (referrer) {
    link += "&referrer=" + referrer;
  }
  return link;
};

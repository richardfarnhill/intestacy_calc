/**
 * QuestionFlow.js
 * Manages the flow of questions based on user answers
 */

class QuestionFlow {
  /**
   * Create a new QuestionFlow instance
   * @param {Array} questions - Array of question objects with id and text properties
   * @param {Object} flowLogic - Object mapping question IDs to functions that determine the next question
   */
  constructor(questions, flowLogic) {
    this.questions = questions;
    this.flowLogic = flowLogic;
    this.questionMap = this.createQuestionMap();
  }
  
  /**
   * Create a map of questions by ID for easy lookup
   * @returns {Object} - Map of questions by ID
   */
  createQuestionMap() {
    const map = {};
    this.questions.forEach(question => {
      map[question.id] = question;
    });
    return map;
  }
  
  /**
   * Get the first question ID to start the flow
   * @returns {string} - The ID of the first question
   */
  getFirstQuestionId() {
    return this.questions[0].id;
  }
  
  /**
   * Get the next question ID based on the current question and answer
   * @param {string} currentQuestionId - The ID of the current question
   * @param {boolean} answer - The user's answer (true for Yes, false for No)
   * @returns {string|null} - The ID of the next question, or null if there is no next question
   */
  getNextQuestionId(currentQuestionId, answer) {
    if (this.flowLogic[currentQuestionId]) {
      return this.flowLogic[currentQuestionId](answer);
    }
    return null;
  }
  
  /**
   * Get a question by its ID
   * @param {string} questionId - The ID of the question to get
   * @returns {Object|null} - The question object, or null if not found
   */
  getQuestion(questionId) {
    return this.questionMap[questionId] || null;
  }
  
  /**
   * Get the text for a specific question by ID
   * @param {string} questionId - The ID of the question
   * @returns {string} - The question text
   */
  getQuestionText(questionId) {
    const question = this.getQuestion(questionId);
    return question ? question.text : "Unknown question";
  }
  
  /**
   * Get all questions
   * @returns {Array} - Array of all question objects
   */
  getAllQuestions() {
    return this.questions;
  }
}

// Export the class for use in other modules
export default QuestionFlow;
/**
 * IntestacyCalculator.js
 * Core logic for the UK intestacy calculator
 */

class IntestacyCalculator {
  constructor() {
    // Updated to the latest statutory legacy amount
    this.STATUTORY_LEGACY = 322000.00;
    
    // Initialize state
    this.state = {
      name: null,
      estateValue: null,
      married: null,
      children: null,
      grandchildren: null,
      greatGrandchildren: null,
      parentsAlive: null,
      siblings: null,
      fullSiblings: null,
      halfSiblings: null,
      grandparents: null,
      auntsUncles: null,
      fullAuntsUncles: null,
      halfAuntsUncles: null,
      currentQuestion: 0,
      childrenDeceased: null,
      deceasedChildrenHadChildren: null,
      siblingsDeceasedWithChildren: null,
      auntsUnclesDeceasedWithChildren: null
    };
    
    // Define questions
    this.questions = [
      { id: "married", text: "Are you married or in a civil partnership?" },
      { id: "children", text: "Do you have any children?" },
      { id: "childrenDeceased", text: "Are any of your children deceased?" },
      { id: "deceasedChildrenHadChildren", text: "Did any of your deceased children have children of their own?" },
      { id: "parentsAlive", text: "Are either of your parents alive?" },
      { id: "siblings", text: "Do you have any siblings?" },
      { id: "fullSiblings", text: "Do you have any full siblings (same two parents)?" },
      { id: "siblingsDeceasedWithChildren", text: "Are any of your siblings deceased with children of their own?" },
      { id: "halfSiblings", text: "Do you have any half siblings (one shared parent)?" },
      { id: "grandchildren", text: "Do you have any grandchildren?" },
      { id: "greatGrandchildren", text: "Do you have any great-grandchildren?" },
      { id: "grandparents", text: "Do you have any living grandparents?" },
      { id: "auntsUncles", text: "Do you have any living aunts or uncles?" },
      { id: "fullAuntsUncles", text: "Do you have any full aunts or uncles (siblings of your parents)?" },
      { id: "auntsUnclesDeceasedWithChildren", text: "Are any of your aunts or uncles deceased with children of their own?" },
      { id: "halfAuntsUncles", text: "Do you have any half aunts or uncles (half-siblings of your parents)?" }
    ];
    
    // Create a lookup for questions by ID
    this.questionMap = this.createQuestionMap();
    
    // Define the question flow logic
    this.questionFlow = this.defineQuestionFlow();
  }
  
  /**
   * Create a map of questions by ID for easy lookup
   */
  createQuestionMap() {
    const map = {};
    this.questions.forEach(question => {
      map[question.id] = question;
    });
    return map;
  }
  
  /**
   * Define the question flow logic
   */
  defineQuestionFlow() {
    return {
      "married": answer => answer ? "children" : "children",
      "children": answer => answer ? "childrenDeceased" : "parentsAlive",
      "childrenDeceased": answer => answer ? "deceasedChildrenHadChildren" : null,
      "deceasedChildrenHadChildren": answer => null,
      "parentsAlive": answer => answer ? null : "siblings",
      "siblings": answer => answer ? "fullSiblings" : "grandchildren",
      "fullSiblings": answer => answer ? "siblingsDeceasedWithChildren" : "halfSiblings",
      "siblingsDeceasedWithChildren": answer => null,
      "halfSiblings": answer => null,
      "grandchildren": answer => answer ? null : "greatGrandchildren",
      "greatGrandchildren": answer => answer ? null : "grandparents",
      "grandparents": answer => answer ? null : "auntsUncles",
      "auntsUncles": answer => answer ? "fullAuntsUncles" : null,
      "fullAuntsUncles": answer => answer ? "auntsUnclesDeceasedWithChildren" : "halfAuntsUncles",
      "auntsUnclesDeceasedWithChildren": answer => null,
      "halfAuntsUncles": answer => null
    };
  }
  
  /**
   * Validate the estate value input
   * @param {number} value - The estate value to validate
   * @returns {Object} - Object with isValid and errorMessage properties
   */
  validateEstateValue(value) {
    try {
      if (value === null || value === undefined) {
        return { isValid: false, errorMessage: "Please enter your estate value" };
      }
      
      value = parseFloat(value);
      
      if (isNaN(value)) {
        return { isValid: false, errorMessage: "Please enter a valid number" };
      }
      
      if (value <= 0) {
        return { isValid: false, errorMessage: "Your estate value must be greater than £0" };
      }
      
      return { isValid: true, errorMessage: "" };
    } catch (error) {
      return { isValid: false, errorMessage: "Please enter a valid number" };
    }
  }
  
  /**
   * Format amount as currency with £ symbol
   * @param {number} amount - The amount to format
   * @returns {string} - Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP' 
    }).format(amount);
  }
  
  /**
   * Calculate the distribution of the estate based on the current state
   * @returns {string} - Description of how the estate will be distributed
   */
  calculateDistribution() {
    const estateValue = parseFloat(this.state.estateValue);
    const formattedValue = this.formatCurrency(estateValue);
    
    // Spouse rules
    if (this.state.married) {
      if (!this.state.children) {
        return `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`;
      } else {
        if (estateValue <= this.STATUTORY_LEGACY) {
          return `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`;
        }
        
        const remainder = estateValue - this.STATUTORY_LEGACY;
        const spouseShare = this.STATUTORY_LEGACY + (remainder / 2);
        const childrenShare = remainder / 2;
        
        // Improved text for per stirpes distribution
        const childrenText = !this.state.childrenDeceased 
          ? "children" 
          : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
        
        return (
          `Your estate will be distributed as follows:\n` +
          `• Your spouse/civil partner will receive: ${this.formatCurrency(spouseShare)}\n` +
          `  - First ${this.formatCurrency(this.STATUTORY_LEGACY)} as statutory legacy\n` +
          `  - Plus ${this.formatCurrency(remainder / 2)} (half of the remainder)\n` +
          `• Your ${childrenText} will share: ${this.formatCurrency(childrenShare)}`
        );
      }
    }
    
    // Non-spouse rules in strict order of precedence
    if (this.state.children) {
      const childrenText = !this.state.childrenDeceased 
        ? "children" 
        : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
      
      return `Your entire estate of ${formattedValue} will be divided equally between your ${childrenText}.`;
    }
    
    if (this.state.parentsAlive) {
      return `Your entire estate of ${formattedValue} will pass to your surviving parent(s) in equal shares.`;
    }
    
    // Improved sibling handling with full vs half distinction
    if (this.state.siblings) {
      if (this.state.fullSiblings) {
        const siblingType = "full siblings";
        const childrenText = this.state.siblingsDeceasedWithChildren 
          ? " (their children will inherit their share per stirpes)" 
          : "";
        
        return `Your entire estate of ${formattedValue} will be divided equally between your ${siblingType}${childrenText}.`;
      } else if (this.state.halfSiblings) {
        return `Your entire estate of ${formattedValue} will be divided equally between your half-siblings.`;
      }
    }
    
    if (this.state.grandchildren) {
      return `Your entire estate of ${formattedValue} will be divided equally between your grandchildren.`;
    }
    
    if (this.state.greatGrandchildren) {
      return `Your entire estate of ${formattedValue} will be divided equally between your great-grandchildren.`;
    }
    
    if (this.state.grandparents) {
      return `Your entire estate of ${formattedValue} will be divided equally between your grandparents.`;
    }
    
    // Improved aunts/uncles handling with full vs half distinction
    if (this.state.auntsUncles) {
      if (this.state.fullAuntsUncles) {
        const auntsText = "aunts and uncles";
        const childrenText = this.state.auntsUnclesDeceasedWithChildren 
          ? " (their children will inherit their share per stirpes)" 
          : "";
        
        return `Your entire estate of ${formattedValue} will be divided equally between your ${auntsText}${childrenText}.`;
      } else if (this.state.halfAuntsUncles) {
        return `Your entire estate of ${formattedValue} will be divided equally between your half-aunts and half-uncles.`;
      }
    }
    
    return `Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
  }
  
  /**
   * Process the user's answer to a specific question and determine the next question
   * @param {string} questionId - The ID of the question being answered
   * @param {boolean} answer - The user's answer (true for Yes, false for No)
   * @returns {string|null} - The ID of the next question to ask, or null if we have enough information
   */
  processAnswer(questionId, answer) {
    // Update the state with the user's answer
    this.state[questionId] = answer;
    
    // Determine the next question based on the flow logic
    if (this.questionFlow[questionId]) {
      const nextQuestionId = this.questionFlow[questionId](answer);
      return nextQuestionId;
    }
    
    return null;
  }
  
  /**
   * Get the text for a specific question by ID
   * @param {string} questionId - The ID of the question
   * @returns {string} - The question text
   */
  getQuestionText(questionId) {
    if (this.questionMap[questionId]) {
      return this.questionMap[questionId].text;
    }
    return "Unknown question";
  }
  
  /**
   * Check if we have enough information to determine distribution
   * @returns {boolean} - True if we can determine distribution, false otherwise
   */
  canDetermineDistribution() {
    if (this.state.married && !this.state.children) {
      return true;
    }
    
    if (this.state.children) {
      return (
        this.state.childrenDeceased !== null && 
        (!this.state.childrenDeceased || this.state.deceasedChildrenHadChildren !== null)
      );
    }
    
    // Check the full hierarchy
    return [
      this.state.parentsAlive !== null && this.state.parentsAlive,
      this.state.fullSiblings !== null && this.state.fullSiblings,
      this.state.halfSiblings !== null && this.state.halfSiblings,
      this.state.grandchildren !== null && this.state.grandchildren,
      this.state.greatGrandchildren !== null && this.state.greatGrandchildren,
      this.state.grandparents !== null && this.state.grandparents,
      this.state.fullAuntsUncles !== null && this.state.fullAuntsUncles,
      this.state.halfAuntsUncles !== null && this.state.halfAuntsUncles
    ].some(condition => condition);
  }
}

// Export the class for use in other modules
export default IntestacyCalculator;
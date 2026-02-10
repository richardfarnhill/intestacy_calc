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
      name: '', // Initialized to empty string
      estateValue: 0, // Initialized to 0
      married: null,
      cohabiting: null, // New property for cohabiting status
      children: null,
      parentsAlive: null,
      siblings: null,
      fullSiblings: null,
      halfSiblings: null,
      grandparents: null,
      auntsUncles: null,
      fullAuntsUncles: null,
      halfAuntsUncles: null,
      childrenDeceased: null,
      deceasedChildrenHadChildren: null,
      siblingsDeceasedWithChildren: null,
      auntsUnclesDeceasedWithChildren: null
    };

    // Define questions
    this.questions = [
      { id: "children", text: "Do you have any children?" },
      { id: "childrenDeceased", text: "Are any of your children deceased?" },
      { id: "deceasedChildrenHadChildren", text: "Did any of your deceased children have children of their own?" },
      { id: "parentsAlive", text: "Are either of your parents alive?" },
      { id: "siblings", text: "Do you have any siblings?" },
      { id: "fullSiblings", text: "Do you have any full siblings (same two parents)?" },
      { id: "siblingsDeceasedWithChildren", text: "Are any of your siblings deceased with children of their own?" },
      { id: "halfSiblings", text: "Do you have any half siblings (one shared parent)?" },
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
   * Reset all state properties to their initial values
   */
  resetState() {
    this.state.name = '';
    this.state.estateValue = 0;
    this.state.married = null;
    this.state.cohabiting = null;
    this.state.children = null;
    this.state.childrenDeceased = null;
    this.state.deceasedChildrenHadChildren = null;
    this.state.parentsAlive = null;
    this.state.siblings = null;
    this.state.fullSiblings = null;
    this.state.siblingsDeceasedWithChildren = null;
    this.state.halfSiblings = null;
    this.state.grandparents = null;
    this.state.auntsUncles = null;
    this.state.fullAuntsUncles = null;
    this.state.auntsUnclesDeceasedWithChildren = null;
    this.state.halfAuntsUncles = null;
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
      "children": answer => answer ? "childrenDeceased" : "parentsAlive",
      "childrenDeceased": answer => answer ? "deceasedChildrenHadChildren" : null,
      "deceasedChildrenHadChildren": answer => null,
      "parentsAlive": answer => answer ? null : "siblings",
      "siblings": answer => answer ? "fullSiblings" : "grandparents", // If "no" to any siblings, go to grandparents
      "fullSiblings": answer => answer ? "siblingsDeceasedWithChildren" : "halfSiblings",
      "siblingsDeceasedWithChildren": answer => null,
      // If user has siblings (answered yes to "siblings"), but no full siblings,
      // then answers about half siblings:
      // - If YES to half siblings, ask about deceased with children.
      // - If NO to half siblings, THEN proceed to check grandparents.
      "halfSiblings": answer => answer ? "siblingsDeceasedWithChildren" : "grandparents",
      "grandparents": answer => answer ? null : "auntsUncles",
      "auntsUncles": answer => answer ? "fullAuntsUncles" : null,
      "fullAuntsUncles": answer => answer ? "auntsUnclesDeceasedWithChildren" : "halfAuntsUncles",
      "auntsUnclesDeceasedWithChildren": answer => null,
      "halfAuntsUncles": answer => answer ? "auntsUnclesDeceasedWithChildren" : null // If YES, ask about deceased with children; if NO, flow ends (Crown)
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
   * Determine the beneficiary class from the inheritance hierarchy based on current state.
   * This is the single source of truth for hierarchy traversal. Returns structured data
   * that all consumers (calculateDistribution, cohabiting path, hierarchy text) can use.
   * @returns {Object} - { beneficiaryClass, distributionText, label, color }
   * @private
   */
  _resolveHierarchyBeneficiary() {
    // Children
    if (this.state.children) {
      let distributionText = "your living children";
      if (this.state.childrenDeceased) {
        if (this.state.deceasedChildrenHadChildren) {
          distributionText = "your living children and the children of your deceased children (who will share their parent's portion per stirpes)";
        }
        // If deceasedChildrenHadChildren is false, it remains "your living children"
        // as the share of deceased children without issue is redistributed among living children.
      }
      // If no deceased children, the default "your living children" is used.
      return {
        beneficiaryClass: 'children',
        distributionText: distributionText,
        label: 'Children',
        color: '#95D47A'
      };
    }

    // Parents
    if (this.state.parentsAlive) {
      return {
        beneficiaryClass: 'parents',
        distributionText: "your surviving parent(s) in equal shares",
        label: 'Parents',
        color: '#F3C969'
      };
    }

    // Siblings - full take precedence over half
    if (this.state.siblings) {
      if (this.state.fullSiblings) {
        let distributionText = "your living full siblings";
        if (this.state.siblingsDeceasedWithChildren) {
          distributionText = "your living full siblings and the children of your deceased full siblings (who will share their parent's portion per stirpes)";
        }
        return {
          beneficiaryClass: 'fullSiblings',
          distributionText: distributionText,
          label: 'Full Siblings',
          color: '#E36588'
        };
      } else if (this.state.halfSiblings) {
        let distributionText = "your living half-siblings";
        if (this.state.siblingsDeceasedWithChildren) {
          distributionText = "your living half-siblings and the children of your deceased half-siblings (who will share their parent's portion per stirpes)";
        }
        return {
          beneficiaryClass: 'halfSiblings',
          distributionText: distributionText,
          label: 'Half-Siblings',
          color: '#E36588'
        };
      }
      // If siblings is true but neither full nor half are true, fall through
    }

    // Grandparents
    if (this.state.grandparents) {
      return {
        beneficiaryClass: 'grandparents',
        distributionText: "your grandparents",
        label: 'Grandparents',
        color: '#9B6EBF'
      };
    }

    // Aunts/Uncles - full take precedence over half
    if (this.state.auntsUncles) {
      if (this.state.fullAuntsUncles) {
        let distributionText = "your living full aunts and uncles";
        if (this.state.auntsUnclesDeceasedWithChildren) {
          distributionText = "your living full aunts and uncles and the children of your deceased full aunts and uncles (who will share their parent's portion per stirpes)";
        }
        return {
          beneficiaryClass: 'fullAuntsUncles',
          distributionText: distributionText,
          label: 'Full Aunts and Uncles',
          color: '#F78E69'
        };
      } else if (this.state.halfAuntsUncles) {
        let distributionText = "your living half-aunts and half-uncles";
        if (this.state.auntsUnclesDeceasedWithChildren) {
          distributionText = "your living half-aunts and half-uncles and the children of your deceased half-aunts and half-uncles (who will share their parent's portion per stirpes)";
        }
        return {
          beneficiaryClass: 'halfAuntsUncles',
          distributionText: distributionText,
          label: 'Half-Aunts and Half-Uncles',
          color: '#F78E69'
        };
      }
      // If auntsUncles is true but neither full nor half are true, fall through
    }

    // Crown - Bona Vacantia
    return {
      beneficiaryClass: 'crown',
      distributionText: null,
      label: 'Crown (Bona Vacantia)',
      color: '#8C8C8C'
    };
  }

  /**
   * Calculate the distribution of the estate based on the current state
   * @returns {Object} - Object with text description and data for visualization
   */
  calculateDistribution() {
    const estateValue = parseFloat(this.state.estateValue);
    const formattedValue = this.formatCurrency(estateValue);

    // Cohabiting warning - check this before spouse rules
    if (this.state.cohabiting) {
      // Initialize distribution data for visualization
      let distributionData = {
        shares: [],
        labels: [],
        colors: [],
        beneficiaries: [],
        totalValue: estateValue,
        warnings: [] // Initialize warnings array
      };

      // Populate distribution data based on the inheritance hierarchy
      // Only populate if there's no inheriting spouse (cohabiting doesn't inherit automatically)
      if (!this.state.married || (this.state.married && this.state.children && estateValue > this.STATUTORY_LEGACY)) {
        const hierarchy = this._resolveHierarchyBeneficiary();
        distributionData.shares = [estateValue];
        distributionData.labels = [hierarchy.label];
        distributionData.colors = [hierarchy.color];
        distributionData.beneficiaries = [hierarchy.label];
      }

      const cohabitingWarningMessage = 'As a cohabiting partner, you have no automatic inheritance rights under UK law.';
      distributionData.warnings.push(cohabitingWarningMessage);

      // Build hierarchy text for cohabiting scenario
      let hierarchyText;
      if (distributionData.beneficiaries.length > 0) {
        hierarchyText = this.getInheritanceHierarchyText(estateValue);
      } else {
        hierarchyText = `  - Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
      }

      return {
        text: (
          `<div class="intestacy-cohabiting-warning">` +
          `Warning: ${cohabitingWarningMessage}` +
          `</div>\n\n` +
          `Your estate of ${formattedValue} will be distributed as follows:\n` +
          `• Your cohabiting partner will not automatically inherit anything\n` +
          `• Your estate will pass to your relatives according to intestacy rules:\n` +
          hierarchyText +
          `\n\nTo protect your partner, you should create a valid Will.`
        ),
        data: distributionData
      };
    }

    // Initialize distribution data for other scenarios
    let distributionData = {
      shares: [],
      labels: [],
      colors: [],
      beneficiaries: [],
      totalValue: estateValue,
      warnings: [] // Initialize warnings for consistency, though not always populated outside cohabiting
    };

    // Spouse rules
    if (this.state.married) {
      if (!this.state.children) {
        // Spouse gets everything
        distributionData.shares = [estateValue];
        distributionData.labels = ['Spouse/Civil Partner'];
        distributionData.colors = ['#4B9CD3'];
        distributionData.beneficiaries = ['Spouse/Civil Partner'];

        return {
          text: `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`,
          data: distributionData
        };
      } else {
        if (estateValue <= this.STATUTORY_LEGACY) {
          // Spouse gets everything
          distributionData.shares = [estateValue];
          distributionData.labels = ['Spouse/Civil Partner'];
          distributionData.colors = ['#4B9CD3'];
          distributionData.beneficiaries = ['Spouse/Civil Partner'];

          return {
            text: `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`,
            data: distributionData
          };
        }

        const remainder = estateValue - this.STATUTORY_LEGACY;
        const spouseShare = this.STATUTORY_LEGACY + (remainder / 2);
        const childrenShare = remainder / 2;

        // Create distribution data
        distributionData.shares = [spouseShare, childrenShare];
        distributionData.labels = ['Spouse/Civil Partner', 'Children'];
        distributionData.colors = ['#4B9CD3', '#95D47A'];
        distributionData.beneficiaries = ['Spouse/Civil Partner', 'Children'];

        let childrenDistributionText = "Your children";
        if (this.state.childrenDeceased) {
          if (this.state.deceasedChildrenHadChildren) {
            childrenDistributionText = "Your living children and the children of your deceased children (who will share their parent's portion per stirpes)";
          } else {
            childrenDistributionText = "Your living children"; // Deceased children had no issue
          }
        } else {
          childrenDistributionText = "Your children"; // No deceased children
        }

        return {
          text: (
            `Your estate will be distributed as follows:\n` +
            `• Your spouse/civil partner will receive:\n` +
            `  - First ${this.formatCurrency(this.STATUTORY_LEGACY)} as statutory legacy\n` +
            `  - Plus an absolute interest in ${this.formatCurrency(remainder / 2)} (half of the remainder)\n` +
            `• ${childrenDistributionText} will share: ${this.formatCurrency(childrenShare)} (half of the remainder). The children's share of the residue is held on statutory trusts.\n` +
            `• The capital of your spouse's absolute interest portion will pass to the children upon your spouse's death.`
          ),
          data: distributionData
        };
      }
    }

    // Non-spouse rules - use the shared hierarchy method
    const hierarchy = this._resolveHierarchyBeneficiary();

    distributionData.shares = [estateValue];
    distributionData.labels = [hierarchy.label];
    distributionData.colors = [hierarchy.color];
    distributionData.beneficiaries = [hierarchy.label];

    if (hierarchy.beneficiaryClass === 'crown') {
      return {
        text: `Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`,
        data: distributionData
      };
    }

    if (hierarchy.beneficiaryClass === 'parents') {
      return {
        text: `Your entire estate of ${formattedValue} will pass to ${hierarchy.distributionText}.`,
        data: distributionData
      };
    }

    if (hierarchy.beneficiaryClass === 'grandparents') {
      return {
        text: `Your entire estate of ${formattedValue} will be divided equally between ${hierarchy.distributionText}.`,
        data: distributionData
      };
    }

    // Children, siblings, aunts/uncles all use "divided equally between" phrasing
    return {
      text: `Your entire estate of ${formattedValue} will be divided equally between ${hierarchy.distributionText}.`,
      data: distributionData
    };
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

    // Special condition for married with children and estate <= statutory legacy
    if (this.state.married && questionId === 'children' && answer === true) {
      if (this.state.estateValue <= this.STATUTORY_LEGACY) {
        return null; // End flow early, spouse gets all
      }
    }

    // Determine the next question based on the flow logic
    if (this.questionFlow[questionId]) {
      return this.questionFlow[questionId](this.state[questionId]);
    }

    return null;
  }

  /**
   * Answer a question and update the state
   * @param {string} questionId - The ID of the question being answered
   * @param {boolean} answer - The user's answer (true for Yes, false for No)
   */
  answerQuestion(questionId, answer) {
    // Update the state with the user's answer
    this.state[questionId] = answer;

    // Store the current question ID for getNextQuestionId to use
    this._lastQuestionId = questionId;
  }

  /**
   * Get the next question ID based on the last answered question
   * @returns {string|null} - The ID of the next question to ask, or null if there is no next question
   */
  getNextQuestionId() {
    if (!this._lastQuestionId || !this.questionFlow[this._lastQuestionId]) {
      return null;
    }

    // Special condition for married with children and estate <= statutory legacy
    if (this.state.married && this._lastQuestionId === 'children' && this.state.children === true) {
      if (this.state.estateValue <= this.STATUTORY_LEGACY) {
        return null; // End flow early, spouse gets all
      }
    }

    return this.questionFlow[this._lastQuestionId](this.state[this._lastQuestionId]);
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
   * Get a text representation of the inheritance hierarchy
   * @param {number} estateValue - The value of the estate
   * @returns {string} - Text describing the inheritance hierarchy
   */
  getInheritanceHierarchyText(estateValue) {
    const formattedValue = this.formatCurrency(estateValue);
    const hierarchy = this._resolveHierarchyBeneficiary();

    if (hierarchy.beneficiaryClass === 'crown') {
      return `  - Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
    }

    if (hierarchy.beneficiaryClass === 'parents') {
      return `  - Your entire estate of ${formattedValue} will pass to ${hierarchy.distributionText}.`;
    }

    return `  - Your entire estate of ${formattedValue} will be divided equally between ${hierarchy.distributionText}.`;
  }

  /**
   * Check if we have enough information to determine distribution
   * @returns {boolean} - True if we can determine distribution, false otherwise
   */
  canDetermineDistribution() {
    // For married people, we MUST know if they have children
    if (this.state.married) {
      // If we don't know if they have children, we need to ask
      if (this.state.children === null) {
        return false;
      }

      // If they have children, we need to know if estate > statutory legacy
      // and if any children are deceased (and if those deceased children had issue).
      if (this.state.children) {
        if (this.state.estateValue <= this.STATUTORY_LEGACY) {
          return true; // Spouse gets everything, no further questions needed about children's status
        }
        // Estate > statutory legacy, need more info about children
        if (this.state.childrenDeceased === null) return false;
        if (this.state.childrenDeceased && this.state.deceasedChildrenHadChildren === null) return false;
        return true;
      }

      return true; // Married with no children, spouse gets everything
    }

    // Unmarried cases (including cohabiting for question flow, distribution handles cohabiting separately)
    if (this.state.children) {
      if (this.state.childrenDeceased === null) return false;
      if (this.state.childrenDeceased && this.state.deceasedChildrenHadChildren === null) return false;
      return true;
    }
    if (this.state.children === false && this.state.parentsAlive === null) return false;
    if (this.state.parentsAlive) return true;

    if (this.state.parentsAlive === false && this.state.siblings === null) return false;
    if (this.state.siblings) { // General siblings flag is true
        // Need to know if there are full OR half siblings
        if (this.state.fullSiblings === null && this.state.halfSiblings === null) return false;

        if (this.state.fullSiblings) { // If they have full siblings
            if (this.state.siblingsDeceasedWithChildren === null) return false;
            return true;
        }
        // If no full siblings (fullSiblings is false), then check half siblings
        if (this.state.fullSiblings === false) {
            if (this.state.halfSiblings === null) return false; // Need to know about half if no full
            if (this.state.halfSiblings) { // If they have half siblings
                if (this.state.siblingsDeceasedWithChildren === null) return false;
                return true;
            }
            // No full siblings and no half siblings (but siblings was true - implies flow error or direct state manipulation)
            // If siblings is true, but fullSiblings is false and halfSiblings is false, then it means no siblings of any kind inherit.
            // This path should lead to grandparents.
            // However, canDetermineDistribution is about whether we have *enough* info for the *current* category.
            // If siblings is true, fullSiblings is false, halfSiblings is false, we have enough info about siblings (i.e., none that inherit).
            return true;
        }
        return false; // If fullSiblings is null, but halfSiblings might be true/false/null
    }

    if (this.state.siblings === false && this.state.grandparents === null) return false;
    if (this.state.grandparents) return true;

    if (this.state.grandparents === false && this.state.auntsUncles === null) return false;
    if (this.state.auntsUncles) { // General aunts/uncles flag is true
        if (this.state.fullAuntsUncles === null && this.state.halfAuntsUncles === null) return false;

        if (this.state.fullAuntsUncles) {
            if (this.state.auntsUnclesDeceasedWithChildren === null) return false;
            return true;
        }
        if (this.state.fullAuntsUncles === false) {
            if (this.state.halfAuntsUncles === null) return false;
            if (this.state.halfAuntsUncles) {
                if (this.state.auntsUnclesDeceasedWithChildren === null) return false;
                return true;
            }
            return true; // No full, no half aunts/uncles
        }
        return false; // If fullAuntsUncles is null
    }
    // If no relatives found through aunts/uncles (i.e., auntsUncles is false), it's bona vacantia (Crown)
    if (this.state.auntsUncles === false) return true;

    return false; // Default if no other condition met, means more info needed
  }
}

// Export the class for use in other modules
export default IntestacyCalculator;

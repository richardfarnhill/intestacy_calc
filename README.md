# UK Intestacy Calculator

An interactive web application that helps determine estate distribution according to UK intestacy rules when someone dies without a will.

## Core Requirements

### Initial Screen
The application must start by asking only these questions in order:
1. "Hi, what is your name?"
2. "What is your approximate estate value?"
3. "What is your relationship status?" (Radio selection)
4. "Do you have any children?" (Yes/No)

### Question Flow Rules
- Only show one question at a time
- Only proceed to the next question if needed based on previous answers
- Do not display any further questions if distribution can be determined
- Do not show results box until final determination is made

### Distribution Rules
1. If married with no children:
   - Entire estate goes to spouse
   
2. If married with children:
   - If estate ≤ £322,000: Entire estate to spouse
   - If estate > £322,000: First £322,000 to spouse, remainder split equally between spouse and children

3. If not married, follow this order of questions:
   1. Children
   2. Grandchildren
   3. Great-grandchildren
   4. Parents
   5. Siblings
   6. Grandparents
   7. Aunts/Uncles

### Output Format
- Always include the person's name in the response
- Always end with: "If you wish to change this, you will need to create a Will"
- Only show output when final determination is made

## Features

- Step-by-step questionnaire interface
- Handles statutory legacy amount (£322,000) for married couples
- Calculates exact monetary distributions
- Clear explanation of inheritance shares
- Personal, user-focused interaction

## Installation

```bash
pip install gradio
```

## Usage

1. Run the application:
```bash
python estate_distribution.py
```

2. Enter your estate value
3. Answer the questions about your family circumstances
4. Review the calculated distribution of your estate

## Inheritance Rules

The rules of intestacy in England and Wales follow this order:

1. Spouse/Civil Partner and Children
   - If estate is worth £322,000 or less:
     * Everything goes to the spouse/civil partner
   - If estate is worth more than £322,000:
     * Spouse receives first £322,000
     * Remaining amount is split 50/50 between spouse and children
     * Children's share is divided equally between them

2. Spouse/Civil Partner (no children)
   * Entire estate goes to spouse/civil partner

## Legal Disclaimer

This calculator provides general guidance based on UK intestacy rules. For legal advice specific to your situation, please consult a qualified legal professional.

## Requirements

- Python 3.x
- Gradio library

## License

MIT License

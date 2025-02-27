# UK Intestacy Calculator

An interactive calculator that helps you understand how your estate would be distributed if you die without making a will.

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

- Step-by-step guided questionnaire
- Accurate statutory legacy calculations (£322,000)
- Input validation and error handling
- Clear, personalized results
- Comprehensive test coverage

## Installation

```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
python estate_distribution.py
```

2. Enter your details and estate value
3. Answer each question about your circumstances
4. Review your personalized estate distribution calculation

## Development

### Running Tests
```bash
pytest test_estate_distribution.py -v
```

### Project Structure
- `estate_distribution.py` - Main application logic
- `test_estate_distribution.py` - Unit tests
- `requirements.txt` - Project dependencies

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

This calculator provides guidance based on UK intestacy rules. For legal advice, please consult a qualified professional.

## Requirements

- Python 3.8+
- Gradio
- pytest (for testing)

## License

MIT License

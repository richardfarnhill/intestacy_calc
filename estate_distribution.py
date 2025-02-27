import gradio as gr
from decimal import Decimal
from typing import Dict, List, Optional, Tuple

class IntestacyCalculator:
    STATUTORY_LEGACY = Decimal('322000.00')
    
    def __init__(self):
        self.state = {
            "name": None,
            "estate_value": None,
            "married": None,
            "children": None,
            "parents_alive": None,
            "current_question": 0
        }
        self.questions = [
            "Are you married or in a civil partnership?",
            "Do you have any children or grandchildren?",
            "Are either of your parents alive?"
        ]

    def validate_estate_value(self, value: float) -> Tuple[bool, str]:
        try:
            if value is None:
                return False, "Please enter your estate value"
            value = float(value)
            if value <= 0:
                return False, "Your estate value must be greater than £0"
            return True, ""
        except (ValueError, TypeError):
            return False, "Please enter a valid number"

    def format_currency(self, amount: Decimal) -> str:
        return f"£{amount:,.2f}"

    def calculate_distribution(self) -> str:
        estate_value = Decimal(str(self.state["estate_value"]))
        
        if self.state["married"]:
            if self.state["children"]:
                if estate_value <= self.STATUTORY_LEGACY:
                    return f"Your entire estate of {self.format_currency(estate_value)} will go to your spouse/civil partner"
                remainder = estate_value - self.STATUTORY_LEGACY
                spouse_share = self.STATUTORY_LEGACY + (remainder / 2)
                children_share = remainder / 2
                return (
                    f"Your estate will be distributed as follows:\n"
                    f"• Your spouse/civil partner will receive: {self.format_currency(spouse_share)}\n"
                    f"• Your children will share equally: {self.format_currency(children_share)}"
                )
            return f"Your entire estate of {self.format_currency(estate_value)} will go to your spouse/civil partner"
        
        if self.state["children"]:
            return f"Your entire estate of {self.format_currency(estate_value)} will be divided equally between your children"
        
        if self.state["parents_alive"]:
            return f"Your entire estate of {self.format_currency(estate_value)} will go to your surviving parents"
        
        return f"Your estate of {self.format_currency(estate_value)} will pass to the Crown (Bona Vacantia)"

    def process_answer(self, answer: bool) -> str:
        """Process user's answer and return next question or result"""
        current = self.state["current_question"]
        if current == 0:
            self.state["married"] = answer
        elif current == 1:
            self.state["children"] = answer
        elif current == 2:
            self.state["parents_alive"] = answer
            
        if self.can_determine_distribution():
            return self.calculate_distribution()
            
        self.state["current_question"] += 1
        return self.questions[self.state["current_question"]] if self.state["current_question"] < len(self.questions) else self.calculate_distribution()

    def can_determine_distribution(self) -> bool:
        """Check if we have enough information to determine distribution"""
        if self.state["married"] and not self.state["children"]:
            return True
        if self.state["children"]:
            return True
        if self.state["parents_alive"] is not None:
            return True
        return False

def create_interface():
    calculator = IntestacyCalculator()
    
    with gr.Blocks() as app:
        gr.Markdown("## UK Intestacy Calculator")
        gr.Markdown("Find out how your estate would be distributed if you die without a will")
        
        # State tracking
        state = gr.State({
            "current_step": "name",
            "name": "",
            "estate_value": None
        })
        
        # Input components
        name_input = gr.Textbox(label="What is your name?", visible=True)
        estate_input = gr.Number(label="What is the approximate value of your estate (£)?", visible=False)
        status_input = gr.Radio(
            choices=["Single", "Married", "Divorced", "Widowed"],
            label="What is your relationship status?",
            visible=False
        )
        yes_no = gr.Radio(choices=["Yes", "No"], label="Your Answer", visible=False)
        result = gr.Textbox(label="Distribution Result", visible=False)
        
        def update_interface(name, estate, status, answer, current_state):
            if current_state["current_step"] == "name" and name:
                current_state["name"] = name
                current_state["current_step"] = "estate"
                return {
                    name_input: gr.update(visible=False),
                    estate_input: gr.update(visible=True),
                    status_input: gr.update(visible=False),
                    yes_no: gr.update(visible=False),
                    result: gr.update(visible=False),
                    state: current_state
                }
                
            if current_state["current_step"] == "estate" and estate is not None:
                valid, error = calculator.validate_estate_value(estate)
                if not valid:
                    return {
                        estate_input: gr.update(error=error),
                        state: current_state
                    }
                current_state["estate_value"] = estate
                current_state["current_step"] = "status"
                return {
                    name_input: gr.update(visible=False),
                    estate_input: gr.update(visible=False),
                    status_input: gr.update(visible=True),
                    yes_no: gr.update(visible=False),
                    result: gr.update(visible=False),
                    state: current_state
                }
                
            if current_state["current_step"] == "status" and status:
                calculator.state["name"] = current_state["name"]
                calculator.state["estate_value"] = current_state["estate_value"]
                calculator.state["married"] = (status == "Married")
                current_state["current_step"] = "children"
                return {
                    name_input: gr.update(visible=False),
                    estate_input: gr.update(visible=False),
                    status_input: gr.update(visible=False),
                    yes_no: gr.update(visible=True, label="Do you have any children?"),
                    result: gr.update(visible=False),
                    state: current_state
                }
                
            if current_state["current_step"] == "children" and answer:
                calculator.state["children"] = (answer == "Yes")
                result_text = calculator.calculate_distribution()
                result_text = f"{current_state['name']}, {result_text}. If you wish to change this, you will need to create a Will."
                return {
                    name_input: gr.update(visible=False),
                    estate_input: gr.update(visible=False),
                    status_input: gr.update(visible=False),
                    yes_no: gr.update(visible=False),
                    result: gr.update(visible=True, value=result_text),
                    state: current_state
                }
            
            return {state: current_state}
        
        next_button = gr.Button("Continue")
        next_button.click(
            fn=update_interface,
            inputs=[name_input, estate_input, status_input, yes_no, state],
            outputs=[name_input, estate_input, status_input, yes_no, result, state]
        )
    
    return app

if __name__ == "__main__":
    app = create_interface()
    app.launch()
